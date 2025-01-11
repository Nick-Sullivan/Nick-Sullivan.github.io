mod database;
mod domain;
mod notifier;
mod service;

use axum::extract::ws::{Message, WebSocketUpgrade};
use axum::extract::State;
use axum::response::Response;
use axum::{routing::any, Router};
use database::db_cloud::DatabaseCloud;
use database::{db_local::DatabaseLocal, db_trait::IDatabase};
use domain::{errors::LogicError, tracing_utils};
use futures_util::stream::StreamExt;
use notifier::{notifier_local::NotifierLocal, notifier_trait::INotifier};
use std::env;
use std::{error::Error, sync::Arc};
use tokio::time;
use tower_http::trace::TraceLayer;
use uuid::Uuid;

struct AppState {
    database: Arc<dyn IDatabase>,
    notifier: Arc<NotifierLocal>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error + Send + Sync>> {
    tracing_utils::init_tracing();
    let state = make_state().await;
    let trace_layer = TraceLayer::new_for_http().on_request(tracing_utils::trace_on_request);
    let app = Router::new()
        .route("/", any(initialise_connection))
        .with_state(state)
        .layer(trace_layer);
    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
    Ok(())
}

async fn make_state() -> Arc<AppState> {
    let region_name = env::var("WEBSOCKET_TABLE_NAME");
    let database: Arc<dyn IDatabase> = match region_name {
        Ok(_) => Arc::new(DatabaseCloud::new().await),
        Err(_) => Arc::new(DatabaseLocal::new().await),
    };
    Arc::new(AppState {
        notifier: Arc::new(NotifierLocal::new().await),
        database,
    })
}

#[axum::debug_handler]
async fn initialise_connection(
    State(state): State<Arc<AppState>>,
    ws: WebSocketUpgrade,
) -> Result<Response, LogicError> {
    let database = state.database.clone();
    let notifier = state.notifier.clone();
    let request_id = Uuid::new_v4().to_string();
    service::on_connect::on_connect(&request_id, &database).await?;
    let response = ws.on_upgrade(move |socket| async move {
        notifier.add_connection(&request_id, socket);
        if let Err(e) = handle_socket(&request_id, notifier, database).await {
            tracing::error!("Error handling socket: {:?}", e);
        }
    });
    Ok(response)
}

async fn handle_socket(
    connection_id: &str,
    notifier_local: Arc<NotifierLocal>,
    database: Arc<dyn IDatabase>,
) -> Result<(), LogicError> {
    let notifier: Arc<dyn INotifier> = notifier_local.clone() as Arc<dyn INotifier>;
    loop {
        tokio::select! {
            msg = wait_for_message(connection_id, &notifier_local) => {
                if let Some(Ok(msg)) = msg {
                    if let Message::Text(text) = msg {
                        let result =
                            service::on_message::on_message(connection_id, &text, &notifier, &database)
                                .await;
                        if result.is_err() {
                            break;
                        }
                    }
                } else {
                    break;
                }
            },
            _ = time::sleep(time::Duration::from_millis(200)) => {
                // This branch unlocks the socket so we can receive messages
            }
        }
    }
    service::on_disconnect::on_disconnect(connection_id, &database).await?;
    Ok(())
}

async fn wait_for_message(
    connection_id: &str,
    notifier_local: &Arc<NotifierLocal>,
) -> Option<Result<Message, LogicError>> {
    let socket = notifier_local.get_connection(connection_id).unwrap();
    let mut socket = socket.lock().await;
    socket
        .next()
        .await
        .map(|result| result.map_err(|e| LogicError::WebsocketError(e.to_string())))
}
