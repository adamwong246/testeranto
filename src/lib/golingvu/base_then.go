package golingvu

// BaseThen represents a Then condition
type BaseThen struct {
	Key         string
	ThenCB      interface{}
	ButThenFunc func(store, thenCB, testResource, pm interface{}) (interface{}, error)
}

// Test executes the Then condition
func (bt *BaseThen) Test(store interface{}, testResourceConfiguration ITTestResourceConfiguration, tLog func(...string), pm interface{}, path string) (interface{}, error) {
	// Implementation would go here
	return nil, nil
}

// ToObj converts the Then condition to a serializable object
func (bt *BaseThen) ToObj() map[string]interface{} {
	return map[string]interface{}{
		"key": bt.Key,
	}
}
