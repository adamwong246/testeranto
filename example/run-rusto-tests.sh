#!/bin/bash

echo "Building Rust testeranto tests..."
cd "$(dirname "$0")"

# Create a simple test runner
cat > rust-test-runner.rs << 'EOF'
use std::process::Command;

fn main() {
    println!("Running Rust testeranto tests...");
    
    // Build the test
    let build_status = Command::new("cargo")
        .args(&["build", "--bin", "calculator-rusto-test"])
        .status()
        .expect("Failed to build");
    
    if !build_status.success() {
        eprintln!("Build failed");
        std::process::exit(1);
    }
    
    // Run the test
    let run_status = Command::new("cargo")
        .args(&["run", "--bin", "calculator-rusto-test"])
        .status()
        .expect("Failed to run");
    
    if !run_status.success() {
        eprintln!("Tests failed");
        std::process::exit(1);
    }
    
    println!("All Rust tests passed!");
}
EOF

# Run the test runner
cargo run --bin rust-test-runner

# Clean up
rm -f rust-test-runner.rs
