use std::collections::HashMap;

use crate::domain::errors::LogicError;
use aws_sdk_dynamodb::{
    operation::query::builders::QueryInputBuilder,
    types::{AttributeValue, ItemResponse, TransactGetItem, TransactWriteItem},
};
use axum::async_trait;

#[async_trait]
pub trait IDatabase: Send + Sync {
    async fn read_single(&self, item: TransactGetItem) -> Result<ItemResponse, LogicError>;
    async fn write(&self, items: Vec<TransactWriteItem>) -> Result<(), LogicError>;
    async fn write_single(&self, item: TransactWriteItem) -> Result<(), LogicError>;
    async fn query(
        &self,
        query: QueryInputBuilder,
    ) -> Result<Vec<HashMap<String, AttributeValue>>, LogicError>;
}
