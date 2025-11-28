//go:build testeranto
// +build testeranto

package testeranto_test

import (
	"github.com/adamwong246/testeranto/src/golingvu"
)

// SimpleTestAdapter is a basic implementation of ITestAdapter for Calculator tests
type SimpleTestAdapter struct{}

// AfterAll implements golingvu.ITestAdapter.
func (a SimpleTestAdapter) AfterAll(store interface{}, pm interface{}) interface{} {
	// Clean up after all tests
	return store
}

// AfterEach implements golingvu.ITestAdapter.
func (a SimpleTestAdapter) AfterEach(store interface{}, key string, pm interface{}) interface{} {
	// Clean up after each test
	return store
}

// AndWhen implements golingvu.ITestAdapter.
func (a SimpleTestAdapter) AndWhen(store interface{}, whenCB interface{}, testResource interface{}, pm interface{}) interface{} {
	// Execute the when callback
	if whenFunc, ok := whenCB.(func(interface{}, interface{}, interface{}) (interface{}, error)); ok {
		result, err := whenFunc(store, testResource, pm)
		if err != nil {
			panic(err)
		}
		return result
	}
	return store
}

// AssertThis implements golingvu.ITestAdapter.
func (a SimpleTestAdapter) AssertThis(t interface{}) bool {
	// Simple assertion - check if the result is true or if there's no error
	switch v := t.(type) {
	case bool:
		return v
	case error:
		return v == nil
	case nil:
		return true
	default:
		return true
	}
}

// BeforeAll implements golingvu.ITestAdapter.
func (a SimpleTestAdapter) BeforeAll(input interface{}, tr golingvu.ITTestResourceConfiguration, pm interface{}) interface{} {
	// Initialize before all tests - create a new calculator
	return &Calculator{}
}

// BeforeEach implements golingvu.ITestAdapter.
func (a SimpleTestAdapter) BeforeEach(subject interface{}, initializer interface{}, testResource golingvu.ITTestResourceConfiguration, initialValues interface{}, pm interface{}) interface{} {
	// Initialize before each test - reset the calculator
	if calc, ok := subject.(*Calculator); ok {
		calc.display = ""
		calc.values = make(map[string]interface{})
		return calc
	}
	return subject
}

// ButThen implements golingvu.ITestAdapter.
func (a SimpleTestAdapter) ButThen(store interface{}, thenCB interface{}, testResource interface{}, pm interface{}) interface{} {
	// Execute the then callback
	if thenFunc, ok := thenCB.(func(interface{}, interface{}, interface{}) (interface{}, error)); ok {
		result, err := thenFunc(store, testResource, pm)
		if err != nil {
			panic(err)
		}
		return result
	}
	return store
}
