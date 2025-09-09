package golingvu

import (
	"encoding/json"
	"fmt"
	"os"
)

type IFinalResults struct {
	Failed       bool
	Fails        int
	Artifacts    []interface{}
	Features     []string
	Tests        int
	RunTimeTests int
}

// ITestJob represents a test job
type ITestJob interface {
	ToObj() map[string]interface{}
	Runner(pm interface{}, tLog func(...string)) (interface{}, error)
	ReceiveTestResourceConfig(pm interface{}) (IFinalResults, error)
}



// Golingvu is the main test runner class (Go implementation of Tiposkripto)
type Golingvu struct {
	TestResourceRequirement ITTestResourceRequest
	Artifacts               []interface{}
	TestJobs                []ITestJob
	TestSpecification       ITestSpecification
	SuitesOverrides         map[string]interface{}
	GivenOverrides          map[string]interface{}
	WhenOverrides           map[string]interface{}
	ThenOverrides           map[string]interface{}
	PuppetMaster            interface{}
	Specs                   interface{}
	totalTests              int
	assertThis              func(t interface{}) interface{}
}

// NewGolingvu creates a new Golingvu instance
func NewGolingvu(
	input interface{},
	testSpecification ITestSpecification,
	testImplementation ITestImplementation,
	testResourceRequirement ITTestResourceRequest,
	testAdapter ITestAdapter,
	uberCatcher func(func()),
) *Golingvu {
	gv := &Golingvu{
		TestResourceRequirement: testResourceRequirement,
		Artifacts:               make([]interface{}, 0),
		SuitesOverrides:         make(map[string]interface{}),
		GivenOverrides:          make(map[string]interface{}),
		WhenOverrides:           make(map[string]interface{}),
		ThenOverrides:           make(map[string]interface{}),
		assertThis: func(t interface{}) interface{} {
			return testAdapter.AssertThis(t)
		},
	}

	// Create classy implementations as functions that return instances
	classySuites := make(map[string]interface{})
	for key := range testImplementation.Suites {
		classySuites[key] = func(somestring string, givens map[string]*BaseGiven) *BaseSuite {
			return &BaseSuite{
				Name:   somestring,
				Givens: givens,
				AfterAllFunc: func(store interface{}, artifactory func(string, interface{}), pm interface{}) interface{} {
					return testAdapter.AfterAll(store, pm)
				},
				AssertThatFunc: func(t interface{}) bool {
					return testAdapter.AssertThis(t)
				},
				SetupFunc: func(s interface{}, artifactory func(string, interface{}), tr ITTestResourceConfiguration, pm interface{}) interface{} {
					result := testAdapter.BeforeAll(s, tr, pm)
					if result == nil {
						return s
					}
					return result
				},
			}
		}
	}

	classyGivens := make(map[string]interface{})
	for key, g := range testImplementation.Givens {
		// Capture the current values
		givenCB := g
		classyGivens[key] = func(name string, features []string, whens []*BaseWhen, thens []*BaseThen, gcb interface{}, initialValues interface{}) *BaseGiven {
			return &BaseGiven{
				Name:          name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
				Artifacts:     make([]string, 0),
				GivenThatFunc: func(subject, testResource, artifactory, initializer, initialValues, pm interface{}) (interface{}, error) {
					// Type assertion for testResource
					tr, ok := testResource.(ITTestResourceConfiguration)
					if !ok {
						return nil, nil
					}
					return testAdapter.BeforeEach(subject, initializer, tr, initialValues, pm), nil
				},
				AfterEachFunc: func(store interface{}, key string, artifactory, pm interface{}) (interface{}, error) {
					return testAdapter.AfterEach(store, key, pm), nil
				},
				UberCatcherFunc: uberCatcher,
			}
		}
	}

	classyWhens := make(map[string]interface{})
	for key, whEn := range testImplementation.Whens {
		// Capture the current values
		whenKey := key
		whenCB := whEn
		classyWhens[key] = func(payload ...interface{}) *BaseWhen {
			return &BaseWhen{
				Name:   whenKey,
				WhenCB: whenCB,
				AndWhenFunc: func(store, whenCB, testResource, pm interface{}) (interface{}, error) {
					return testAdapter.AndWhen(store, whenCB, testResource, pm), nil
				},
			}
		}
	}

	classyThens := make(map[string]interface{})
	for key, thEn := range testImplementation.Thens {
		// Capture the current values
		thenKey := key
		thenCB := thEn
		classyThens[key] = func(args ...interface{}) *BaseThen {
			return &BaseThen{
				Name:   thenKey,
				ThenCB: thenCB,
				ButThenFunc: func(store, thenCB, testResource, pm interface{}) (interface{}, error) {
					return testAdapter.ButThen(store, thenCB, testResource, pm), nil
				},
			}
		}
	}

	// Set up the overrides
	gv.SuitesOverrides = classySuites
	gv.GivenOverrides = classyGivens
	gv.WhenOverrides = classyWhens
	gv.ThenOverrides = classyThens
	gv.TestResourceRequirement = testResourceRequirement
	gv.TestSpecification = testSpecification

	// Generate specs
	gv.Specs = testSpecification(
		gv.Suites(),
		gv.Given(),
		gv.When(),
		gv.Then(),
	)
	
	// Calculate total number of tests (sum of all Givens across all Suites)
	// This needs to be implemented based on the actual structure
	// For now, we'll set a placeholder
	gv.totalTests = 0
	// Implementation to count Givens would go here

	// Create test jobs (simplified)
	// Note: This part needs to be adapted from TypeScript more carefully
	gv.TestJobs = []ITestJob{}

	return gv
}

