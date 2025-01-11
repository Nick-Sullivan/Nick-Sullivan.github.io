#![allow(dead_code)]
use super::{
    attribute_value_parser::{parse_attribute_value, DATETIME_FORMAT},
    db_trait::IDatabase,
};
use crate::domain::{errors::LogicError, websocket_record::WebsocketRecord};
use aws_sdk_dynamodb::operation::query::QueryInput;
use aws_sdk_dynamodb::types::{AttributeValue, Get, Put, TransactGetItem, TransactWriteItem};
use chrono::{DateTime, Utc};
use std::{collections::HashMap, env, sync::Arc};

pub struct WebsocketTable {}

impl WebsocketTable {
    pub async fn from_db(
        id: &str,
        database: &Arc<dyn IDatabase>,
    ) -> Result<WebsocketRecord, LogicError> {
        let transaction = Self::get(id)?;
        let output = database.read_single(transaction).await?;
        let attribute = output
            .item
            .ok_or(LogicError::DatabaseError("Item not found".to_string()))?;
        let item = Self::from_map(&attribute)?;
        Ok(item)
    }

    pub async fn to_db(
        record: &WebsocketRecord,
        db: &Arc<dyn IDatabase>,
    ) -> Result<(), LogicError> {
        let transaction = Self::save(record)?;
        db.write_single(transaction).await
    }

    pub async fn get_room_connections(
        room_id: &str,
        db: &Arc<dyn IDatabase>,
    ) -> Result<Vec<WebsocketRecord>, LogicError> {
        let query = QueryInput::builder()
            .table_name(Self::get_table_name())
            .index_name("room_id_index")
            .key_condition_expression("room_id = :room_id")
            .expression_attribute_values(":room_id", AttributeValue::S(room_id.to_string()));
        let output = db.query(query).await?;
        let mut items = vec![];
        for item in output {
            let item = Self::from_map(&item)?;
            items.push(item);
        }
        Ok(items)
    }

    fn from_map(hash_map: &HashMap<String, AttributeValue>) -> Result<WebsocketRecord, LogicError> {
        let id = parse_attribute_value::<String>(hash_map.get("id"))?;
        let room_id = parse_attribute_value::<String>(hash_map.get("room_id"))?;
        let name = parse_attribute_value::<String>(hash_map.get("name"))?;
        let modified_at = parse_attribute_value::<DateTime<Utc>>(hash_map.get("modified_at"))?;
        let item = WebsocketRecord {
            id,
            room_id,
            name,
            modified_at,
        };
        Ok(item)
    }

    fn get_table_name() -> String {
        env::var("WEBSOCKET_TABLE_NAME").unwrap_or_else(|_| "".to_string())
    }

    fn get(id: &str) -> Result<TransactGetItem, LogicError> {
        let get_item = Get::builder()
            .table_name(Self::get_table_name())
            .key("id", AttributeValue::S(id.to_string()))
            .build()
            .map_err(|e| LogicError::DatabaseError(e.to_string()))?;
        let transaction_item = TransactGetItem::builder().get(get_item).build();
        Ok(transaction_item)
    }

    pub fn save(record: &WebsocketRecord) -> Result<TransactWriteItem, LogicError> {
        let put_item = Put::builder()
            .table_name(Self::get_table_name())
            .item("id", AttributeValue::S(record.id.to_string()))
            .item(
                "modified_at",
                AttributeValue::S(record.modified_at.format(DATETIME_FORMAT).to_string()),
            )
            .item("room_id", AttributeValue::S(record.room_id.to_string()))
            .item("name", AttributeValue::S(record.name.to_string()));

        let put_item = put_item
            .build()
            .map_err(|e| LogicError::DatabaseError(e.to_string()))?;
        let transaction_item = TransactWriteItem::builder().put(put_item).build();
        Ok(transaction_item)
    }

    pub fn delete(record: &WebsocketRecord) -> Result<TransactWriteItem, LogicError> {
        let delete_item = aws_sdk_dynamodb::types::Delete::builder()
            .table_name(Self::get_table_name())
            .key("id", AttributeValue::S(record.id.to_string()))
            .build()
            .map_err(|e| LogicError::DatabaseError(e.to_string()))?;
        let transaction_item = TransactWriteItem::builder().delete(delete_item).build();
        Ok(transaction_item)
    }
}
