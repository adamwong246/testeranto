#!/bin/bash

echo "Building and running Rust Calculator..."
cd "$(dirname "$0")"

# Build the calculator
cargo build --bin calculator

# Run the calculator
echo ""
echo "Running Calculator program:"
cargo run --bin calculator

# Build and run the test
echo ""
echo "Building and running Calculator tests..."
cargo build --bin calculator-test
echo ""
echo "Running Calculator tests:"
cargo run --bin calculator-test
#!/bin/bash

echo "Building and running Rust Calculator..."
cd "$(dirname "$0")"

# Build the calculator
cargo build --bin calculator

# Run the calculator
echo ""
echo "Running Calculator program:"
cargo run --bin calculator

# Build and run the test
echo ""
echo "Building and running Calculator tests..."
cargo build --bin calculator-test
echo ""
echo "Running Calculator tests:"
cargo run --bin calculator-test
