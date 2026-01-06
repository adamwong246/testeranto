package golingvu

import "fmt"

// BaseGiven represents a base Given condition
type BaseGiven struct {
	Features          []string
	Whens             []*BaseWhen
	Thens             []*BaseThen
	Error             error
	Fail              interface{}
	Store             interface{}
	RecommendedFsPath string
	GivenCB           interface{}
	InitialValues     interface{}
	Key               string
	Failed            bool
	Artifacts         []string
	GivenThatFunc     func(subject, testResource, artifactory, initializer, initialValues, pm interface{}) (interface{}, error)
	AfterEachFunc     func(store interface{}, key string, artifactory, pm interface{}) (interface{}, error)
	UberCatcherFunc   func(func())
}

// AddArtifact adds an artifact path
func (bg *BaseGiven) AddArtifact(path string) {
	// Normalize path separators
	// For simplicity, we'll assume paths are already normalized
	bg.Artifacts = append(bg.Artifacts, path)
}

// NewBaseGiven creates a new BaseGiven instance
func NewBaseGiven(key string, features []string, whens []*BaseWhen, thens []*BaseThen, givenCB, initialValues interface{}) *BaseGiven {
	return &BaseGiven{
		Key:           key,
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
	whenObjs := make([]map[string]interface{}, len(bg.Whens))
	for i, w := range bg.Whens {
		whenObjs[i] = w.ToObj()
	}

	thenObjs := make([]map[string]interface{}, len(bg.Thens))
	for i, t := range bg.Thens {
		thenObjs[i] = t.ToObj()
	}

	return map[string]interface{}{
		"key": bg.Key,

		"whens":     whenObjs,
		"thens":     thenObjs,
		"error":     bg.Error,
		"failed":    bg.Failed,
		"features":  bg.Features,
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

// Give executes the given condition
func (bg *BaseGiven) Give(
	subject interface{},
	key string,
	testResourceConfiguration ITTestResourceConfiguration,
	tester func(interface{}) bool,
	artifactory func(string, interface{}),
	tLog func(...string),
	pm interface{},
	suiteNdx int,
) (interface{}, error) {
	bg.Key = key
	// tLog("\n " + bg.Key)
	tLog("\n Given: " + bg.Key)

	// Setup
	store, err := bg.GivenThat(
		subject,
		testResourceConfiguration,
		artifactory,
		bg.GivenCB,
		bg.InitialValues,
		pm,
	)
	if err != nil {
		bg.Failed = true
		bg.Error = err
		return nil, err
	}
	bg.Store = store

	// Process Whens
	for whenNdx, when := range bg.Whens {
		_, err := when.Test(
			bg.Store,
			testResourceConfiguration,
			tLog,
			pm,
			fmt.Sprintf("suite-%d/given-%s/when/%d", suiteNdx, key, whenNdx),
		)
		if err != nil {
			bg.Failed = true
			bg.Error = err
			return nil, err
		}
	}

	// Process Thens
	for thenNdx, then := range bg.Thens {
		result, err := then.Test(
			bg.Store,
			testResourceConfiguration,
			tLog,
			pm,
			fmt.Sprintf("suite-%d/given-%s/then-%d", suiteNdx, key, thenNdx),
		)
		if err != nil {
			bg.Failed = true
			bg.Error = err
			return nil, err
		}
		tester(result)
	}

	// Cleanup
	_, err = bg.AfterEach(bg.Store, bg.Key, artifactory, pm)
	if err != nil {
		bg.Failed = true
		bg.Error = err
		return nil, err
	}

	return bg.Store, nil
}
