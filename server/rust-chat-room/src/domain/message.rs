use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Message {
    pub author_name: String,
    pub text: String,
    pub sent_at: DateTime<Utc>,
}
