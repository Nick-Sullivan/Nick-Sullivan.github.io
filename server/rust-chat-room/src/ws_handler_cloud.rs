mod database;
mod domain;
mod notifier;
mod service;

use axum::{body::Body, extract::State, http::Request, routing::any, Router};
use database::{db_cloud::DatabaseCloud, db_trait::IDatabase};
use domain::{errors::LogicError, tracing_utils};
use lambda_http::{
    aws_lambda_events::apigw::ApiGatewayWebsocketProxyRequestContext, request::RequestContext,
    RequestExt,
};
use notifier::{notifier_cloud::NotifierCloud, notifier_trait::INotifier};
use std::{error::Error, sync::Arc};
use tower_http::trace::TraceLayer;

struct AppState {
    database: Arc<dyn IDatabase>,
    notifier: Arc<dyn INotifier>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error + Send + Sync>> {
    tracing_utils::init_tracing();
    let state = make_state().await;
    let trace_layer = TraceLayer::new_for_http().on_request(tracing_utils::trace_on_request);
    let app = Router::new()
        .route("/", any(handle_websocket))
        .with_state(state)
        .layer(trace_layer);
    let lambda_app = tower::ServiceBuilder::new()
        .layer(axum_aws_lambda::LambdaLayer::default())
        .service(app);
    lambda_http::run(lambda_app).await?;
    Ok(())
}

async fn make_state() -> Arc<AppState> {
    Arc::new(AppState {
        database: Arc::new(DatabaseCloud::new().await),
        notifier: Arc::new(NotifierCloud::new().await),
    })
}

#[axum::debug_handler]
async fn handle_websocket(
    State(state): State<Arc<AppState>>,
    request: Request<Body>,
) -> Result<(), LogicError> {
    let database = state.database.clone();
    let notifier = state.notifier.clone();
    let context = parse_context(&request.request_context()).await?;
    let message = parse_body(request.into_body()).await?;
    let route_key = context
        .route_key
        .ok_or(LogicError::BadRequest("no route key".to_string()))?;
    let request_id = context
        .request_id
        .ok_or(LogicError::BadRequest("no request id".to_string()))?;
    let connection_id = context
        .connection_id
        .ok_or(LogicError::BadRequest("no connection id".to_string()))?;

    tracing::info!(
        route_key = %route_key,
        request_id = %request_id,
        connection_id = %connection_id,
        message = %message,
    );
    match route_key.as_str() {
        "$connect" => {
            service::on_connect::on_connect(&connection_id, &database).await?;
        }
        "$disconnect" => {
            service::on_disconnect::on_disconnect(&connection_id, &database).await?;
        }
        "$default" => {
            service::on_message::on_message(&connection_id, &message, &notifier, &database).await?;
        }
        _ => return Err(LogicError::BadRequest("unrecognised route key".to_string())),
    }
    Ok(())
}

async fn parse_context(
    ctx: &RequestContext,
) -> Result<ApiGatewayWebsocketProxyRequestContext, LogicError> {
    // let ctx_str = serde_json::to_string(&ctx)
    //     .map_err(|_| LogicError::BadRequest("cant parse context".to_string()))?;
    match ctx {
        RequestContext::WebSocket(ctx) => {
            return Ok(ctx.clone());
        }
        _ => return Err(LogicError::BadRequest("bad context".to_string())),
    }
}

async fn parse_body(body: Body) -> Result<String, LogicError> {
    let limit = 2048usize;
    let bytes = axum::body::to_bytes(body, limit)
        .await
        .map_err(|_| LogicError::BadRequest("cant parse body".to_string()))?;
    let body_str = String::from_utf8(bytes.to_vec())
        .map_err(|_| LogicError::BadRequest("cant parse body".to_string()))?;
    Ok(body_str)
}
