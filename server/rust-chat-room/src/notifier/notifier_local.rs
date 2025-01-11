#![allow(dead_code)]
use crate::domain::errors::LogicError;
use crate::domain::message::Message;
use crate::notifier::notifier_trait::INotifier;
use axum::async_trait;
use axum::extract::ws::{Message as AxumMessage, WebSocket};
use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use tokio::sync::Mutex;

pub struct NotifierLocal {
    pub sockets: RwLock<HashMap<String, Arc<Mutex<WebSocket>>>>,
}

impl NotifierLocal {
    pub async fn new() -> Self {
        let sockets = RwLock::new(HashMap::new());
        NotifierLocal { sockets }
    }

    pub fn add_connection(&self, connection_id: &str, websocket: WebSocket) {
        let arc_websocket = Arc::new(Mutex::new(websocket));
        let mut sockets = self.sockets.write().unwrap();
        sockets.insert(connection_id.to_string(), arc_websocket);
    }

    pub fn get_connection(&self, connection_id: &str) -> Option<Arc<Mutex<WebSocket>>> {
        let sockets = self.sockets.read().unwrap();
        sockets.get(connection_id).cloned()
    }
}

#[async_trait]
impl INotifier for NotifierLocal {
    async fn notify(&self, connection_id: &str, message: &Message) -> Result<(), LogicError> {
        let message_json = serde_json::to_string(message)
            .map_err(|e| LogicError::WebsocketError(e.to_string()))?;

        let axum_message = AxumMessage::Text(message_json);
        let socket = {
            let sockets = self.sockets.read().unwrap();
            sockets.get(connection_id).cloned()
        };
        if let Some(socket) = socket {
            let mut socket = socket.lock().await;
            let _ = socket.send(axum_message).await;
        }
        Ok(())
    }
}
