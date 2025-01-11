use crate::domain::{errors::LogicError, message::Message};
use axum::async_trait;

#[async_trait]
pub trait INotifier: Send + Sync {
    async fn notify(&self, id: &str, message: &Message) -> Result<(), LogicError>;
}
