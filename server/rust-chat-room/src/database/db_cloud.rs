#![allow(dead_code)]
use super::db_trait::IDatabase;
use crate::domain::{errors::LogicError, vec_utils};
use aws_config::meta::region::RegionProviderChain;
use aws_config::{self, BehaviorVersion};
use aws_sdk_dynamodb::operation::query::builders::QueryInputBuilder;
use aws_sdk_dynamodb::types::{AttributeValue, ItemResponse, TransactGetItem, TransactWriteItem};
use aws_sdk_dynamodb::{config::Region, Client};
use axum::async_trait;
use std::collections::HashMap;
use std::env;

pub struct DatabaseCloud {
    client: Client,
}

impl DatabaseCloud {
    pub async fn new() -> Self {
        let region_name = env::var("AWS_REGION").unwrap_or_else(|_| "eu-west-2".to_string());
        let region_provider =
            RegionProviderChain::first_try(Region::new(region_name)).or_default_provider();
        let config = aws_config::defaults(BehaviorVersion::latest())
            .region(region_provider)
            .load()
            .await;
        let client = Client::new(&config);
        DatabaseCloud { client }
    }
}

#[async_trait]
impl IDatabase for DatabaseCloud {
    async fn read_single(&self, item: TransactGetItem) -> Result<ItemResponse, LogicError> {
        let result = self
            .client
            .transact_get_items()
            .transact_items(item)
            .send()
            .await
            .map_err(|e| LogicError::DatabaseError(e.to_string()))?;
        let items = result
            .responses
            .ok_or(LogicError::DatabaseError("No response".to_string()))?;
        let item =
            vec_utils::single(items).map_err(|e| LogicError::DatabaseError(e.to_string()))?;
        Ok(item)
    }

    async fn write(&self, items: Vec<TransactWriteItem>) -> Result<(), LogicError> {
        tracing::info!("Writing items: {:?}", items);
        let result = self
            .client
            .transact_write_items()
            .set_transact_items(Some(items))
            .send()
            .await;
        match result {
            Ok(_) => Ok(()),
            Err(e) => Err(LogicError::DatabaseError(e.to_string())),
        }
    }

    async fn write_single(&self, item: TransactWriteItem) -> Result<(), LogicError> {
        self.write(vec![item]).await
    }

    async fn query(
        &self,
        query: QueryInputBuilder,
    ) -> Result<Vec<HashMap<String, AttributeValue>>, LogicError> {
        let result = query
            .send_with(&self.client)
            .await
            .map_err(|e| LogicError::DatabaseError(e.to_string()))?;
        let items = result
            .items
            .ok_or(LogicError::DatabaseError("No response".to_string()))?;
        Ok(items)
    }
}
