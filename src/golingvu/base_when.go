package golingvu

// BaseWhen represents a When condition
type BaseWhen struct {
	Name        string
	WhenCB      interface{}
	AndWhenFunc func(store, whenCB, testResource, pm interface{}) (interface{}, error)
}

// Test executes the When condition
func (bw *BaseWhen) Test(store interface{}, testResourceConfiguration ITTestResourceConfiguration, tLog func(...string), pm interface{}, path string) (interface{}, error) {
	// Implementation would go here
	return nil, nil
}

// ToObj converts the When condition to a serializable object
func (bw *BaseWhen) ToObj() map[string]interface{} {
	return map[string]interface{}{
		"name": bw.Name,
	}
}
