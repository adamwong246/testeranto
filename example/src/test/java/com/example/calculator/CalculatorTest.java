package com.example.calculator;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for the Calculator class.
 */
public class CalculatorTest {
    
    private Calculator calculator;
    
    @BeforeEach
    void setUp() {
        calculator = new Calculator();
    }
    
    @Test
    void testNewCalculatorHasEmptyDisplay() {
        assertThat(calculator.getDisplay()).isEmpty();
    }
    
    @Test
    void testPressSingleDigit() {
        calculator.press("1");
        assertEquals("1", calculator.getDisplay());
    }
    
    @Test
    void testPressMultipleDigits() {
        calculator.press("1").press("2").press("3");
        assertEquals("123", calculator.getDisplay());
    }
    
    @Test
    void testClear() {
        calculator.press("1").press("2").press("3");
        calculator.press("C");
        assertThat(calculator.getDisplay()).isEmpty();
    }
    
    @Test
    void testMemoryOperations() {
        calculator.press("4").press("2").memoryStore();
        assertThat(calculator.getDisplay()).isEmpty();
        
        calculator.memoryRecall();
        assertEquals("42.0", calculator.getDisplay());
    }
    
    @Test
    void testMemoryAdd() {
        calculator.press("1").press("0").memoryAdd();
        calculator.press("2").press("0").memoryAdd();
        calculator.memoryRecall();
        assertEquals("30.0", calculator.getDisplay());
    }
    
    @Test
    void testMemoryClear() {
        calculator.press("5").press("0").memoryStore();
        calculator.memoryClear();
        calculator.memoryRecall();
        assertEquals("0.0", calculator.getDisplay());
    }
    
    @Test
    void testEnterWithNumber() {
        calculator.press("4").press("2").enter();
        assertEquals("42.0", calculator.getDisplay());
    }
    
    @Test
    void testEnterWithSimpleAddition() {
        calculator.press("1").press("2").press("+").press("3").press("4").enter();
        assertEquals("46.0", calculator.getDisplay());
    }
    
    @Test
    void testEnterWithInvalidExpression() {
        calculator.press("abc").enter();
        assertEquals("Error", calculator.getDisplay());
    }
    
    @Test
    void testBasicArithmeticOperations() {
        assertEquals(5.0, calculator.add(2.0, 3.0), 0.001);
        assertEquals(2.0, calculator.subtract(5.0, 3.0), 0.001);
        assertEquals(6.0, calculator.multiply(2.0, 3.0), 0.001);
        assertEquals(2.0, calculator.divide(6.0, 3.0), 0.001);
    }
    
    @Test
    void testDivideByZeroThrowsException() {
        assertThrows(ArithmeticException.class, () -> {
            calculator.divide(1.0, 0.0);
        });
    }
    
    @Test
    void testSetAndGetValue() {
        calculator.setValue("test", 42.0);
        assertEquals(42.0, calculator.getValue("test"));
        assertNull(calculator.getValue("nonexistent"));
    }
    
    @Test
    void testComplexSequence() {
        calculator.press("1").press("2").press("3").press("C").press("4").press("5").press("6");
        assertEquals("456", calculator.getDisplay());
        
        calculator.memoryStore();
        assertThat(calculator.getDisplay()).isEmpty();
        
        calculator.press("7").press("8").press("9");
        calculator.memoryAdd();
        calculator.memoryRecall();
        assertEquals("1245.0", calculator.getDisplay());
    }
    
    @Test
    void testSpecialButtons() {
        calculator.press("1").press("MS");
        assertThat(calculator.getDisplay()).isEmpty();
        
        calculator.press("2").press("M+");
        calculator.press("MR");
        assertEquals("3.0", calculator.getDisplay());
        
        calculator.press("MC");
        calculator.press("MR");
        assertEquals("0.0", calculator.getDisplay());
    }
}
