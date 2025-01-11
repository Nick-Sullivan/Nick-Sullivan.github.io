use crate::database::{db_trait::IDatabase, websocket_table::WebsocketTable};
use crate::domain::{errors::LogicError, websocket_record::WebsocketRecord};
use std::sync::Arc;

pub async fn on_connect(
    connection_id: &str,
    database: &Arc<dyn IDatabase>,
) -> Result<(), LogicError> {
    tracing::info!("on_connect!");
    let record = WebsocketRecord::new(connection_id);
    let transaction = WebsocketTable::save(&record)?;
    database.write_single(transaction).await
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::database::db_local::DatabaseLocal;

    #[tokio::test]
    async fn test_creates_new_record() {
        let id = "test";
        let db: Arc<dyn IDatabase> = Arc::new(DatabaseLocal::new().await);
        let result = on_connect(id, &db).await;
        assert!(result.is_ok());
        let record = WebsocketTable::from_db(id, &db).await;
        assert!(record.is_ok());
    }
}
