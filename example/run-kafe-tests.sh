#!/bin/bash

echo "Running Java Kafe tests for Calculator..."
echo "=========================================="

# Compile the Calculator class
echo "1. Compiling Calculator..."
javac Calculator.java

# Compile the Kafe test files
echo "2. Compiling Kafe test files..."
javac -cp . Calculator.kafe.test.java Calculator.kafe.specification.java Calculator.kafe.implementation.java Calculator.kafe.adapter.java

# Run the test
echo "3. Running tests..."
echo ""
java -cp . CalculatorKafeTest

echo ""
echo "Java Kafe tests completed!"
