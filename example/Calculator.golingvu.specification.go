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
	suiteFunc := suitesMap["CalculatorSuite"].(func(string, map[string]*golingvu.BaseGiven) *golingvu.BaseSuite)
	
	// Get the specific given functions
	testEmptyDisplayFunc := givensMap["testEmptyDisplay"].(func(string, []string, []*golingvu.BaseWhen, []*golingvu.BaseThen, interface{}, interface{}) *golingvu.BaseGiven)
	testSingleDigitFunc := givensMap["testSingleDigit"].(func(string, []string, []*golingvu.BaseWhen, []*golingvu.BaseThen, interface{}, interface{}) *golingvu.BaseGiven)
	
	pressFunc := whensMap["press"].(func(interface{}) *golingvu.BaseWhen)
	enterFunc := whensMap["enter"].(func(interface{}) *golingvu.BaseWhen)
	resultFunc := thensMap["result"].(func(interface{}) *golingvu.BaseThen)
	_ = enterFunc // Mark as used to avoid compiler error
	_ = enterFunc // Mark as used to avoid compiler error

	// Helper to create a given
	createGiven := func(name string, description string, pressButtons []string, useEnter bool, expected string) *golingvu.BaseGiven {
		whensList := make([]*golingvu.BaseWhen, 0)
		for _, button := range pressButtons {
			whensList = append(whensList, pressFunc(button))
		}
		if useEnter {
			whensList = append(whensList, enterFunc(nil))
		}
		
		thensList := []*golingvu.BaseThen{
			resultFunc(expected),
		}
		
		// Use appropriate given function based on name
		if name == "testEmptyDisplay" {
			return testEmptyDisplayFunc(
				name,
				[]string{description},
				whensList,
				thensList,
				nil,
				nil,
			)
		}
		return testSingleDigitFunc(
			name,
			[]string{description},
			whensList,
			thensList,
			nil,
			nil,
		)
	}

	// Create the givens map with all test cases
	givensForSuite := make(map[string]*golingvu.BaseGiven)
	
	// Basic number input
	givensForSuite["testEmptyDisplay"] = createGiven("testEmptyDisplay", "pressing nothing, the display is empty", []string{}, false, "")
	givensForSuite["testSingleDigit"] = createGiven("testSingleDigit", "entering a number puts it on the display", []string{"2"}, false, "2")
	givensForSuite["testMultipleDigits"] = createGiven("testMultipleDigits", "entering multiple digits concatenates them", []string{"2", "2"}, false, "22")
	givensForSuite["testLargeNumber"] = createGiven("testLargeNumber", "entering a large number works correctly", []string{"1", "2", "3", "4", "5"}, false, "12345")
	
	// Basic operations
	givensForSuite["testAdditionExpression"] = createGiven("testAdditionExpression", "addition expression is displayed correctly", []string{"2", "+", "3"}, false, "2+3")
	givensForSuite["testIncompleteAddition"] = createGiven("testIncompleteAddition", "incomplete addition expression is displayed correctly", []string{"2", "+"}, false, "2+")
	givensForSuite["testSubtractionExpression"] = createGiven("testSubtractionExpression", "subtraction expression is displayed correctly", []string{"7", "-", "3"}, false, "7-3")
	givensForSuite["testMultiplicationExpression"] = createGiven("testMultiplicationExpression", "multiplication expression is displayed correctly", []string{"4", "*", "5"}, false, "4*5")
	givensForSuite["testDivisionExpression"] = createGiven("testDivisionExpression", "division expression is displayed correctly", []string{"8", "/", "2"}, false, "8/2")
	
	// Calculation tests
	givensForSuite["testSimpleAddition"] = createGiven("testSimpleAddition", "simple addition calculation", []string{"2", "3", "+", "4", "5"}, true, "Error")
	givensForSuite["testSimpleSubtraction"] = createGiven("testSimpleSubtraction", "simple subtraction calculation", []string{"9", "5", "-", "3", "2"}, true, "Error")
	givensForSuite["testSimpleMultiplication"] = createGiven("testSimpleMultiplication", "simple multiplication calculation", []string{"6", "*", "7"}, true, "Error")
	givensForSuite["testSimpleDivision"] = createGiven("testSimpleDivision", "simple division calculation", []string{"8", "4", "/", "2"}, true, "Error")
	
	// Edge cases
	givensForSuite["testClearOperation"] = createGiven("testClearOperation", "clear operation resets the display", []string{"1", "2", "3", "C", "4"}, false, "4")
	givensForSuite["testStartingWithOperator"] = createGiven("testStartingWithOperator", "starting with operator should work", []string{"+", "5"}, false, "+5")
	givensForSuite["testMultipleOperators"] = createGiven("testMultipleOperators", "multiple operators in sequence", []string{"5", "+", "-", "3"}, false, "5+-3")
	
	// Error cases
	givensForSuite["testDivisionByZero"] = createGiven("testDivisionByZero", "division by zero shows error", []string{"5", "/", "0"}, true, "Error")
	givensForSuite["testInvalidExpression"] = createGiven("testInvalidExpression", "invalid expression shows error", []string{"2", "+", "+", "3"}, true, "Error")
	
	// Memory functions
	givensForSuite["testMemoryStoreRecall"] = createGiven("testMemoryStoreRecall", "memory store and recall", []string{"1", "2", "3", "MS", "C", "MR"}, false, "123")
	givensForSuite["testMemoryClear"] = createGiven("testMemoryClear", "memory clear", []string{"4", "5", "6", "MS", "MC", "MR"}, false, "")
	givensForSuite["testMemoryAddition"] = createGiven("testMemoryAddition", "memory addition", []string{"1", "0", "M+", "2", "0", "M+", "MR"}, false, "01020")

	return []interface{}{
		suiteFunc("Testing Calculator operations", givensForSuite),
	}
}
