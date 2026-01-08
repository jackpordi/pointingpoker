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

    pub async fn get_or_create(&self, id: String) -> Arc<Room> {
        let mut rooms = self.rooms.write().await;
        
        if let Some(room) = rooms.get(&id) {
            return room.clone();
        }

        let room = Arc::new(Room::new(id.clone()));
        rooms.insert(id, room.clone());
        room
    }

    pub async fn has_room(&self, id: &str) -> bool {
        let rooms = self.rooms.read().await;
        rooms.contains_key(id)
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

// Global singleton instance
lazy_static::lazy_static! {
    pub static ref MANAGER: RoomManager = RoomManager::new();
}

