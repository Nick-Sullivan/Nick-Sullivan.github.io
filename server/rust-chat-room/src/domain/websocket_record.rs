#![allow(dead_code)]
use chrono::{DateTime, Utc};

pub struct WebsocketRecord {
    pub id: String,
    pub room_id: String,
    pub name: String,
    pub modified_at: DateTime<Utc>,
}

impl WebsocketRecord {
    pub fn new(id: &str) -> Self {
        WebsocketRecord {
            id: id.to_string(),
            room_id: uuid::Uuid::new_v4().to_string(),
            name: uuid::Uuid::new_v4().to_string(),
            modified_at: Utc::now(),
        }
    }

    pub fn new_with_room(id: &str, room_id: &str) -> Self {
        WebsocketRecord {
            id: id.to_string(),
            room_id: room_id.to_string(),
            name: uuid::Uuid::new_v4().to_string(),
            modified_at: Utc::now(),
        }
    }

    pub fn new_with_name(id: &str, name: &str) -> Self {
        WebsocketRecord {
            id: id.to_string(),
            room_id: uuid::Uuid::new_v4().to_string(),
            name: name.to_string(),
            modified_at: Utc::now(),
        }
    }
}
