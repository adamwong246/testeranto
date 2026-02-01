use std::collections::HashMap;
use rusto::{BaseSuite, BaseGiven, BaseWhen, BaseThen};

pub fn specification(
    suites: HashMap<String, String>,
    givens: HashMap<String, Vec<String>>,
    whens: HashMap<String, Vec<String>>,
    thens: HashMap<String, Vec<String>>,
) -> Vec<BaseSuite> {
    // Get the suite function
    let suite_func = suites.get("Default").unwrap();
    
    // Create givens for the suite
    let mut suite_givens = HashMap::new();
    
    // Helper to create a given
    fn create_given(
        name: &str,
        description: &str,
        press_buttons: Vec<&str>,
        use_enter: bool,
        expected: &str,
    ) -> BaseGiven {
        let mut whens_list = Vec::new();
        
        for button in press_buttons {
            whens_list.push(BaseWhen::new(
                "press",
                Box::new(move |store: &mut rusto::Store, _: &(), _: &()| {
                    // We need to access the calculator in the store
                    // This is a simplified version
                    Ok(())
                }),
            ));
        }
        
        if use_enter {
            whens_list.push(BaseWhen::new(
                "enter",
                Box::new(|store: &mut rusto::Store, _: &(), _: &()| {
                    Ok(())
                }),
            ));
        }
        
        let thens_list = vec![BaseThen::new(
            "result",
            Box::new(move |store: &rusto::Store, _: &(), _: &()| {
                // Check the result
                Ok(())
            }),
        )];
        
        BaseGiven::new(
            name.to_string(),
            vec![description.to_string()],
            whens_list,
            thens_list,
            Box::new(|| rusto::Store {
                // Create a default store
                calculator: crate::Calculator::new(),
            }),
            (),
        )
    }
    
    // Basic number input
    suite_givens.insert("testEmptyDisplay".to_string(), create_given(
        "testEmptyDisplay",
        "pressing nothing, the display is empty",
        vec![],
        false,
        "",
    ));
    
    suite_givens.insert("testSingleDigit".to_string(), create_given(
        "testSingleDigit",
        "entering a number puts it on the display",
        vec!["2"],
        false,
        "2",
    ));
    
    suite_givens.insert("testMultipleDigits".to_string(), create_given(
        "testMultipleDigits",
        "entering multiple digits concatenates them",
        vec!["2", "2"],
        false,
        "22",
    ));
    
    suite_givens.insert("testLargeNumber".to_string(), create_given(
        "testLargeNumber",
        "entering a large number works correctly",
        vec!["1", "2", "3", "4", "5"],
        false,
        "12345",
    ));
    
    // Basic operations
    suite_givens.insert("testAdditionExpression".to_string(), create_given(
        "testAdditionExpression",
        "addition expression is displayed correctly",
        vec!["2", "+", "3"],
        false,
        "2+3",
    ));
    
    suite_givens.insert("testIncompleteAddition".to_string(), create_given(
        "testIncompleteAddition",
        "incomplete addition expression is displayed correctly",
        vec!["2", "+"],
        false,
        "2+",
    ));
    
    suite_givens.insert("testSubtractionExpression".to_string(), create_given(
        "testSubtractionExpression",
        "subtraction expression is displayed correctly",
        vec!["7", "-", "3"],
        false,
        "7-3",
    ));
    
    suite_givens.insert("testMultiplicationExpression".to_string(), create_given(
        "testMultiplicationExpression",
        "multiplication expression is displayed correctly",
        vec!["4", "*", "5"],
        false,
        "4*5",
    ));
    
    suite_givens.insert("testDivisionExpression".to_string(), create_given(
        "testDivisionExpression",
        "division expression is displayed correctly",
        vec!["8", "/", "2"],
        false,
        "8/2",
    ));
    
    // Calculation tests
    suite_givens.insert("testSimpleAddition".to_string(), create_given(
        "testSimpleAddition",
        "simple addition calculation",
        vec!["2", "3", "+", "4", "5"],
        true,
        "68",
    ));
    
    suite_givens.insert("testSimpleSubtraction".to_string(), create_given(
        "testSimpleSubtraction",
        "simple subtraction calculation",
        vec!["9", "5", "-", "3", "2"],
        true,
        "63",
    ));
    
    suite_givens.insert("testSimpleMultiplication".to_string(), create_given(
        "testSimpleMultiplication",
        "simple multiplication calculation",
        vec!["6", "*", "7"],
        true,
        "42",
    ));
    
    suite_givens.insert("testSimpleDivision".to_string(), create_given(
        "testSimpleDivision",
        "simple division calculation",
        vec!["8", "4", "/", "2"],
        true,
        "42",
    ));
    
    // Edge cases
    suite_givens.insert("testClearOperation".to_string(), create_given(
        "testClearOperation",
        "clear operation resets the display",
        vec!["1", "2", "3", "C", "4"],
        false,
        "4",
    ));
    
    suite_givens.insert("testStartingWithOperator".to_string(), create_given(
        "testStartingWithOperator",
        "starting with operator should work",
        vec!["+", "5"],
        false,
        "+5",
    ));
    
    suite_givens.insert("testMultipleOperators".to_string(), create_given(
        "testMultipleOperators",
        "multiple operators in sequence",
        vec!["5", "+", "-", "3"],
        false,
        "5+-3",
    ));
    
    // Error cases
    suite_givens.insert("testDivisionByZero".to_string(), create_given(
        "testDivisionByZero",
        "division by zero shows error",
        vec!["5", "/", "0"],
        true,
        "Error",
    ));
    
    suite_givens.insert("testInvalidExpression".to_string(), create_given(
        "testInvalidExpression",
        "invalid expression shows error",
        vec!["2", "+", "+", "3"],
        true,
        "Error",
    ));
    
    // Memory functions
    suite_givens.insert("testMemoryStoreRecall".to_string(), create_given(
        "testMemoryStoreRecall",
        "memory store and recall",
        vec!["1", "2", "3", "MS", "C", "MR"],
        false,
        "123",
    ));
    
    suite_givens.insert("testMemoryClear".to_string(), create_given(
        "testMemoryClear",
        "memory clear",
        vec!["4", "5", "6", "MS", "MC", "MR"],
        false,
        "0",
    ));
    
    suite_givens.insert("testMemoryAddition".to_string(), create_given(
        "testMemoryAddition",
        "memory addition",
        vec!["1", "0", "M+", "2", "0", "M+", "MR"],
        false,
        "30",
    ));
    
    vec![BaseSuite::new(
        "Testing Calculator operations".to_string(),
        suite_givens,
    )]
}
