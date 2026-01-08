use axum::{
    extract::Request,
    http::StatusCode,
    response::IntoResponse,
};
use std::path::PathBuf;
use tower::util::ServiceExt;
use tower_http::services::ServeDir;
use tracing::info;
use crate::room::room_manager::MANAGER;
use crate::utils::room_id::generate_room_id;

pub async fn create_room() -> impl IntoResponse {
    let mut room_id = generate_room_id();
    
    // Ensure room doesn't exist
    while MANAGER.has_room(&room_id).await {
        room_id = generate_room_id();
    }

    info!("PUT /api/room -> Created new room: {}", room_id);
    axum::Json(serde_json::json!({ "id": room_id }))
}

pub async fn serve_static(req: Request) -> impl IntoResponse {
    let path = req.uri().path();
    let file_path = PathBuf::from("dist").join(path.trim_start_matches('/'));
    
    // If file doesn't exist or is a directory, serve index.html for SPA routing
    if !file_path.exists() || file_path.is_dir() || path == "/" {
        let index_req = Request::builder()
            .uri("/index.html")
            .body(axum::body::Body::empty())
            .unwrap();
        
        let service = ServeDir::new("dist");
        match service.oneshot(index_req).await {
            Ok(res) => res.map(axum::body::Body::new).into_response(),
            Err(_) => (StatusCode::NOT_FOUND, "Not found").into_response(),
        }
    } else {
        let service = ServeDir::new("dist");
        match service.oneshot(req).await {
            Ok(res) => res.map(axum::body::Body::new).into_response(),
            Err(_) => (StatusCode::NOT_FOUND, "Not found").into_response(),
        }
    }
}

