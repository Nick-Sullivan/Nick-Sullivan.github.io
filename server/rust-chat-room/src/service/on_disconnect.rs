use crate::database::{db_trait::IDatabase, websocket_table::WebsocketTable};
use crate::domain::errors::LogicError;
use std::sync::Arc;

pub async fn on_disconnect(
    connection_id: &str,
    database: &Arc<dyn IDatabase>,
) -> Result<(), LogicError> {
    tracing::info!("on_disconnect!");
    let record = WebsocketTable::from_db(&connection_id, database).await?;
    let transaction = WebsocketTable::delete(&record)?;
    database.write_single(transaction).await
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::database::db_local::DatabaseLocal;
    use crate::domain::websocket_record::WebsocketRecord;

    #[tokio::test]
    async fn test_deletes_record() -> Result<(), LogicError> {
        let id = "test";
        let db: Arc<dyn IDatabase> = Arc::new(DatabaseLocal::new().await);
        WebsocketTable::to_db(&WebsocketRecord::new(id), &db).await?;
        let result = on_disconnect(id, &db).await;
        assert!(result.is_ok());
        let record = WebsocketTable::from_db(id, &db).await;
        assert!(record.is_err());
        Ok(())
    }
}
