package golingvu

// SimpleTestAdapter is a basic implementation of ITestAdapter
type SimpleTestAdapter struct{}

func (a *SimpleTestAdapter) BeforeAll(input interface{}, tr ITTestResourceConfiguration, pm interface{}) interface{} {
	return input
}

func (a *SimpleTestAdapter) AfterAll(store interface{}, pm interface{}) interface{} {
	return store
}

func (a *SimpleTestAdapter) BeforeEach(subject, initializer interface{}, testResource ITTestResourceConfiguration, initialValues interface{}, pm interface{}) interface{} {
	return subject
}

func (a *SimpleTestAdapter) AfterEach(store interface{}, key string, pm interface{}) interface{} {
	return store
}

func (a *SimpleTestAdapter) AndWhen(store, whenCB interface{}, testResource interface{}, pm interface{}) interface{} {
	return store
}

func (a *SimpleTestAdapter) ButThen(store, thenCB interface{}, testResource interface{}, pm interface{}) interface{} {
	return store
}

func (a *SimpleTestAdapter) AssertThis(t interface{}) bool {
	// Simple implementation - always return true for now
	return true
}
