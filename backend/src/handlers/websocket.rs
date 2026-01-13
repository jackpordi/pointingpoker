use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Query, State,
    },
    response::Response,
};
use futures_util::{SinkExt, StreamExt};
use serde::Deserialize;
use std::sync::Arc;
use tokio::sync::mpsc;
use tracing::{debug, info, warn};
use uuid::Uuid;

use crate::room::room_manager::RoomManager;
use crate::server::AppState;
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
    State(state): State<AppState>,
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

    let observing = match params.observing.as_deref() {
        Some("true") => true,
        _ => false,
    };
    let room_manager = state.room_manager.clone();

    ws.on_upgrade(move |socket| handle_socket(socket, name, room_id, observing, room_manager))
}

async fn handle_socket(
    socket: WebSocket,
    name: String,
    room_id: String,
    observing: bool,
    room_manager: Arc<RoomManager>,
) {
    let (sender, mut receiver) = socket.split();
    let (tx, mut rx) = mpsc::unbounded_channel();

    let user_id = Uuid::new_v4().to_string();
    let user_name = name.clone();
    let user = Arc::new(User::new(user_id.clone(), name, tx));

    let room = room_manager.get_or_create(&room_id).await;

    if observing {
        room.observe(user.clone()).await;
        info!("Observer {} has joined room {}", user_name, room_id);
    } else {
        room.join(user.clone()).await;
        info!("Player {} has joined room {}", user_name, room_id);
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
                        debug!("User {} sent message: {:?}", user_name, message);
                        room.handle_message(&user_id, &user_name, message).await;
                    }
                    Err(e) => {
                        warn!("Failed to parse message from {}: {}", user_name, e);
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
                warn!("WebSocket error for {}: {}", user_name, e);
                break;
            }
            _ => {}
        }
    }

    // Cleanup on disconnect
    info!("User {} has left the room", user_name);
    room.leave(&user_id).await;
    room_manager.check_vacancy(&room_id).await;
    room.broadcast().await;
}

