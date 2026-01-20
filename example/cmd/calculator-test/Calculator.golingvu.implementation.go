package main

import (
	"fmt"

	"github.com/adamwong246/testeranto/src/golingvu"
	calculatorlib "example/goLib"
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
		"CalculatorSuite": func(name string, givens map[string]*golingvu.BaseGiven) *golingvu.BaseSuite {
			return &golingvu.BaseSuite{
				Key:    name,
				Givens: givens,
			}
		},
	}

	impl.GivensMap = map[string]interface{}{
		"testEmptyDisplay": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testSingleDigit": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testMultipleDigits": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testLargeNumber": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testAdditionExpression": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testIncompleteAddition": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testSubtractionExpression": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testMultiplicationExpression": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testDivisionExpression": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testSimpleAddition": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testSimpleSubtraction": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testSimpleMultiplication": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testSimpleDivision": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testClearOperation": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testStartingWithOperator": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testMultipleOperators": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testDivisionByZero": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testInvalidExpression": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testMemoryStoreRecall": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testMemoryClear": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
				Features:      features,
				Whens:         whens,
				Thens:         thens,
				GivenCB:       givenCB,
				InitialValues: initialValues,
			}
		},
		"testMemoryAddition": func(name string, features []string, whens []*golingvu.BaseWhen, thens []*golingvu.BaseThen, givenCB interface{}, initialValues interface{}) *golingvu.BaseGiven {
			return &golingvu.BaseGiven{
				Key:           name,
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
				Key: "press",
				WhenCB: func(store, testResource, pm interface{}) (interface{}, error) {
					if calc, ok := store.(*calculatorlib.Calculator); ok {
						calc.Press(button)
						return calc, nil
					}
					return store, nil
				},
			}
		},
		"enter": func(payload interface{}) *golingvu.BaseWhen {
			return &golingvu.BaseWhen{
				Key: "enter",
				WhenCB: func(store, testResource, pm interface{}) (interface{}, error) {
					if calc, ok := store.(*calculatorlib.Calculator); ok {
						calc.Enter()
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
				Key: "result",
				ThenCB: func(store, testResource, pm interface{}) (interface{}, error) {
					if calc, ok := store.(*calculatorlib.Calculator); ok {
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
