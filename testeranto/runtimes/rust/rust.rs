// 1. Exporting a constant
pub const MAX_USERS: u32 = 100;

// 2. Exporting a data structure (Struct)
#[derive(Debug)]
pub struct User {
    pub id: u32,
    pub name: String,
}

// 3. Exporting a function
pub fn create_user(id: u32, name: &str) -> User {
    User {
        id,
        name: name.to_string(),
    }
}

// Private function (not exported)
fn generate_id() -> u32 {
    1
}