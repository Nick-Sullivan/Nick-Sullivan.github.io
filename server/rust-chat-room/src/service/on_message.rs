use crate::database::{db_trait::IDatabase, websocket_table::WebsocketTable};
use crate::domain::errors::LogicError;
use crate::domain::message::Message;
use crate::notifier::notifier_trait::INotifier;
use std::sync::Arc;

const USER_UPDATE_PREFIX: &str = "UserUpdate:";

pub async fn on_message(
    connection_id: &str,
    text: &str,
    notifier: &Arc<dyn INotifier>,
    database: &Arc<dyn IDatabase>,
) -> Result<(), LogicError> {
    tracing::info!("on_message!");
    if text.starts_with(USER_UPDATE_PREFIX) {
        let raw = text.trim_start_matches(USER_UPDATE_PREFIX);
        let (room_id, name) = parse_user_update_request(raw)?;
        let mut record = WebsocketTable::from_db(&connection_id, database).await?;
        record.room_id = room_id;
        record.name = name;
        let transaction = WebsocketTable::save(&record)?;
        database.write_single(transaction).await?;
        return Ok(());
    }
    let record = WebsocketTable::from_db(&connection_id, database).await?;
    let message = Message {
        text: text.to_string(),
        author_name: record.name,
        sent_at: chrono::Utc::now(),
    };
    let records = WebsocketTable::get_room_connections(&record.room_id, database).await?;
    for record in records {
        notifier.notify(&record.id, &message).await?;
    }

    Ok(())
}

fn parse_user_update_request(text: &str) -> Result<(String, String), LogicError> {
    // Expect a string in the form of "RoomId=room&Name=name"
    // We update both in a single message to avoid race conditions if we were
    // to update them separately
    let raw: &str = text.trim_start_matches(USER_UPDATE_PREFIX);
    let mut room_id = None;
    let mut name = None;
    for pair in raw.split('&') {
        let mut iter = pair.split('=');
        match iter.next() {
            Some("RoomId") => room_id = iter.next().map(|s| s.to_string()),
            Some("Name") => name = iter.next().map(|s| s.to_string()),
            _ => {}
        }
    }
    if let (Some(room_id), Some(name)) = (room_id, name) {
        Ok((room_id, name))
    } else {
        Err(LogicError::BadRequest(
            "Invalid user update request".to_string(),
        ))
    }
}
#[cfg(test)]
mod tests {
    use super::*;
    use crate::database::db_local::DatabaseLocal;
    use crate::domain::websocket_record::WebsocketRecord;
    use crate::notifier::notifier_fake::NotifierFake;
    use crate::notifier::notifier_local::NotifierLocal;
    use serde_json::from_str;
    use std::sync::Arc;

    #[tokio::test]
    async fn test_user_change_updates_record() -> Result<(), LogicError> {
        let id = "test";
        let room_id = "room";
        let name = "name";
        let text = format!("{}RoomId={}&Name={}", USER_UPDATE_PREFIX, room_id, name);
        let db: Arc<dyn IDatabase> = Arc::new(DatabaseLocal::new().await);
        WebsocketTable::to_db(&WebsocketRecord::new(id), &db).await?;
        let notifier: Arc<dyn INotifier> = Arc::new(NotifierLocal::new().await);
        let result = on_message(id, &text, &notifier, &db).await;
        assert!(result.is_ok());
        let record = WebsocketTable::from_db(id, &db).await?;
        assert!(record.room_id == room_id);
        assert!(record.name == name);
        Ok(())
    }

    #[tokio::test]
    async fn test_message_notifies_room() -> Result<(), LogicError> {
        // 3 records, 2 in the same room
        let id1 = "test1";
        let id2 = "test2";
        let id3 = "test3";
        let room = "room";
        let text = "hello";
        let db: Arc<dyn IDatabase> = Arc::new(DatabaseLocal::new().await);
        db.write(vec![
            WebsocketTable::save(&WebsocketRecord::new_with_room(id1, room))?,
            WebsocketTable::save(&WebsocketRecord::new_with_room(id2, room))?,
            WebsocketTable::save(&WebsocketRecord::new(id3))?,
        ])
        .await?;
        let notifier_fake = Arc::new(NotifierFake::new().await);
        let notifier: Arc<dyn INotifier> = notifier_fake.clone() as Arc<dyn INotifier>;
        on_message(id1, &text, &notifier, &db).await?;
        let log1 = notifier_fake.get_log(id1);
        let log2 = notifier_fake.get_log(id2);
        let log3 = notifier_fake.get_log(id3);
        assert_eq!(log1.len(), 1);
        assert_eq!(log2.len(), 1);
        assert_eq!(log3.len(), 0);
        let message1: Message = from_str(&log1[0])?;
        let message2: Message = from_str(&log1[0])?;
        assert_eq!(message1.text, text);
        assert_eq!(message2.text, text);
        Ok(())
    }
}
