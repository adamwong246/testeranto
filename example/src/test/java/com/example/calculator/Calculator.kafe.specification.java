import java.util.*;

public class CalculatorKafeSpecification {
    
    public static Object specification(
        Map<String, String> suites,
        Map<String, Object> givens,
        Map<String, Object> whens,
        Map<String, Object> thens
    ) {
        // Get the functions
        Function<String, Function<Calculator, Calculator>> pressFunc = 
            (Function<String, Function<Calculator, Calculator>>) whens.get("press");
        Function<Void, Function<Calculator, Calculator>> enterFunc = 
            (Function<Void, Function<Calculator, Calculator>>) whens.get("enter");
        Function<String, Function<Calculator, Boolean>> resultFunc = 
            (Function<String, Function<Calculator, Boolean>>) thens.get("result");
        
        // Create test cases similar to other language implementations
        Map<String, Map<String, Object>> testCases = new HashMap<>();
        
        // Helper to create a test case
        Function<String, String, List<Object>, Boolean, String, Map<String, Object>> createTestCase = 
            (name, description, pressButtons, useEnter, expected) -> {
                List<Object> whenList = new ArrayList<>();
                for (String button : pressButtons) {
                    whenList.add(pressFunc.apply(button));
                }
                if (useEnter) {
                    whenList.add(enterFunc.apply(null));
                }
                
                Map<String, Object> testCase = new HashMap<>();
                testCase.put("description", description);
                testCase.put("whens", whenList);
                testCase.put("thens", Arrays.asList(resultFunc.apply(expected)));
                return testCase;
            };
        
        // Basic number input
        testCases.put("testEmptyDisplay", createTestCase.apply(
            "testEmptyDisplay", "pressing nothing, the display is empty", 
            new ArrayList<>(), false, ""
        ));
        
        testCases.put("testSingleDigit", createTestCase.apply(
            "testSingleDigit", "entering a number puts it on the display", 
            Arrays.asList("2"), false, "2"
        ));
        
        testCases.put("testMultipleDigits", createTestCase.apply(
            "testMultipleDigits", "entering multiple digits concatenates them", 
            Arrays.asList("2", "2"), false, "22"
        ));
        
        testCases.put("testLargeNumber", createTestCase.apply(
            "testLargeNumber", "entering a large number works correctly", 
            Arrays.asList("1", "2", "3", "4", "5"), false, "12345"
        ));
        
        // Basic operations
        testCases.put("testAdditionExpression", createTestCase.apply(
            "testAdditionExpression", "addition expression is displayed correctly", 
            Arrays.asList("2", "+", "3"), false, "2+3"
        ));
        
        testCases.put("testIncompleteAddition", createTestCase.apply(
            "testIncompleteAddition", "incomplete addition expression is displayed correctly", 
            Arrays.asList("2", "+"), false, "2+"
        ));
        
        testCases.put("testSubtractionExpression", createTestCase.apply(
            "testSubtractionExpression", "subtraction expression is displayed correctly", 
            Arrays.asList("7", "-", "3"), false, "7-3"
        ));
        
        testCases.put("testMultiplicationExpression", createTestCase.apply(
            "testMultiplicationExpression", "multiplication expression is displayed correctly", 
            Arrays.asList("4", "*", "5"), false, "4*5"
        ));
        
        testCases.put("testDivisionExpression", createTestCase.apply(
            "testDivisionExpression", "division expression is displayed correctly", 
            Arrays.asList("8", "/", "2"), false, "8/2"
        ));
        
        // Calculation tests
        testCases.put("testSimpleAddition", createTestCase.apply(
            "testSimpleAddition", "simple addition calculation", 
            Arrays.asList("2", "3", "+", "4", "5"), true, "68"
        ));
        
        testCases.put("testSimpleSubtraction", createTestCase.apply(
            "testSimpleSubtraction", "simple subtraction calculation", 
            Arrays.asList("9", "5", "-", "3", "2"), true, "63"
        ));
        
        testCases.put("testSimpleMultiplication", createTestCase.apply(
            "testSimpleMultiplication", "simple multiplication calculation", 
            Arrays.asList("6", "*", "7"), true, "42"
        ));
        
        testCases.put("testSimpleDivision", createTestCase.apply(
            "testSimpleDivision", "simple division calculation", 
            Arrays.asList("8", "4", "/", "2"), true, "42"
        ));
        
        // Edge cases
        testCases.put("testClearOperation", createTestCase.apply(
            "testClearOperation", "clear operation resets the display", 
            Arrays.asList("1", "2", "3", "C", "4"), false, "4"
        ));
        
        testCases.put("testStartingWithOperator", createTestCase.apply(
            "testStartingWithOperator", "starting with operator should work", 
            Arrays.asList("+", "5"), false, "+5"
        ));
        
        testCases.put("testMultipleOperators", createTestCase.apply(
            "testMultipleOperators", "multiple operators in sequence", 
            Arrays.asList("5", "+", "-", "3"), false, "5+-3"
        ));
        
        // Error cases
        testCases.put("testDivisionByZero", createTestCase.apply(
            "testDivisionByZero", "division by zero shows error", 
            Arrays.asList("5", "/", "0"), true, "Error"
        ));
        
        testCases.put("testInvalidExpression", createTestCase.apply(
            "testInvalidExpression", "invalid expression shows error", 
            Arrays.asList("2", "+", "+", "3"), true, "Error"
        ));
        
        // Memory functions
        testCases.put("testMemoryStoreRecall", createTestCase.apply(
            "testMemoryStoreRecall", "memory store and recall", 
            Arrays.asList("1", "2", "3", "MS", "C", "MR"), false, "123"
        ));
        
        testCases.put("testMemoryClear", createTestCase.apply(
            "testMemoryClear", "memory clear", 
            Arrays.asList("4", "5", "6", "MS", "MC", "MR"), false, "0"
        ));
        
        testCases.put("testMemoryAddition", createTestCase.apply(
            "testMemoryAddition", "memory addition", 
            Arrays.asList("1", "0", "M+", "2", "0", "M+", "MR"), false, "30"
        ));
        
        // Create the suite
        Map<String, Object> suite = new HashMap<>();
        suite.put("name", "Testing Calculator operations");
        suite.put("testCases", testCases);
        
        return Arrays.asList(suite);
    }
}
