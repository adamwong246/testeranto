// 1. Exporting a constant
// pub const MAX_USERS: u32 = 100;

// 2. Exporting a data structure (Struct)
#[derive(Debug)]
pub struct RustBuildConfig {
    pub id: u32,
    pub name: String,
}
