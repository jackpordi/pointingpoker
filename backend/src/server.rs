use axum::{
    extract::Request,
    http::header,
    response::IntoResponse,
    routing::get,
    Router,
};
use std::sync::Arc;
use tower::ServiceBuilder;
use tower_http::{
    cors::CorsLayer,
    set_header::SetResponseHeaderLayer,
    trace::TraceLayer,
    compression::CompressionLayer,
};
use tracing::info;

use crate::handlers::{http, websocket};
use crate::room::room_manager::RoomManager;

#[derive(Clone)]
pub struct AppState {
    pub room_manager: Arc<RoomManager>,
}

pub fn create_app(state: AppState) -> Router {
    let cors = CorsLayer::permissive();

    let security_headers = ServiceBuilder::new()
        .layer(SetResponseHeaderLayer::overriding(
            header::X_CONTENT_TYPE_OPTIONS,
            header::HeaderValue::from_static("nosniff"),
        ))
        .layer(SetResponseHeaderLayer::overriding(
            header::X_FRAME_OPTIONS,
            header::HeaderValue::from_static("DENY"),
        ))
        .layer(SetResponseHeaderLayer::overriding(
            header::X_XSS_PROTECTION,
            header::HeaderValue::from_static("1; mode=block"),
        ))
        .layer(SetResponseHeaderLayer::overriding(
            header::STRICT_TRANSPORT_SECURITY,
            header::HeaderValue::from_static("max-age=31536000; includeSubDomains"),
        ))
        .layer(SetResponseHeaderLayer::overriding(
            header::CONTENT_SECURITY_POLICY,
            header::HeaderValue::from_static(
                "default-src 'self'; \
                 img-src 'self' https://*.googletagmanager.com https://*.google-analytics.com \
                 https://*.analytics.google.com https://*.g.doubleclick.net https://*.google.com; \
                 connect-src 'self' https://*.googletagmanager.com https://*.google-analytics.com \
                 https://*.analytics.google.com https://*.g.doubleclick.net https://*.google.com; \
                 script-src 'self' 'unsafe-inline' https://*.googletagmanager.com;"
            ),
        ));

    Router::new()
        .route("/ws", get(websocket::websocket_handler))
        .fallback_service(get(serve_spa))
        .with_state(state)
        .layer(cors)
        .layer(security_headers)
        .layer(CompressionLayer::new())
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(|request: &Request| {
                    tracing::info_span!(
                        "http_request",
                        method = %request.method(),
                        uri = %request.uri(),
                    )
                })
                .on_response(|response: &axum::response::Response, latency: std::time::Duration, _span: &tracing::Span| {
                    let status = response.status();
                    let status_code = status.as_u16();
                    
                    // Log errors
                    if status_code >= 400 {
                        info!(
                            status = status_code,
                            latency_ms = latency.as_millis(),
                            "HTTP request error"
                        );
                    }
                })
        )
}

async fn serve_spa(req: Request) -> impl IntoResponse {
    http::serve_static(req).await
}

pub async fn start_server() {
    let state = AppState {
        room_manager: Arc::new(RoomManager::new()),
    };
    
    let app = create_app(state);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080")
        .await
        .expect("Failed to bind to address");
    
    info!("═══════════════════════════════════════════════════════════");
    info!("🚀 Pointing Poker Backend Server");
    info!("📡 Server is listening on http://0.0.0.0:8080");
    info!("═══════════════════════════════════════════════════════════");
    
    axum::serve(listener, app)
        .await
        .expect("Server failed to start");
}

