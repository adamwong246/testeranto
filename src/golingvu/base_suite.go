package golingvu

// BaseSuite represents a test suite
type BaseSuite struct {
	Name           string
	Givens         map[string]*BaseGiven
	AfterAllFunc   func(store interface{}, artifactory func(string, interface{}), pm interface{}) interface{}
	AssertThatFunc func(t interface{}) bool
	SetupFunc      func(s interface{}, artifactory func(string, interface{}), tr ITTestResourceConfiguration, pm interface{}) interface{}
}

// Run executes the test suite
func (bs *BaseSuite) Run(input interface{}, testResourceConfiguration ITTestResourceConfiguration, artifactory func(string, interface{}), tLog func(...string), pm interface{}) (*BaseSuite, error) {
	// Implementation would go here
	return bs, nil
}

// ToObj converts the suite to a serializable object
func (bs *BaseSuite) ToObj() map[string]interface{} {
	return map[string]interface{}{
		"name": bs.Name,
	}
}

// Features returns the features covered by this suite
func (bs *BaseSuite) Features() []string {
	features := make([]string, 0)
	seen := make(map[string]bool)
	
	for _, given := range bs.Givens {
		for _, feature := range given.Features {
			if !seen[feature] {
				features = append(features, feature)
				seen[feature] = true
			}
		}
	}
	return features
}
