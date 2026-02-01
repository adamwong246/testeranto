package com.example;

import com.example.calculator.Calculator;
import com.example.calculator.KafeCalculatorTest;

/**
 * Main class to demonstrate the Calculator functionality.
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("Java Calculator Example with Kafe Integration");
        System.out.println("=============================================");
        
        // Demonstrate basic Calculator functionality
        System.out.println("\n1. Basic Calculator Operations:");
        Calculator calc = new Calculator();
        
        calc.press("1").press("2").press("3");
        System.out.println("   After pressing 123: " + calc.getDisplay());
        
        calc.press("C");
        System.out.println("   After clear: " + calc.getDisplay());
        
        calc.press("4").press("5").press("6").press("+").press("7").press("8").press("9").enter();
        System.out.println("   After 456+789 and enter: " + calc.getDisplay());
        
        // Demonstrate memory operations
        System.out.println("\n2. Memory Operations:");
        Calculator calc2 = new Calculator();
        calc2.press("5").press("0").memoryStore();
        System.out.println("   After storing 50 in memory, display: " + calc2.getDisplay());
        
        calc2.press("2").press("5").memoryAdd();
        calc2.memoryRecall();
        System.out.println("   After adding 25 and recalling: " + calc2.getDisplay());
        
        // Demonstrate Kafe integration example
        System.out.println("\n3. Kafe Integration Example:");
        KafeCalculatorTest.main(new String[]{});
        
        System.out.println("\nJava Calculator example completed successfully!");
        System.out.println("\nTo run tests: mvn test");
        System.out.println("To build: mvn clean compile");
        System.out.println("To run: mvn exec:java -Dexec.mainClass=\"com.example.Main\"");
    }
}
