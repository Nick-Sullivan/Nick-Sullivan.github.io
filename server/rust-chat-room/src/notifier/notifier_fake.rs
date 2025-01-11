#![allow(dead_code)]
use crate::domain::errors::LogicError;
use crate::domain::message::Message;
use crate::notifier::notifier_trait::INotifier;
use axum::async_trait;
use std::collections::HashMap;
use std::sync::RwLock;

pub struct NotifierFake {
    pub log: RwLock<HashMap<String, Vec<String>>>,
}

impl NotifierFake {
    pub async fn new() -> Self {
        let log = RwLock::new(HashMap::new());
        NotifierFake { log }
    }

    pub fn get_log(&self, connection_id: &str) -> Vec<String> {
        let hash_map = self.log.read().unwrap();
        let default: Vec<String> = vec![];
        hash_map.get(connection_id).unwrap_or(&default).clone()
    }
}

#[async_trait]
impl INotifier for NotifierFake {
    async fn notify(&self, connection_id: &str, message: &Message) -> Result<(), LogicError> {
        let message_json = serde_json::to_string(message)
            .map_err(|e| LogicError::WebsocketError(e.to_string()))?;

        let mut hash_map: std::sync::RwLockWriteGuard<'_, HashMap<String, Vec<String>>> =
            self.log.write().unwrap();
        match hash_map.get_mut(connection_id) {
            Some(log) => log.push(message_json),
            None => {
                hash_map.insert(connection_id.to_string(), vec![message_json]);
            }
        }
        Ok(())
    }
}
