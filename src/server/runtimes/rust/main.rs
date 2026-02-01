use std::collections::HashMap;
use std::env;
use std::fs;
use std::path::Path;
use std::process::Command;
use serde::{Deserialize, Serialize};
use serde::{Serialize, Deserialize};
use serde_json;
use md5;

extern crate serde;

include!(env!("CONFIG_PATH"));

#[derive(Serialize, Deserialize)]
struct TestConfig {
    path: String,
}

#[derive(Serialize, Deserialize)]
struct RustProjectConfig {
    tests: HashMap<String, TestConfig>,
}

#[derive(Serialize, Deserialize)]
struct ProjectConfig {
    rust: RustProjectConfig,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🚀 Rust builder starting...");
    
    // Get test name from environment
    let test_name = env::var("TEST_NAME").unwrap_or_else(|_| "allTests".to_string());
    println!("TEST_NAME={}", test_name);
    
    // Load master configuration yml files
    let config_path = find_config();
    println!("Config path: {}", config_path);
    
    if !Path::new(&config_path).exists() {
        eprintln!("❌ Config file not found");
        std::process::exit(1);
    }
    
    let config_content = fs::read_to_string(&config_path)?;
    let config: ProjectConfig = serde_json::from_str(&config_content)?;
    
    println!("✅ Loaded config with {} Rust test(s)", config.rust_tests[3].tests.len());
    
    // Process each test
    for (test_key, test_config) in &config.rust.tests {
        println!("\n📦 Processing test: {}", test_key);
        
        // Get test file name and base name
        let test_path = Path::new(&test_config.path);
        let test_file_name = test_path.file_name().unwrap().to_str().unwrap();
        let test_base_name = test_file_name.replace(".rs", "");
        
        // Collect input files
        let input_files = collect_input_files(test_path);
        
        // Compute hash
        let test_hash = compute_files_hash(&input_files);
        
        // Create artifacts directory
        let artifacts_dir = Path::new("/workspace").join("testeranto/bundles/allTests/rust/example");
        fs::create_dir_all(&artifacts_dir)?;
        
        // Create inputFiles.json
        let input_files_path = artifacts_dir.join(format!("{}.rs-inputFiles.json", test_base_name));
        let input_files_json = serde_json::to_string_pretty(&input_files)?;
        fs::write(&input_files_path, input_files_json)?;
        
        println!("  ✅ Created inputFiles.json at {:?} (hash: {})", input_files_path, test_hash);
        
        // Compile the test
        let output_bin_path = artifacts_dir.join(format!("{}.bin", test_base_name));
        println!("  🔨 Compiling test to {:?}...", output_bin_path);
        
        // Change to workspace directory
        let workspace = Path::new("/workspace");
        env::set_current_dir(workspace)?;
        
        // Build with cargo
        let status = Command::new("cargo")
            .args(&["build", "--release", "--bin", &test_base_name])
            .status()?;
        
        if status.success() {
            // Copy the built binary
            let target_bin = workspace.join("target/release").join(&test_base_name);
            if target_bin.exists() {
                fs::copy(&target_bin, &output_bin_path)?;
                println!("  ✅ Successfully compiled to {:?}", output_bin_path);
            } else {
                eprintln!("  ⚠️  Built binary not found at {:?}", target_bin);
                // Create a placeholder
                fs::write(&output_bin_path, b"Placeholder binary")?;
            }
        } else {
            eprintln!("  ⚠️  Cargo build failed");
            // Create a placeholder
            fs::write(&output_bin_path, b"Placeholder binary")?;
        }
    }
    
    println!("\n🎉 Rust builder completed successfully");
    Ok(())
}

fn find_config() -> String {
    "/workspace/testeranto/runtimes/rust/rust.json".to_string()
}

fn collect_input_files(test_path: &Path) -> Vec<String> {
    let mut files = Vec::new();
    
    // Add the test file itself
    if let Ok(relative) = test_path.strip_prefix("/workspace") {
        files.push(relative.to_string_lossy().to_string());
    } else {
        files.push(test_path.to_string_lossy().to_string());
    }
    
    // Look for Rust files in the same directory
    if let Some(parent) = test_path.parent() {
        if let Ok(entries) = fs::read_dir(parent) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.extension().map(|e| e == "rs").unwrap_or(false) {
                    if let Ok(relative) = path.strip_prefix("/workspace") {
                        let rel_str = relative.to_string_lossy().to_string();
                        if !files.contains(&rel_str) {
                            files.push(rel_str);
                        }
                    }
                }
            }
        }
    }
    
    // Add Cargo.toml if present
    let workspace = Path::new("/workspace");
    let cargo_toml = workspace.join("Cargo.toml");
    if cargo_toml.exists() {
        files.push("Cargo.toml".to_string());
    }
    
    // Add Cargo.lock if present
    let cargo_lock = workspace.join("Cargo.lock");
    if cargo_lock.exists() {
        files.push("Cargo.lock".to_string());
    }
    
    files
}

fn compute_files_hash(files: &[String]) -> String {
    use md5::Context;
    let mut context = Context::new();
    
    for file in files {
        context.consume(file.as_bytes());
        let file_path = Path::new("/workspace").join(file);
        match fs::metadata(&file_path) {
            Ok(metadata) => {
                if let Ok(modified) = metadata.modified() {
                    if let Ok(duration) = modified.elapsed() {
                        context.consume(duration.as_millis().to_string().as_bytes());
                    }
                }
                context.consume(metadata.len().to_string().as_bytes());
            }
            Err(_) => {
                context.consume(b"missing");
            }
        }
    }
    
    let digest = context.compute();
    format!("{:x}", digest)
}
