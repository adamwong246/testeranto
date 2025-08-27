package golingvu

import (
	"testing"
)

// Test types to match the TypeScript implementation
type TestStore struct {
	Name          string
	Index         int
	TestStore     bool
	TestSelection bool
	Error         error
}

type TestSelection struct {
	TestSelection bool
	Error         bool
}

// TestBaseSuiteInitialization tests that BaseSuite initializes correctly
func TestBaseSuiteInitialization(t *testing.T) {
	suite := &BaseSuite{
		Name: "testSuite",
		Givens: map[string]*BaseGiven{
			"testGiven": {
				Name:     "testGiven",
				Features: []string{"testFeature"},
				Whens:    []*BaseWhen{},
				Thens:    []*BaseThen{},
			},
		},
	}

	if suite.Name != "testSuite" {
		t.Errorf("Expected suite name 'testSuite', got '%s'", suite.Name)
	}

	if len(suite.Givens) != 1 {
		t.Errorf("Expected 1 given, got %d", len(suite.Givens))
	}

	given := suite.Givens["testGiven"]
	if given.Name != "testGiven" {
		t.Errorf("Expected given name 'testGiven', got '%s'", given.Name)
	}

	if len(given.Features) != 1 || given.Features[0] != "testFeature" {
		t.Errorf("Expected feature 'testFeature', got %v", given.Features)
	}
}

// TestBaseSuiteToObj tests the ToObj method
func TestBaseSuiteToObj(t *testing.T) {
	suite := &BaseSuite{
		Name: "testSuite",
		Givens: map[string]*BaseGiven{
			"testGiven": {
				Name:     "testGiven",
				Features: []string{"testFeature"},
				Whens:    []*BaseWhen{},
				Thens:    []*BaseThen{},
			},
		},
	}

	obj := suite.ToObj()
	if obj["name"] != "testSuite" {
		t.Errorf("Expected obj name 'testSuite', got '%v'", obj["name"])
	}
}

// TestBaseSuiteFeatures tests the Features method
func TestBaseSuiteFeatures(t *testing.T) {
	suite := &BaseSuite{
		Name: "testSuite",
		Givens: map[string]*BaseGiven{
			"testGiven": {
				Name:     "testGiven",
				Features: []string{"testFeature"},
				Whens:    []*BaseWhen{},
				Thens:    []*BaseThen{},
			},
		},
	}

	features := suite.Features()
	if len(features) != 1 || features[0] != "testFeature" {
		t.Errorf("Expected ['testFeature'], got %v", features)
	}
}

// TestBaseSuiteRun tests the Run method
func TestBaseSuiteRun(t *testing.T) {
	suite := &BaseSuite{
		Name: "testSuite",
		Givens: map[string]*BaseGiven{
			"testGiven": {
				Name:     "testGiven",
				Features: []string{"testFeature"},
				Whens:    []*BaseWhen{},
				Thens:    []*BaseThen{},
			},
		},
	}

	// Mock test resource configuration
	testConfig := ITTestResourceConfiguration{
		Name:        "test",
		Fs:          "/tmp",
		Ports:       []int{3000},
		Environment: map[string]string{},
		Timeout:     5000,
		Retries:     3,
	}

	// Mock artifactory function
	artifactory := func(path string, value interface{}) {}

	// Mock tLog function
	tLog := func(args ...string) {}

	// Mock PM
	pm := struct{}{}

	result, err := suite.Run(nil, testConfig, artifactory, tLog, pm)
	if err != nil {
		t.Errorf("Run failed: %v", err)
	}

	if result == nil {
		t.Error("Expected non-nil result from Run")
	}
}

// TestBaseGivenAddArtifact tests adding artifacts
func TestBaseGivenAddArtifact(t *testing.T) {
	given := &BaseGiven{
		Name:     "testGiven",
		Artifacts: []string{},
	}

	given.AddArtifact("test/path")
	given.AddArtifact("another/path")

	if len(given.Artifacts) != 2 {
		t.Errorf("Expected 2 artifacts, got %d", len(given.Artifacts))
	}

	if given.Artifacts[0] != "test/path" || given.Artifacts[1] != "another/path" {
		t.Errorf("Unexpected artifacts: %v", given.Artifacts)
	}
}

// TestBaseGivenToObj tests the ToObj method
func TestBaseGivenToObj(t *testing.T) {
	given := &BaseGiven{
		Name:     "testGiven",
		Features: []string{"testFeature"},
		Whens:    []*BaseWhen{},
		Thens:    []*BaseThen{},
		Key:      "testKey",
		Artifacts: []string{"test/artifact"},
	}

	obj := given.ToObj()
	if obj["name"] != "testGiven" {
		t.Errorf("Expected name 'testGiven', got '%v'", obj["name"])
	}
	if obj["key"] != "testKey" {
		t.Errorf("Expected key 'testKey', got '%v'", obj["key"])
	}
}

// TestBaseWhenToObj tests the ToObj method for BaseWhen
func TestBaseWhenToObj(t *testing.T) {
	when := &BaseWhen{
		Name: "testWhen",
	}

	obj := when.ToObj()
	if obj["name"] != "testWhen" {
		t.Errorf("Expected name 'testWhen', got '%v'", obj["name"])
	}
}

// TestBaseThenToObj tests the ToObj method for BaseThen
func TestBaseThenToObj(t *testing.T) {
	then := &BaseThen{
		Name: "testThen",
	}

	obj := then.ToObj()
	if obj["name"] != "testThen" {
		t.Errorf("Expected name 'testThen', got '%v'", obj["name"])
	}
}
