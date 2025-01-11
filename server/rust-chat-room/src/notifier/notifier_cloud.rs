#![allow(dead_code)]
use super::notifier_trait::INotifier;
use crate::domain::{errors::LogicError, message::Message};
use aws_config::{meta::region::RegionProviderChain, BehaviorVersion};
use aws_sdk_apigatewaymanagement::{config::Region, primitives::Blob, Client};
use axum::async_trait;
use std::env;

pub struct NotifierCloud {
    client: Client,
}

impl NotifierCloud {
    pub async fn new() -> Self {
        let region_name = env::var("AWS_REGION").unwrap_or("".to_string());
        let gateway_url = env::var("API_GATEWAY_URL").unwrap_or("".to_string());
        let region_provider =
            RegionProviderChain::first_try(Region::new(region_name)).or_default_provider();
        let config = aws_config::defaults(BehaviorVersion::latest())
            .region(region_provider)
            .endpoint_url(gateway_url.replace("wss", "https"))
            .load()
            .await;
        let client = Client::new(&config);
        NotifierCloud { client }
    }
}

#[async_trait]
impl INotifier for NotifierCloud {
    async fn notify(&self, connection_id: &str, message: &Message) -> Result<(), LogicError> {
        tracing::info!(
            "notifying connection {} with message {}",
            connection_id,
            message.text
        );

        let message_json = serde_json::to_string(message)
            .map_err(|e| LogicError::WebsocketError(e.to_string()))?;

        self.client
            .post_to_connection()
            .connection_id(connection_id)
            .data(Blob::new(message_json.as_bytes().to_vec()))
            .send()
            .await
            .map_err(|e| LogicError::WebsocketError(e.to_string()))?;
        Ok(())
    }
}
