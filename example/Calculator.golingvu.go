package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/adamwong246/testeranto/src/golingvu"
)

func main() {
	fmt.Println("Running Calculator BDD tests with Golingvu...")

	// Create test adapter
	adapter := SimpleTestAdapter{}

	// Create test implementation
	implementation := NewCalculatorTestImplementation()

	// Create Golingvu instance
	gv := golingvu.NewGolingvu(
		nil,
		CalculatorSpecification,
		implementation,
		golingvu.DefaultTestResourceRequest,
		adapter,
		func(f func()) {
			// Simple uber catcher
			defer func() {
				if r := recover(); r != nil {
					fmt.Printf("Test panic recovered: %v\n", r)
				}
			}()
			f()
		},
	)

	// Create a test resource configuration
	testResource := golingvu.ITTestResourceConfiguration{
		Name:  "CalculatorTest",
		Fs:    "./testeranto/reports/core/example/Calculator.golingvu.test/golang",
		Ports: []int{},
	}

	// Convert to JSON string
	testResourceJSON, err := json.Marshal(testResource)
	if err != nil {
		fmt.Printf("Error marshaling test resource: %v\n", err)
		os.Exit(1)
	}

	// Run the tests
	results, err := gv.ReceiveTestResourceConfig(string(testResourceJSON), nil)
	if err != nil {
		fmt.Printf("Error running tests: %v\n", err)
		os.Exit(1)
	}

	// Print results
	if results.Failed {
		fmt.Printf("Tests failed: %d out of %d tests failed\n", results.Fails, results.Tests)
		os.Exit(1)
	} else {
		fmt.Printf("All tests passed: %d tests executed successfully\n", results.Tests)
		os.Exit(0)
	}
}
