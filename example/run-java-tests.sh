#!/bin/bash

echo "Building and running Java Calculator Kafe tests..."
cd "$(dirname "$0")"

# Compile all Java files
echo "Compiling Java files..."
javac -cp ".:src/lib/kafe/Kafe.java" \
    example/Calculator.java \
    example/Calculator.kafe.test.java \
    example/Calculator.kafe.specification.java \
    example/Calculator.kafe.implementation.java \
    example/Calculator.kafe.adapter.java \
    example/src/main/java/com/example/calculator/Calculator.java \
    example/src/main/java/com/example/calculator/KafeCalculatorTest.java

if [ $? -ne 0 ]; then
    echo "Compilation failed"
    exit 1
fi

# Run the Kafe test
echo ""
echo "Running Calculator Kafe tests..."
java -cp ".:example:src/lib/kafe" CalculatorKafeTest

# Also run the regular Java example
echo ""
echo "Running regular Java Calculator example..."
java -cp "example/src/main/java" com.example.Main
