package main

import (
	"fmt"
	"log"

	"testeranto/src/golingvu"
)

func main() {
	fmt.Println("Starting Golingvu test runner...")
	
	// Create a simple test implementation
	testImplementation := golingvu.ITestImplementation{
		Suites: make(map[string]interface{}),
		Givens: make(map[string]interface{}),
		Whens:  make(map[string]interface{}),
		Thens:  make(map[string]interface{}),
	}
	
	// Create a test specification
	testSpecification := func(suites, givens, whens, thens interface{}) interface{} {
		fmt.Println("Test specification called")
		return nil
	}
	
	// Create a test adapter
	testAdapter := &golingvu.SimpleTestAdapter{}
	
	// Create a test resource requirement
	testResourceRequirement := golingvu.ITTestResourceRequest{
		Ports: 0,
	}
	
	// Create uberCatcher
	uberCatcher := func(f func()) {
		// Handle panics
		defer func() {
			if r := recover(); r != nil {
				log.Printf("Recovered from panic: %v", r)
			}
		}()
		f()
	}
	
	// Create Golingvu instance
	gv := golingvu.NewGolingvu(
		nil,
		testSpecification,
		testImplementation,
		testResourceRequirement,
		testAdapter,
		uberCatcher,
	)
	
	fmt.Printf("Golingvu instance created successfully: %v\n", gv != nil)
	
	// Try to get specs
	specs := gv.GetSpecs()
	fmt.Printf("Specs: %v\n", specs)
	
	// Try to get test jobs
	testJobs := gv.GetTestJobs()
	fmt.Printf("Number of test jobs: %d\n", len(testJobs))
}
