mod handlers;
mod logger;
mod room;
mod server;
mod types;
mod user;
mod utils;

use logger::init_logger;

#[tokio::main]
async fn main() {
    init_logger();
    server::start_server().await;
}

