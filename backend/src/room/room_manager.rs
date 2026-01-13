use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use crate::room::room::Room;

pub struct RoomManager {
    rooms: Arc<RwLock<HashMap<String, Arc<Room>>>>,
}

impl RoomManager {
    pub fn new() -> Self {
        Self {
            rooms: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    pub async fn get_or_create(&self, id: &str) -> Arc<Room> {
        let mut rooms = self.rooms.write().await;
        
        if let Some(room) = rooms.get(id) {
            return room.clone();
        }

        let room = Arc::new(Room::new(id.to_string()));
        rooms.insert(id.to_string(), room.clone());
        room
    }

    pub async fn check_vacancy(&self, id: &str) {
        let mut rooms = self.rooms.write().await;
        
        if let Some(room) = rooms.get(id) {
            if room.occupants().await == 0 {
                room.cleanup();
                rooms.remove(id);
            }
        }
    }
}

