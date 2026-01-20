package com.example.calculator;

import java.util.HashMap;
import java.util.Map;

/**
 * A simple calculator class for demonstration purposes.
 * Compatible with the Testeranto framework.
 */
public class Calculator {
    private String display;
    private double memory;
    private Map<String, Object> values;
    
    public Calculator() {
        this.display = "";
        this.memory = 0.0;
        this.values = new HashMap<>();
    }
    
    /**
     * Press a button on the calculator.
     * @param button The button to press
     * @return This calculator instance for method chaining
     */
    public Calculator press(String button) {
        // Handle special buttons
        if ("C".equals(button)) {
            return clear();
        } else if ("MS".equals(button)) {
            return memoryStore();
        } else if ("MR".equals(button)) {
            return memoryRecall();
        } else if ("MC".equals(button)) {
            return memoryClear();
        } else if ("M+".equals(button)) {
            return memoryAdd();
        } else {
            // For regular buttons, append to display
            display = display + button;
            return this;
        }
    }
    
    /**
     * Evaluate the expression on the display.
     * @return This calculator instance for method chaining
     */
    public Calculator enter() {
        try {
            // Simple evaluation - in a real calculator, use a proper parser
            if (display.isEmpty()) {
                return this;
            }
            // Try to parse as a number
            try {
                double result = Double.parseDouble(display);
                display = String.valueOf(result);
            } catch (NumberFormatException e) {
                // Try basic arithmetic operations
                if (display.contains("+")) {
                    String[] parts = display.split("\\+");
                    if (parts.length == 2) {
                        try {
                            double a = Double.parseDouble(parts[0]);
                            double b = Double.parseDouble(parts[1]);
                            display = String.valueOf(a + b);
                        } catch (NumberFormatException ex) {
                            display = "Error";
                        }
                    } else {
                        display = "Error";
                    }
                } else {
                    display = "Error";
                }
            }
        } catch (Exception e) {
            display = "Error";
        }
        return this;
    }
    
    /**
     * Store the current display value in memory.
     * @return This calculator instance for method chaining
     */
    public Calculator memoryStore() {
        try {
            memory = Double.parseDouble(display);
            display = "";
        } catch (NumberFormatException e) {
            // If display is not a valid number, do nothing
        }
        return this;
    }
    
    /**
     * Recall the value from memory to the display.
     * @return This calculator instance for method chaining
     */
    public Calculator memoryRecall() {
        display = String.valueOf(memory);
        return this;
    }
    
    /**
     * Clear the memory value.
     * @return This calculator instance for method chaining
     */
    public Calculator memoryClear() {
        memory = 0.0;
        return this;
    }
    
    /**
     * Add the current display value to memory.
     * @return This calculator instance for method chaining
     */
    public Calculator memoryAdd() {
        try {
            double current = Double.parseDouble(display);
            memory += current;
            display = "";
        } catch (NumberFormatException e) {
            // If display is not a valid number, do nothing
        }
        return this;
    }
    
    /**
     * Get the current display value.
     * @return The display value as a string
     */
    public String getDisplay() {
        return display;
    }
    
    /**
     * Clear the display.
     * @return This calculator instance for method chaining
     */
    public Calculator clear() {
        display = "";
        return this;
    }
    
    // Basic arithmetic operations for compatibility
    
    public double add(double a, double b) {
        return a + b;
    }
    
    public double subtract(double a, double b) {
        return a - b;
    }
    
    public double multiply(double a, double b) {
        return a * b;
    }
    
    public double divide(double a, double b) {
        if (b == 0.0) {
            throw new ArithmeticException("Cannot divide by zero");
        }
        return a / b;
    }
    
    public void setValue(String identifier, Object value) {
        values.put(identifier, value);
    }
    
    public Object getValue(String identifier) {
        return values.get(identifier);
    }
    
    // Additional methods for Kafe compatibility
    
    public Map<String, Object> getValues() {
        return new HashMap<>(values);
    }
    
    public double getMemory() {
        return memory;
    }
}