// ReceiveTestResourceConfig receives test resource configuration
func (gv *Golingvu) ReceiveTestResourceConfig(partialTestResource string) (IFinalResults, error) {
    // Parse the test resource configuration
    var testResourceConfig ITTestResourceConfiguration
    err := json.Unmarshal([]byte(partialTestResource), &testResourceConfig)
    if err != nil {
        return IFinalResults{
            Failed:       true,
            Fails:        -1,
            Artifacts:    []interface{}{},
            Features:     []string{},
            Tests:        0,
            RunTimeTests: -1,
        }, err
    }

    // Ensure tests.json exists
    err = gv.ensureTestsJsonExists(testResourceConfig.Fs)
    if err != nil {
        return IFinalResults{
            Failed:       true,
            Fails:        -1,
            Artifacts:    []interface{}{},
            Features:     []string{},
            Tests:        0,
            RunTimeTests: -1,
        }, err
    }

    // Run the actual tests
    // For Go, we'll need to execute the tests using the Go testing framework
    // This is a simplified implementation
    result := IFinalResults{
        Failed:       false,
        Fails:        0,
        Artifacts:    []interface{}{},
        Features:     []string{},
        Tests:        gv.totalTests,
        RunTimeTests: gv.totalTests,
    }
    
    // TODO: Implement actual test running logic using os/exec to run 'go test'
    
    return result, nil
}

// ensureTestsJsonExists creates a basic tests.json file if it doesn't exist
func (gv *Golingvu) ensureTestsJsonExists(reportDir string) error {
    testsJsonPath := reportDir + "/tests.json"
    if _, err := os.Stat(testsJsonPath); os.IsNotExist(err) {
        // Create a basic tests.json structure
        basicTestResult := map[string]interface{}{
            "tests":    []interface{}{},
            "features": []interface{}{},
            "givens":   []interface{}{},
        }
        
        data, err := json.MarshalIndent(basicTestResult, "", "  ")
        if err != nil {
            return fmt.Errorf("failed to marshal tests.json: %v", err)
        }
        
        err = os.WriteFile(testsJsonPath, data, 0644)
        if err != nil {
            return fmt.Errorf("failed to write tests.json: %v", err)
        }
    }
    return nil
}


// Suites returns the suites overrides
func (gv *Golingvu) Suites() map[string]interface{} {
	return gv.SuitesOverrides
}

// Given returns the given overrides
func (gv *Golingvu) Given() map[string]interface{} {
	return gv.GivenOverrides
}

// When returns the when overrides
func (gv *Golingvu) When() map[string]interface{} {
	return gv.WhenOverrides
}

// Then returns the then overrides
func (gv *Golingvu) Then() map[string]interface{} {
	return gv.ThenOverrides
}

// GetTestJobs returns the test jobs
func (gv *Golingvu) GetTestJobs() []ITestJob {
	return gv.TestJobs
}

// GetSpecs returns the generated specs
func (gv *Golingvu) GetSpecs() interface{} {
	return gv.Specs
}

// AssertThis is a helper function for assertions
func (gv *Golingvu) AssertThis(t interface{}) interface{} {
	return gv.assertThis(t)
}
