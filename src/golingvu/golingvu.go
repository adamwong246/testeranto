package golingvu

type IFinalResults struct {
	Failed       bool
	Fails        int
	Artifacts    []interface{}
	Features     []string
	Tests        int
	RunTimeTests int
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

	// Create classy implementations
	classySuites := make(map[string]interface{})
	for key := range testImplementation.Suites {
		classySuites[key] = func(somestring string, givens map[string]*BaseGiven) *BaseSuite {
			return &BaseSuite{
				Name: somestring,
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
		classyGivens[key] = func(name string, features []string, whens []*BaseWhen, thens []*BaseThen, gcb interface{}, initialValues interface{}) *BaseGiven {
			return &BaseGiven{
				Name:          name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       g,
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
		classyWhens[key] = func(payload ...interface{}) *BaseWhen {
			return &BaseWhen{
				Name:   key,
				WhenCB: whEn,
				AndWhenFunc: func(store, whenCB, testResource, pm interface{}) (interface{}, error) {
					return testAdapter.AndWhen(store, whenCB, testResource, pm), nil
				},
			}
		}
	}

	classyThens := make(map[string]interface{})
	for key, thEn := range testImplementation.Thens {
		classyThens[key] = func(args ...interface{}) *BaseThen {
			return &BaseThen{
				Name:   key,
				ThenCB: thEn,
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
	// Try to run the tests and handle errors
	// If there's a hard error, set runTimeTests to -1
	// Placeholder implementation - in a real implementation, this would run the actual tests
	// For now, we'll always succeed
	result := IFinalResults{
		Failed:       false,
		Fails:        0,
		Artifacts:    []interface{}{},
		Features:     []string{},
		Tests:        0,
		RunTimeTests: gv.totalTests,
	}
	
	// If we encounter a hard error, we can set RunTimeTests to -1
	// For example:
	// if hardError {
	//     result.RunTimeTests = -1
	//     result.Failed = true
	//     result.Fails = -1
	// }
	
	return result, nil
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
