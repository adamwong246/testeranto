//! Calculator implementation in Rust
//! This is a regular program, not a unit test, matching the structure of other language implementations

use std::collections::HashMap;

/// A simple calculator class for demonstration purposes.
#[derive(Debug, Clone)]
pub struct Calculator {
    display: String,
    memory: f64,
    values: HashMap<String, f64>,
}

impl Calculator {
    /// Create a new Calculator instance
    pub fn new() -> Self {
        Calculator {
            display: String::new(),
            memory: 0.0,
            values: HashMap::new(),
        }
    }

    /// Press a button on the calculator
    pub fn press(&mut self, button: &str) -> &mut Self {
        match button {
            "C" => {
                self.display.clear();
                self
            }
            "MS" => self.memory_store(),
            "MR" => self.memory_recall(),
            "MC" => self.memory_clear(),
            "M+" => self.memory_add(),
            _ => {
                self.display.push_str(button);
                self
            }
        }
    }

    /// Evaluate the expression on the display
    pub fn enter(&mut self) -> &mut Self {
        match self.evaluate_expression() {
            Ok(result) => {
                self.display = result.to_string();
            }
            Err(_) => {
                self.display = "Error".to_string();
            }
        }
        self
    }

    /// Store the current display value in memory
    pub fn memory_store(&mut self) -> &mut Self {
        if let Ok(value) = self.display.parse::<f64>() {
            self.memory = value;
            self.display.clear();
        }
        self
    }

    /// Recall the value from memory to the display
    pub fn memory_recall(&mut self) -> &mut Self {
        self.display = self.memory.to_string();
        self
    }

    /// Clear the memory value
    pub fn memory_clear(&mut self) -> &mut Self {
        self.memory = 0.0;
        self
    }

    /// Add the current display value to memory
    pub fn memory_add(&mut self) -> &mut Self {
        if let Ok(value) = self.display.parse::<f64>() {
            self.memory += value;
            self.display.clear();
        }
        self
    }

    /// Get the current display value
    pub fn get_display(&self) -> &str {
        &self.display
    }

    /// Clear the display
    pub fn clear(&mut self) -> &mut Self {
        self.display.clear();
        self
    }

    /// Basic arithmetic operations for compatibility
    pub fn add(&self, a: f64, b: f64) -> f64 {
        a + b
    }

    pub fn subtract(&self, a: f64, b: f64) -> f64 {
        a - b
    }

    pub fn multiply(&self, a: f64, b: f64) -> f64 {
        a * b
    }

    pub fn divide(&self, a: f64, b: f64) -> Result<f64, &'static str> {
        if b == 0.0 {
            Err("Cannot divide by zero")
        } else {
            Ok(a / b)
        }
    }

    /// Set a value in the calculator's storage
    pub fn set_value(&mut self, identifier: &str, value: f64) {
        self.values.insert(identifier.to_string(), value);
    }

    /// Get a value from the calculator's storage
    pub fn get_value(&self, identifier: &str) -> Option<f64> {
        self.values.get(identifier).copied()
    }

    /// Simple expression evaluation
    fn evaluate_expression(&self) -> Result<f64, Box<dyn std::error::Error>> {
        // Simple evaluation - in a real implementation, use a proper parser
        // For now, just handle basic arithmetic
        if self.display.is_empty() {
            return Ok(0.0);
        }
        
        // Try to parse as a single number
        if let Ok(num) = self.display.parse::<f64>() {
            return Ok(num);
        }
        
        // Try basic arithmetic operations
        if self.display.contains('+') {
            let parts: Vec<&str> = self.display.split('+').collect();
            if parts.len() == 2 {
                let a = parts[0].parse::<f64>()?;
                let b = parts[1].parse::<f64>()?;
                return Ok(a + b);
            }
        } else if self.display.contains('-') {
            let parts: Vec<&str> = self.display.split('-').collect();
            if parts.len() == 2 {
                let a = parts[0].parse::<f64>()?;
                let b = parts[1].parse::<f64>()?;
                return Ok(a - b);
            }
        } else if self.display.contains('*') {
            let parts: Vec<&str> = self.display.split('*').collect();
            if parts.len() == 2 {
                let a = parts[0].parse::<f64>()?;
                let b = parts[1].parse::<f64>()?;
                return Ok(a * b);
            }
        } else if self.display.contains('/') {
            let parts: Vec<&str> = self.display.split('/').collect();
            if parts.len() == 2 {
                let a = parts[0].parse::<f64>()?;
                let b = parts[1].parse::<f64>()?;
                if b == 0.0 {
                    return Err("Division by zero".into());
                }
                return Ok(a / b);
            }
        }
        
        Err("Invalid expression".into())
    }
}

/// Main function to demonstrate the Calculator
fn main() {
    println!("Rust Calculator Example");
    println!("=======================\n");
    
    // Demonstrate basic Calculator functionality
    println!("1. Basic Calculator Operations:");
    let mut calc = Calculator::new();
    
    calc.press("1").press("2").press("3");
    println!("   After pressing 123: {}", calc.get_display());
    
    calc.press("C");
    println!("   After clear: {}", calc.get_display());
    
    calc.press("4").press("5").press("6").press("+").press("7").press("8").press("9").enter();
    println!("   After 456+789 and enter: {}", calc.get_display());
    
    // Demonstrate memory operations
    println!("\n2. Memory Operations:");
    let mut calc2 = Calculator::new();
    calc2.press("5").press("0").memory_store();
    println!("   After storing 50 in memory, display: {}", calc2.get_display());
    
    calc2.press("2").press("5").memory_add();
    calc2.memory_recall();
    println!("   After adding 25 and recalling: {}", calc2.get_display());
    
    // Demonstrate arithmetic operations
    println!("\n3. Arithmetic Operations:");
    let calc3 = Calculator::new();
    println!("   Add 2.5 + 3.5 = {}", calc3.add(2.5, 3.5));
    println!("   Subtract 10.0 - 4.5 = {}", calc3.subtract(10.0, 4.5));
    println!("   Multiply 3.0 * 4.0 = {}", calc3.multiply(3.0, 4.0));
    
    match calc3.divide(10.0, 2.0) {
        Ok(result) => println!("   Divide 10.0 / 2.0 = {}", result),
        Err(e) => println!("   Error: {}", e),
    }
    
    match calc3.divide(5.0, 0.0) {
        Ok(result) => println!("   Divide 5.0 / 0.0 = {}", result),
        Err(e) => println!("   Divide 5.0 / 0.0 = Error: {}", e),
    }
    
    // Demonstrate complex sequence
    println!("\n4. Complex Sequence:");
    let mut calc4 = Calculator::new();
    calc4.press("1").press("2").press("3").press("C").press("4").press("5").press("6");
    println!("   After 123, C, 456: {}", calc4.get_display());
    
    calc4.memory_store();
    println!("   After memory store: {}", calc4.get_display());
    
    calc4.press("7").press("8").press("9");
    calc4.memory_add();
    calc4.memory_recall();
    println!("   After 789, M+, MR: {}", calc4.get_display());
    
    println!("\nRust Calculator example completed successfully!");
    println!("\nTo run tests: cargo test");
    println!("To build: cargo build");
    println!("To run: cargo run --bin calculator-example");
}
