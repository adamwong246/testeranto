package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/adamwong246/testeranto/src/golingvu"
	calculatorlib "example/goLib"
)

func main() {
	fmt.Println("Running Calculator BDD tests with Golingvu...")

	// Create test adapter
	adapter := &golingvu.SimpleTestAdapter{}

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
			defer func() {
				if r := recover(); r != nil {
					fmt.Printf("Test panic recovered: %v\n", r)
				}
			}()
			f()
		},
	)

	// The test resource configuration should be provided via command line
	if len(os.Args) < 2 {
		// Provide a default configuration without ports
		defaultConfig := `{"Name":"test","Fs":"."}`
		os.Args = append(os.Args, defaultConfig)
	}

	// Parse the test resource configuration
	var testResource golingvu.ITTestResourceConfiguration
	err := json.Unmarshal([]byte(os.Args[1]), &testResource)
	if err != nil {
		fmt.Printf("Error parsing test resource: %v\n", err)
		os.Exit(1)
	}

	// Create PM instance - WebSocket functionality removed
	pm, err := golingvu.NewPM_Golang(testResource)
	if err != nil {
		fmt.Printf("Error creating PM: %v\n", err)
		// Continue with PM anyway
	}

	// Run tests
	results, err := gv.ReceiveTestResourceConfig(os.Args[1], pm)
	if err != nil {
		fmt.Printf("Error running tests: %v\n", err)
		os.Exit(1)
	}

	// Exit with appropriate code
	if results.Failed {
		fmt.Printf("Tests failed: %d out of %d tests failed\n", results.Fails, results.Tests)
		os.Exit(1)
	} else {
		fmt.Printf("All tests passed: %d tests executed successfully\n", results.Tests)
		os.Exit(0)
	}
}
