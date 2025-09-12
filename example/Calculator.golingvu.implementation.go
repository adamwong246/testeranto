package main

import (
	"fmt"

	"github.com/adamwong246/testeranto/src/golingvu"
)

// Implementation for Calculator tests
type CalculatorTestImplementation struct {
	SuitesMap map[string]interface{}
	GivensMap map[string]interface{}
	WhensMap  map[string]interface{}
	ThensMap  map[string]interface{}
}

func NewCalculatorTestImplementation() golingvu.ITestImplementation {
	impl := &CalculatorTestImplementation{}

	impl.SuitesMap = map[string]interface{}{
		"Default": func(name string, givens map[string]*golingvu.BaseGiven) *golingvu.BaseSuite {
			return &golingvu.BaseSuite{
				Name:   name,
				Givens: givens,
			}
		},
	}

	impl.GivensMap = map[string]interface{}{
		"Default": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Name:          name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
	}

	impl.WhensMap = map[string]interface{}{
		"press": func(payload interface{}) *golingvu.BaseWhen {
			button := payload.(string)
			return &golingvu.BaseWhen{
				Name: "press",
				WhenCB: func(store, testResource, pm interface{}) (interface{}, error) {
					if calc, ok := store.(*Calculator); ok {
						calc.Press(button)
						return calc, nil
					}
					return store, nil
				},
			}
		},
		"enter": func(payload interface{}) *golingvu.BaseWhen {
			return &golingvu.BaseWhen{
				Name: "enter",
				WhenCB: func(store, testResource, pm interface{}) (interface{}, error) {
					if calc, ok := store.(*Calculator); ok {
						// For now, we'll just return the calculator
						return calc, nil
					}
					return store, nil
				},
			}
		},
	}

	impl.ThensMap = map[string]interface{}{
		"result": func(payload interface{}) *golingvu.BaseThen {
			expected := payload.(string)
			return &golingvu.BaseThen{
				Name: "result",
				ThenCB: func(store, testResource, pm interface{}) (interface{}, error) {
					if calc, ok := store.(*Calculator); ok {
						actual := calc.GetDisplay()
						if actual != expected {
							return nil, fmt.Errorf("expected %s, got %s", expected, actual)
						}
						return true, nil
					}
					return nil, fmt.Errorf("store is not a Calculator")
				},
			}
		},
	}

	return golingvu.ITestImplementation{
		Suites: impl.SuitesMap,
		Givens: impl.GivensMap,
		Whens:  impl.WhensMap,
		Thens:  impl.ThensMap,
	}
}
