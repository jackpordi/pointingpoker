use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Query,
    },
    response::Response,
};
use serde::Deserialize;
use std::sync::Arc;
use tokio::sync::mpsc;
use tracing::{info, warn, debug};
use uuid::Uuid;

use crate::room::room_manager::MANAGER;
use crate::types::messages::IncomingMessage;
use crate::user::user::User;

#[derive(Deserialize)]
pub struct WsQuery {
    name: Option<String>,
    room: Option<String>,
    observing: Option<String>,
}

pub async fn websocket_handler(
    ws: WebSocketUpgrade,
    Query(params): Query<WsQuery>,
) -> Response {
    let name = match params.name {
        Some(n) => n,
        None => {
            return axum::response::Response::builder()
                .status(axum::http::StatusCode::BAD_REQUEST)
                .body(axum::body::Body::from("Missing name parameter"))
                .unwrap()
                .into();
        }
    };

    let room_id = match params.room {
        Some(r) => r.to_uppercase(),
        None => {
            return axum::response::Response::builder()
                .status(axum::http::StatusCode::BAD_REQUEST)
                .body(axum::body::Body::from("Missing room parameter"))
                .unwrap()
                .into();
        }
    };

    let observing = params.observing.as_deref() == Some("true");

    ws.on_upgrade(move |socket| handle_socket(socket, name, room_id, observing))
}

use futures_util::{SinkExt, StreamExt};

async fn handle_socket(socket: WebSocket, name: String, room_id: String, observing: bool) {
    let (sender, mut receiver) = socket.split();
    let (tx, mut rx) = mpsc::unbounded_channel();

    let user_id = Uuid::new_v4().to_string();
    let user = Arc::new(User::new(user_id.clone(), name.clone(), tx));

    let room = MANAGER.get_or_create(room_id.clone()).await;

    if observing {
        room.observe(user.clone()).await;
        info!("Observer {} has joined room {}", name, room_id);
    } else {
        room.join(user.clone()).await;
        info!("Player {} has joined room {}", name, room_id);
    }

    room.broadcast().await;

    // Spawn task to send messages to the WebSocket
    let mut send_sender = sender;
    tokio::spawn(async move {
        while let Some(msg) = rx.recv().await {
            if send_sender.send(msg).await.is_err() {
                break;
            }
        }
    });

    // Handle incoming messages
    while let Some(result) = receiver.next().await {
        match result {
            Ok(Message::Text(text)) => {
                match serde_json::from_str::<IncomingMessage>(&text) {
                    Ok(message) => {
                        debug!("User {} sent message: {:?}", name, message);
                        room.handle_message(&user_id, &name, message).await;
                    }
                    Err(e) => {
                        warn!("Failed to parse message from {}: {}", name, e);
                    }
                }
            }
            Ok(Message::Ping(_)) => {
                // Handle ping - pong will be sent automatically by axum
                user.mark_alive();
            }
            Ok(Message::Pong(_)) => {
                user.mark_alive();
            }
            Ok(Message::Close(_)) => {
                break;
            }
            Err(e) => {
                warn!("WebSocket error for {}: {}", name, e);
                break;
            }
            _ => {}
        }
    }

    // Cleanup on disconnect
    info!("User {} has left the room", name);
    room.leave(&user_id).await;
    MANAGER.check_vacancy(&room_id).await;
    room.broadcast().await;
}

