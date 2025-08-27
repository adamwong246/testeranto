package golingvu

// BaseGiven represents a base Given condition
type BaseGiven struct {
	Name           string
	Features       []string
	Whens          []*BaseWhen
	Thens          []*BaseThen
	Error          error
	Fail           interface{}
	Store          interface{}
	RecommendedFsPath string
	GivenCB        interface{}
	InitialValues  interface{}
	Key            string
	Failed         bool
	Artifacts      []string
	GivenThatFunc  func(subject, testResource, artifactory, initializer, initialValues, pm interface{}) (interface{}, error)
	AfterEachFunc  func(store interface{}, key string, artifactory, pm interface{}) (interface{}, error)
	UberCatcherFunc func(func())
}

// AddArtifact adds an artifact path
func (bg *BaseGiven) AddArtifact(path string) {
	// Normalize path separators
	// For simplicity, we'll assume paths are already normalized
	bg.Artifacts = append(bg.Artifacts, path)
}

// NewBaseGiven creates a new BaseGiven instance
func NewBaseGiven(name string, features []string, whens []*BaseWhen, thens []*BaseThen, givenCB, initialValues interface{}) *BaseGiven {
	return &BaseGiven{
		Name:          name,
		Features:      features,
		Whens:         whens,
		Thens:         thens,
		GivenCB:       givenCB,
		InitialValues: initialValues,
		Artifacts:     make([]string, 0),
	}
}

// BeforeAll is called before all tests
func (bg *BaseGiven) BeforeAll(store interface{}) interface{} {
	return store
}

// ToObj converts the instance to a map for serialization
func (bg *BaseGiven) ToObj() map[string]interface{} {
	return map[string]interface{}{
		"key":      bg.Key,
		"name":     bg.Name,
		"whens":    bg.Whens,
		"thens":    bg.Thens,
		"error":    bg.Error,
		"failed":   bg.Failed,
		"features": bg.Features,
		"artifacts": bg.Artifacts,
	}
}

// GivenThat is an abstract method to be implemented
func (bg *BaseGiven) GivenThat(subject, testResourceConfiguration, artifactory, givenCB, initialValues, pm interface{}) (interface{}, error) {
	// To be implemented by concrete types
	return nil, nil
}

// AfterEach is called after each test
func (bg *BaseGiven) AfterEach(store interface{}, key string, artifactory, pm interface{}) (interface{}, error) {
	return store, nil
}

// UberCatcher handles errors
func (bg *BaseGiven) UberCatcher(e error) {
	bg.Error = e
}
