use calculator_example::Calculator;

#[test]
fn test_calculator_integration() {
    let mut calc = Calculator::new();
    
    // Test basic input
    calc.press("1").press("2").press("3");
    assert_eq!(calc.get_display(), "123");
    
    // Test clear
    calc.press("C");
    assert_eq!(calc.get_display(), "");
    
    // Test memory operations
    calc.press("4").press("5").press("MS");
    assert_eq!(calc.get_display(), "");
    
    calc.press("MR");
    assert_eq!(calc.get_display(), "45");
    
    calc.press("MC");
    calc.press("MR");
    assert_eq!(calc.get_display(), "0");
}

#[test]
fn test_arithmetic_operations() {
    let calc = Calculator::new();
    
    assert_eq!(calc.add(2.0, 3.0), 5.0);
    assert_eq!(calc.subtract(5.0, 3.0), 2.0);
    assert_eq!(calc.multiply(2.0, 3.0), 6.0);
    assert_eq!(calc.divide(6.0, 3.0).unwrap(), 2.0);
    assert!(calc.divide(1.0, 0.0).is_err());
}

#[test]
fn test_special_buttons() {
    let mut calc = Calculator::new();
    
    // Test M+ (memory add)
    calc.press("1").press("0").press("M+");
    calc.press("2").press("0").press("M+");
    calc.press("MR");
    assert_eq!(calc.get_display(), "30");
}
