use crate::types::messages::UserState;

pub struct RoomState {
    users: Vec<UserState>,
    revealed: bool,
}

impl RoomState {
    pub fn new() -> Self {
        Self {
            users: Vec::new(),
            revealed: false,
        }
    }

    pub fn size(&self) -> usize {
        self.users.len()
    }

    pub fn add_user(&mut self, id: &str, name: &str) {
        self.users.push(UserState {
            id: id.to_string(),
            name: name.to_string(),
            picked: crate::types::messages::PickedValue::Null,
        });
    }

    pub fn remove_user(&mut self, id: &str) {
        self.users.retain(|u| u.id != id);
    }

    pub fn user_picked(&mut self, id: &str, picked: Option<u32>) {
        if let Some(user) = self.users.iter_mut().find(|u| u.id == id) {
            user.picked = if let Some(points) = picked {
                crate::types::messages::PickedValue::Number(points)
            } else {
                crate::types::messages::PickedValue::Null
            };
        }
    }

    pub fn clear_all_picked(&mut self) {
        for user in &mut self.users {
            user.picked = crate::types::messages::PickedValue::Null;
        }
        self.revealed = false;
    }

    pub fn reveal(&mut self) {
        self.revealed = true;
    }

    pub fn serialize(&self) -> (bool, Vec<UserState>) {
        (self.revealed, self.users.clone())
    }

    pub fn get_users(&self) -> &[UserState] {
        &self.users
    }
}

