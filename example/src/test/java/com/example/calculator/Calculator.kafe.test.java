import com.testeranto.kafe.Kafe;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class CalculatorKafeTest {
    
    public static void main(String[] args) {
        System.out.println("Starting Calculator Kafe tests...");
        
        // Create test implementation
        Map<String, String> suites = new HashMap<>();
        suites.put("Default", "Default test suite for Calculator");
        
        Map<String, Object> givens = new HashMap<>();
        givens.put("Default", (Function<Void, Calculator>) (v) -> new Calculator());
        
        Map<String, Object> whens = new HashMap<>();
        whens.put("press", (Function<String, Function<Calculator, Calculator>>) 
            button -> calculator -> calculator.press(button));
        whens.put("enter", (Function<Void, Function<Calculator, Calculator>>) 
            v -> calculator -> calculator.enter());
        whens.put("memoryStore", (Function<Void, Function<Calculator, Calculator>>) 
            v -> calculator -> calculator.memoryStore());
        whens.put("memoryRecall", (Function<Void, Function<Calculator, Calculator>>) 
            v -> calculator -> calculator.memoryRecall());
        whens.put("memoryClear", (Function<Void, Function<Calculator, Calculator>>) 
            v -> calculator -> calculator.memoryClear());
        whens.put("memoryAdd", (Function<Void, Function<Calculator, Calculator>>) 
            v -> calculator -> calculator.memoryAdd());
        
        Map<String, Object> thens = new HashMap<>();
        thens.put("result", (Function<String, Function<Calculator, Boolean>>) 
            expected -> calculator -> {
                String actual = calculator.getDisplay();
                if (!actual.equals(expected)) {
                    System.err.println("Expected display '" + expected + "', got '" + actual + "'");
                    return false;
                }
                return true;
            });
        
        // Create specification
        Kafe.TestSpecification specification = (suitesMap, givensMap, whensMap, thensMap) -> {
            // Create test cases similar to other language implementations
            Map<String, Object> testCases = new HashMap<>();
            
            // Basic number input tests
            testCases.put("testEmptyDisplay", Map.of(
                "description", "pressing nothing, the display is empty",
                "whens", new Object[]{},
                "thens", new Object[]{((Function<String, Function<Calculator, Boolean>>) 
                    expected -> calculator -> calculator.getDisplay().equals(expected)).apply("")}
            ));
            
            testCases.put("testSingleDigit", Map.of(
                "description", "entering a number puts it on the display",
                "whens", new Object[]{
                    ((Function<String, Function<Calculator, Calculator>>) 
                        button -> calculator -> calculator.press(button)).apply("2")
                },
                "thens", new Object[]{((Function<String, Function<Calculator, Boolean>>) 
                    expected -> calculator -> calculator.getDisplay().equals(expected)).apply("2")}
            ));
            
            // Return the test suite
            return new Object[]{Map.of(
                "name", "Testing Calculator operations",
                "testCases", testCases
            )};
        };
        
        // Create adapter
        Kafe.TestAdapter adapter = new Kafe.TestAdapter() {
            @Override
            public Object beforeAll(Object input, Object testResource) {
                return input;
            }
            
            @Override
            public Object beforeEach(Object subject, Object initializer, Object testResource, Object initialValues) {
                return ((Function<Void, Calculator>) initializer).apply(null);
            }
            
            @Override
            public Object andWhen(Object store, Object whenCB, Object testResource) {
                return ((Function<Calculator, Calculator>) whenCB).apply((Calculator) store);
            }
            
            @Override
            public Object butThen(Object store, Object thenCB, Object testResource) {
                return ((Function<Calculator, Boolean>) thenCB).apply((Calculator) store);
            }
            
            @Override
            public Object afterEach(Object store, String key) {
                return store;
            }
            
            @Override
            public Object afterAll(Object store) {
                return store;
            }
            
            @Override
            public boolean assertThis(Object actual) {
                return actual instanceof Boolean ? (Boolean) actual : false;
            }
        };
        
        // Create Kafe instance and run tests
        try {
            Kafe kafe = new Kafe(
                null,
                specification,
                Map.of("suites", suites, "givens", givens, "whens", whens, "thens", thens),
                adapter,
                Map.of("ports", 1000)
            );
            
            // Run tests with a simple test resource configuration
            Map<String, Object> testResource = new HashMap<>();
            testResource.put("name", "java-test");
            testResource.put("fs", ".");
            testResource.put("ports", new int[]{8080});
            
            Object results = kafe.receiveTestResourceConfig(testResource, null);
            System.out.println("Tests completed: " + results);
            
        } catch (Exception e) {
            System.err.println("Error running tests: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
