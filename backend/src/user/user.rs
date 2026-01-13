use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tokio::sync::mpsc;
use axum::extract::ws::Message;

pub type UID = String;

pub struct User {
    pub id: UID,
    pub name: String,
    alive: Arc<AtomicBool>,
    pub sender: mpsc::UnboundedSender<Message>,
}

impl User {
    pub fn new(id: UID, name: String, sender: mpsc::UnboundedSender<Message>) -> Self {
        Self {
            id,
            name,
            alive: Arc::new(AtomicBool::new(true)),
            sender,
        }
    }

    pub fn is_alive(&self) -> bool {
        self.alive.load(Ordering::Relaxed)
    }

    pub fn ping(&self) {
        self.alive.store(false, Ordering::Relaxed);
        let _ = self.sender.send(Message::Ping(vec![]));
    }

    pub fn mark_alive(&self) {
        self.alive.store(true, Ordering::Relaxed);
    }
}

