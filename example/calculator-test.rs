//! Simple test runner for Calculator
//! This demonstrates how to use the Calculator in a test-like manner

mod calculator;
use calculator::Calculator;

fn run_test(name: &str, test: impl Fn() -> bool) {
    match test() {
        true => println!("✓ {}", name),
        false => println!("✗ {}", name),
    }
}

fn main() {
    println!("Running Calculator tests...\n");
    
    // Basic number input
    run_test("basic addition", || {
        let mut calc = Calculator::new();
        calc.press("1").press("+").press("2").enter();
        calc.get_display() == "3"
    });
    
    run_test("clear display", || {
        let mut calc = Calculator::new();
        calc.press("1").press("2").press("3").clear();
        calc.get_display() == ""
    });
    
    run_test("memory operations", || {
        let mut calc = Calculator::new();
        calc.press("5").memory_store().clear().memory_recall();
        calc.get_display() == "5"
    });
    
    run_test("memory addition", || {
        let mut calc = Calculator::new();
        calc.press("3").memory_store().clear();
        calc.press("2").memory_add().clear().memory_recall();
        calc.get_display() == "5"
    });
    
    run_test("complex expression", || {
        let mut calc = Calculator::new();
        calc.press("1").press("0").press("*").press("2").enter();
        calc.get_display() == "20"
    });
    
    run_test("division by zero error", || {
        let mut calc = Calculator::new();
        calc.press("5").press("/").press("0").enter();
        calc.get_display() == "Error"
    });
    
    println!("\nAll tests completed!");
}
