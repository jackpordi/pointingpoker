use rand::Rng;

pub fn generate_room_id() -> String {
    let mut rng = rand::thread_rng();
    let bytes: [u8; 2] = rng.gen();
    hex::encode(bytes).to_uppercase()
}

