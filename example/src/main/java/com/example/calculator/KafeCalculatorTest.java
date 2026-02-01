package com.example.calculator;

import java.util.HashMap;
import java.util.Map;

/**
 * Example of using Calculator with Kafe testing framework.
 * This demonstrates how the Calculator could be integrated with Kafe.
 */
public class KafeCalculatorTest {
    
    // Example test implementation structure
    public static class CalculatorTestImplementation {
        public Map<String, String> suites;
        public Map<String, Object> givens;
        public Map<String, Object> whens;
        public Map<String, Object> thens;
        
        public CalculatorTestImplementation() {
            suites = new HashMap<>();
            suites.put("Default", "Default test suite for Calculator");
            
            givens = new HashMap<>();
            givens.put("Default", (Runnable) () -> new Calculator());
            
            whens = new HashMap<>();
            whens.put("press", (java.util.function.Function<String, java.util.function.Function<Calculator, Calculator>>) 
                button -> calculator -> calculator.press(button));
            whens.put("enter", (java.util.function.Supplier<java.util.function.Function<Calculator, Calculator>>) 
                () -> calculator -> calculator.enter());
            whens.put("memoryStore", (java.util.function.Supplier<java.util.function.Function<Calculator, Calculator>>) 
                () -> calculator -> calculator.memoryStore());
            whens.put("memoryRecall", (java.util.function.Supplier<java.util.function.Function<Calculator, Calculator>>) 
                () -> calculator -> calculator.memoryRecall());
            whens.put("memoryClear", (java.util.function.Supplier<java.util.function.Function<Calculator, Calculator>>) 
                () -> calculator -> calculator.memoryClear());
            whens.put("memoryAdd", (java.util.function.Supplier<java.util.function.Function<Calculator, Calculator>>) 
                () -> calculator -> calculator.memoryAdd());
            
            thens = new HashMap<>();
            thens.put("result", (java.util.function.Function<String, java.util.function.Function<Calculator, Void>>) 
                expected -> calculator -> {
                    String actual = calculator.getDisplay();
                    if (!actual.equals(expected)) {
                        throw new AssertionError("Expected display '" + expected + "', got '" + actual + "'");
                    }
                    return null;
                });
        }
    }
    
    // Example test specification
    public interface TestSpecification {
        Object createTestSuite(Object suites, Object givens, Object whens, Object thens);
    }
    
    public static void main(String[] args) {
        System.out.println("Kafe Calculator Test Example");
        System.out.println("============================");
        
        CalculatorTestImplementation impl = new CalculatorTestImplementation();
        
        // Demonstrate the implementation
        System.out.println("Suites: " + impl.suites);
        System.out.println("Number of givens: " + impl.givens.size());
        System.out.println("Number of whens: " + impl.whens.size());
        System.out.println("Number of thens: " + impl.thens.size());
        
        // Test the calculator directly
        Calculator calc = new Calculator();
        calc.press("1").press("2").press("3");
        System.out.println("\nDirect test - After pressing 123: " + calc.getDisplay());
        
        calc.press("+").press("4").press("5").press("6").enter();
        System.out.println("After 123+456 and enter: " + calc.getDisplay());
        
        System.out.println("\nKafe integration example completed!");
    }
}
