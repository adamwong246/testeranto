package main

import "github.com/adamwong246/testeranto/src/golingvu"

// Specification for Calculator tests
var CalculatorSpecification golingvu.ITestSpecification = func(
	suites interface{},
	givens interface{},
	whens interface{},
	thens interface{},
) interface{} {
	// The parameters are maps containing the functions
	suitesMap := suites.(map[string]interface{})
	givensMap := givens.(map[string]interface{})
	whensMap := whens.(map[string]interface{})
	thensMap := thens.(map[string]interface{})

	// Get the functions from the maps with the correct type assertions
	suiteFunc := suitesMap["Default"].(func(string, map[string]*golingvu.BaseGiven) *golingvu.BaseSuite)
	givenFunc := givensMap["Default"].(func(string, []string, []*golingvu.BaseWhen, []*golingvu.BaseThen, interface{}, interface{}) *golingvu.BaseGiven)
	whenFunc := whensMap["press"].(func(interface{}) *golingvu.BaseWhen)
	thenFunc := thensMap["result"].(func(interface{}) *golingvu.BaseThen)

	// Create the givens map with the correct type
	givensForSuite := make(map[string]*golingvu.BaseGiven)

	// Create and add the testEmptyDisplay given
	emptyWhens := make([]*golingvu.BaseWhen, 0)
	emptyThens := make([]*golingvu.BaseThen, 0)
	
	// Add the then result
	thenResult := thenFunc("")
	emptyThens = append(emptyThens, thenResult)
	
	givensForSuite["testEmptyDisplay"] = givenFunc(
		"Default",
		[]string{"pressing nothing, the display is empty"},
		emptyWhens, // whens
		emptyThens, // thens
		nil,        // givenCB
		nil,        // initialValues
	)

	// Create and add the testSingleDigit given
	singleWhens := make([]*golingvu.BaseWhen, 0)
	singleThens := make([]*golingvu.BaseThen, 0)
	
	// Add the when action
	whenResult := whenFunc("2")
	singleWhens = append(singleWhens, whenResult)
	
	// Add the then result
	thenResult2 := thenFunc("2")
	singleThens = append(singleThens, thenResult2)
	
	givensForSuite["testSingleDigit"] = givenFunc(
		"Default",
		[]string{"entering a number puts it on the display"},
		singleWhens, // whens
		singleThens, // thens
		nil,
		nil,
	)

	return []interface{}{
		suiteFunc("Testing Calculator operations", givensForSuite),
	}
}
