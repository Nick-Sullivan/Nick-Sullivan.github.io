#![allow(dead_code)]
use super::attribute_value_parser::parse_attribute_value;
use super::db_trait::IDatabase;
use crate::domain::{errors::LogicError, vec_utils};
use aws_sdk_dynamodb::operation::query::builders::QueryInputBuilder;
use aws_sdk_dynamodb::operation::transact_get_items::builders::TransactGetItemsOutputBuilder;
use aws_sdk_dynamodb::types::{
    AttributeValue, Delete, ItemResponse, Put, TransactGetItem, TransactWriteItem,
};
use axum::async_trait;
use std::collections::HashMap;
use std::sync::RwLock;

pub struct FakeItem {
    pub hash_map: HashMap<String, AttributeValue>,
}

pub struct DatabaseLocal {
    table: RwLock<HashMap<String, FakeItem>>,
    primary_key_column: String,
}

impl DatabaseLocal {
    pub async fn new() -> Self {
        let table = RwLock::new(HashMap::new());
        let primary_key_column = "id".to_string();
        DatabaseLocal {
            table,
            primary_key_column,
        }
    }

    fn write_put(&self, put: Put) -> Result<(), LogicError> {
        let primary_key = parse_attribute_value::<String>(put.item.get(&self.primary_key_column))?;
        let item = FakeItem {
            hash_map: put.item.clone(),
        };
        let mut hash_map = self.table.write().unwrap();
        hash_map.insert(primary_key.to_string(), item);
        Ok(())
    }

    fn write_delete(&self, delete: Delete) -> Result<(), LogicError> {
        let primary_key =
            parse_attribute_value::<String>(delete.key.get(&self.primary_key_column))?;
        let mut hash_map = self.table.write().unwrap();
        hash_map.remove(&primary_key.to_string());
        Ok(())
    }
}

#[async_trait]
impl IDatabase for DatabaseLocal {
    async fn read_single(&self, item: TransactGetItem) -> Result<ItemResponse, LogicError> {
        let get = item.get.ok_or(LogicError::DatabaseError(
            "Only Gets are supported".to_string(),
        ))?;
        let hash_map = self.table.read().unwrap();
        let primary_key = parse_attribute_value::<String>(get.key.get(&self.primary_key_column))?;
        let item = hash_map
            .get(&primary_key)
            .ok_or(LogicError::DatabaseError("Item not found".to_string()))?;

        let item_response = ItemResponse::builder()
            .set_item(Some(item.hash_map.clone()))
            .build();
        let output = TransactGetItemsOutputBuilder::default()
            .responses(item_response)
            .build();
        let items = output
            .responses
            .ok_or(LogicError::DatabaseError("No response".to_string()))?;
        let item =
            vec_utils::single(items).map_err(|e| LogicError::DatabaseError(e.to_string()))?;
        Ok(item)
    }

    async fn write(&self, items: Vec<TransactWriteItem>) -> Result<(), LogicError> {
        for item in items {
            self.write_single(item).await?;
        }
        Ok(())
    }

    async fn write_single(&self, item: TransactWriteItem) -> Result<(), LogicError> {
        if let Some(put) = item.put {
            self.write_put(put)?;
        } else if let Some(delete) = item.delete {
            self.write_delete(delete)?;
        } else {
            return Err(LogicError::DatabaseError(
                "Only Put/Delete is supported".to_string(),
            ));
        }
        Ok(())
    }

    async fn query(
        &self,
        query: QueryInputBuilder,
    ) -> Result<Vec<HashMap<String, AttributeValue>>, LogicError> {
        let hash_map = self.table.read().unwrap();
        let built = query
            .build()
            .map_err(|e| LogicError::DatabaseError(e.to_string()))?;
        let values = built
            .expression_attribute_values()
            .ok_or(LogicError::DatabaseError(
                "No expression attribute values".to_string(),
            ))?;
        let requested_room_id = parse_attribute_value::<String>(values.get(":room_id"))?;
        let mut results = vec![];
        for (_, value) in hash_map.iter() {
            let room_id = parse_attribute_value::<String>(value.hash_map.get("room_id"))?;
            if room_id == requested_room_id {
                results.push(value.hash_map.clone());
            }
        }
        Ok(results)
    }
}
