use std::sync::Arc;
use tokio::sync::RwLock;
use tokio::time::{interval, Duration};
use tracing::info;
use crate::room::room_state::RoomState;
use crate::user::user::User;
use crate::types::messages::{IncomingMessage, OutgoingMessage, StateMessage, Observer, PickedValue};

const TEN_SECONDS: Duration = Duration::from_secs(10);

pub struct Room {
    id: String,
    players: Arc<RwLock<Vec<Arc<User>>>>,
    observers: Arc<RwLock<Vec<Arc<User>>>>,
    state: Arc<RwLock<RoomState>>,
}

impl Room {
    pub fn new(id: String) -> Self {
        let room = Self {
            id,
            players: Arc::new(RwLock::new(Vec::new())),
            observers: Arc::new(RwLock::new(Vec::new())),
            state: Arc::new(RwLock::new(RoomState::new())),
        };

        // Start health check task
        let players_clone = room.players.clone();
        let observers_clone = room.observers.clone();
        let state_clone = room.state.clone();

        tokio::spawn(async move {
            let mut interval = interval(TEN_SECONDS);
            loop {
                interval.tick().await;
                
                let mut players = players_clone.write().await;
                
                // Check players
                let dead_users: Vec<String> = players.iter()
                    .filter_map(|user| {
                        if !user.is_alive() {
                            Some(user.id.clone())
                        } else {
                            user.ping();
                            None
                        }
                    })
                    .collect();
                
                for user_id in &dead_users {
                    let mut state = state_clone.write().await;
                    state.remove_user(user_id);
                }
                
                players.retain(|user| !dead_users.contains(&user.id));

                // Check observers
                let mut observers = observers_clone.write().await;
                let dead_observers: Vec<String> = observers.iter()
                    .filter_map(|user| {
                        if !user.is_alive() {
                            Some(user.id.clone())
                        } else {
                            user.ping();
                            None
                        }
                    })
                    .collect();
                
                observers.retain(|user| !dead_observers.contains(&user.id));
            }
        });

        room
    }

    pub fn id(&self) -> &str {
        &self.id
    }

    pub async fn occupants(&self) -> usize {
        let state = self.state.read().await;
        let observers = self.observers.read().await;
        state.size() + observers.len()
    }

    pub async fn join(&self, user: Arc<User>) {
        let mut players = self.players.write().await;
        
        // Prevent duplicate users
        if players.iter().any(|p| p.id == user.id) {
            return;
        }

        players.push(user.clone());
        
        let mut state = self.state.write().await;
        state.add_user(&user.id, &user.name);

        // Send Identify message
        let identify = OutgoingMessage::Identify { id: user.id.clone() };
        if let Ok(json) = serde_json::to_string(&identify) {
            let _ = user.sender.send(axum::extract::ws::Message::Text(json));
        }
    }

    pub async fn observe(&self, user: Arc<User>) {
        let mut observers = self.observers.write().await;
        
        // Prevent duplicate observers
        if observers.iter().any(|o| o.id == user.id) {
            return;
        }

        observers.push(user.clone());

        // Send Identify message
        let identify = OutgoingMessage::Identify { id: user.id.clone() };
        if let Ok(json) = serde_json::to_string(&identify) {
            let _ = user.sender.send(axum::extract::ws::Message::Text(json));
        }
    }

    pub async fn leave(&self, user_id: &str) {
        let mut state = self.state.write().await;
        state.remove_user(user_id);

        let mut players = self.players.write().await;
        players.retain(|p| p.id != user_id);

        let mut observers = self.observers.write().await;
        observers.retain(|o| o.id != user_id);
    }

    pub async fn handle_message(&self, user_id: &str, user_name: &str, message: IncomingMessage) {
        match message {
            IncomingMessage::Clear => {
                let mut state = self.state.write().await;
                state.clear_all_picked();
                info!("User {} cleared choices in room {}", user_name, self.id);
            }
            IncomingMessage::PointsChosen { points } => {
                let mut state = self.state.write().await;
                state.user_picked(user_id, points);
                match points {
                    Some(p) => info!("User {} picked {} points in room {}", user_name, p, self.id),
                    None => info!("User {} cleared their pick in room {}", user_name, self.id),
                }
            }
            IncomingMessage::Reveal => {
                let mut state = self.state.write().await;
                state.reveal();
                info!("User {} revealed choices in room {}", user_name, self.id);
            }
            IncomingMessage::Ping => {
                // Handle ping if needed
            }
        }

        self.broadcast().await;
    }

    pub async fn broadcast(&self) {
        let state = self.state.read().await;
        let (revealed, users) = state.serialize();
        drop(state);

        let players = self.players.read().await;
        let observers = self.observers.read().await;

        let observer_list: Vec<Observer> = observers.iter()
            .map(|o| Observer { name: o.name.clone() })
            .collect();

        // Send to players
        for player in players.iter() {
            let mut user_states = users.clone();
            
            if !revealed {
                // Hide picks from other users
                for user_state in &mut user_states {
                    if user_state.id != player.id {
                        if user_state.picked != PickedValue::Null {
                            user_state.picked = PickedValue::True;
                        }
                    }
                }
            }

            let state_message = StateMessage::new(revealed, user_states, observer_list.clone());
            let outgoing = OutgoingMessage::State(state_message);
            
            if let Ok(json) = serde_json::to_string(&outgoing) {
                let _ = player.sender.send(axum::extract::ws::Message::Text(json));
            }
        }

        // Send to observers
        let state = self.state.read().await;
        let (revealed, users) = state.serialize();
        drop(state);

        let observer_payload = StateMessage::new(revealed, users, observer_list);
        let outgoing = OutgoingMessage::State(observer_payload);

        if let Ok(json) = serde_json::to_string(&outgoing) {
            for observer in observers.iter() {
                let _ = observer.sender.send(axum::extract::ws::Message::Text(json.clone()));
            }
        }
    }

    pub fn cleanup(&self) {
        // Cleanup is handled by the health check task ending when room is dropped
    }
}

