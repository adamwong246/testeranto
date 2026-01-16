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
		fmt.Println("Error: Test resource configuration not provided")
		os.Exit(1)
	}

	// Parse the test resource configuration
	var testResource golingvu.ITTestResourceConfiguration
	err := json.Unmarshal([]byte(os.Args[1]), &testResource)
	if err != nil {
		fmt.Printf("Error parsing test resource: %v\n", err)
		os.Exit(1)
	}

	// Create PM instance
	pm, err := golingvu.NewPM_Golang(testResource, "/tmp/testeranto_ipc.sock")
	if err != nil {
		fmt.Printf("Error creating PM: %v\n", err)
		// Continue without PM for now
		pm = nil
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

// NewCalculatorTestImplementation creates the test implementation with proper callbacks
func NewCalculatorTestImplementation() golingvu.ITestImplementation {
	return golingvu.ITestImplementation{
		Suites: map[string]interface{}{
			"CalculatorSuite": func(name string, givens map[string]*golingvu.BaseGiven) *golingvu.BaseSuite {
				return &golingvu.BaseSuite{
					Key:    name,
					Givens: givens,
					AfterAllFunc: func(store interface{}, artifactory func(string, interface{}), pm interface{}) interface{} {
						return store
					},
					AssertThatFunc: func(t interface{}) bool {
						// Simple assertion - always return true for now
						return true
					},
					SetupFunc: func(s interface{}, artifactory func(string, interface{}), tr golingvu.ITTestResourceConfiguration, pm interface{}) interface{} {
						return s
					},
				}
			},
		},
		Givens: map[string]interface{}{
			"testEmptyDisplay": func(key string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, gcb interface{}, initialValues interface{}) *golingvu.BaseGiven {
				return &golingvu.BaseGiven{
					Key:           key,
					Features:      features,
					Whens:         whens,
					Thens:         thens,
					GivenCB:       gcb,
					InitialValues: initialValues,
					Artifacts:     []string{},
					GivenThatFunc: func(subject, testResource, artifactory, initializer, initialValues, pm interface{}) (interface{}, error) {
						// Create a new Calculator instance
						calc := &Calculator{
							display: "",
							values:  make(map[string]interface{}),
						}
						return calc, nil
					},
					AfterEachFunc: func(store interface{}, key string, artifactory, pm interface{}) (interface{}, error) {
						return store, nil
					},
				}
			},
			"testSingleDigit": func(key string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, gcb interface{}, initialValues interface{}) *golingvu.BaseGiven {
				return &golingvu.BaseGiven{
					Key:           key,
					Features:      features,
					Whens:         whens,
					Thens:         thens,
					GivenCB:       gcb,
					InitialValues: initialValues,
					Artifacts:     []string{},
					GivenThatFunc: func(subject, testResource, artifactory, initializer, initialValues, pm interface{}) (interface{}, error) {
						calc := &Calculator{
							display: "",
							values:  make(map[string]interface{}),
						}
						return calc, nil
					},
					AfterEachFunc: func(store interface{}, key string, artifactory, pm interface{}) (interface{}, error) {
						return store, nil
					},
				}
			},
			// Add more test cases here following the same pattern
		},
		Whens: map[string]interface{}{
			"press": func(button string) func(interface{}) error {
				return func(calc interface{}) error {
					if c, ok := calc.(*Calculator); ok {
						c.press(button)
						return nil
					}
					return fmt.Errorf("not a Calculator")
				}
			},
			"enter": func() func(interface{}) error {
				return func(calc interface{}) error {
					// Handle enter press if needed
					if c, ok := calc.(*Calculator); ok {
						c.Enter()
						return nil
					}
					return fmt.Errorf("not a Calculator")
				}
			},
		},
		Thens: map[string]interface{}{
			"result": func(expected string) func(interface{}) error {
				return func(calc interface{}) error {
					if c, ok := calc.(*Calculator); ok {
						if c.display != expected {
							return fmt.Errorf("expected %s, got %s", expected, c.display)
						}
						return nil
					}
					return fmt.Errorf("not a Calculator")
				}
			},
		},
	}
}

