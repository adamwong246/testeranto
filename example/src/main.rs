use rusto::{rusto, BaseGiven, BaseSuite, BaseThen, BaseWhen, SimpleTestAdapter};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// Define our Calculator type
#[derive(Clone, Debug)]
struct Calculator {
    display: String,
    memory: f64,
    values: HashMap<String, f64>,
}

impl Calculator {
    fn new() -> Self {
        Calculator {
            display: String::new(),
            memory: 0.0,
            values: HashMap::new(),
        }
    }

    fn press(&mut self, button: &str) -> &mut Self {
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

    fn enter(&mut self) -> &mut Self {
        // Simple evaluation
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

    fn memory_store(&mut self) -> &mut Self {
        if let Ok(value) = self.display.parse::<f64>() {
            self.memory = value;
            self.display.clear();
        }
        self
    }

    fn memory_recall(&mut self) -> &mut Self {
        self.display = self.memory.to_string();
        self
    }

    fn memory_clear(&mut self) -> &mut Self {
        self.memory = 0.0;
        self
    }

    fn memory_add(&mut self) -> &mut Self {
        if let Ok(value) = self.display.parse::<f64>() {
            self.memory += value;
            self.display.clear();
        }
        self
    }

    fn get_display(&self) -> String {
        self.display.clone()
    }

    fn evaluate_expression(&self) -> Result<f64, Box<dyn std::error::Error>> {
        // Simple evaluation - in a real implementation, use a proper parser
        self.display.parse::<f64>().map_err(|e| e.into())
    }
}

// Define types for Rusto
#[derive(Clone)]
struct Input {
    initial_value: String,
}

struct Subject {
    calculator: Calculator,
}

struct Store {
    calculator: Calculator,
}

struct Selection {
    display: String,
}

// Implement required traits
impl rusto::IbddInAny for Input {
    type Iinput = String;
    type Isubject = Subject;
    type Istore = Store;
    type Iselection = Selection;
    type Igiven = fn() -> Calculator;
    type Iwhen = fn(Calculator) -> Calculator;
    type Ithen = fn(Calculator) -> ();
}

impl rusto::IbddOutAny for Output {
    type Suites = HashMap<String, String>;
    type Givens = HashMap<String, Vec<String>>;
    type Whens = HashMap<String, Vec<String>>;
    type Thens = HashMap<String, Vec<String>>;
}

#[derive(Clone)]
struct Output {
    suites: HashMap<String, String>,
    givens: HashMap<String, Vec<String>>,
    whens: HashMap<String, Vec<String>>,
    thens: HashMap<String, Vec<String>>,
}

struct Model {
    givens: HashMap<String, fn() -> Calculator>,
    whens: HashMap<String, fn(String) -> fn(Calculator) -> Calculator>,
    thens: HashMap<String, fn(String) -> fn(Calculator) -> ()>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Starting Calculator example with Rusto...");

    // Create test implementation
    let implementation = Model {
        givens: {
            let mut map = HashMap::new();
            map.insert("Default".to_string(), || Calculator::new());
            map
        },
        whens: {
            let mut map = HashMap::new();
            map.insert(
                "press".to_string(),
                |button: String| {
                    move |mut calc: Calculator| {
                        calc.press(&button);
                        calc
                    }
                },
            );
            map.insert(
                "enter".to_string(),
                |_: String| {
                    move |mut calc: Calculator| {
                        calc.enter();
                        calc
                    }
                },
            );
            map
        },
        thens: {
            let mut map = HashMap::new();
            map.insert(
                "result".to_string(),
                |expected: String| {
                    move |calc: Calculator| {
                        let actual = calc.get_display();
                        assert_eq!(actual, expected);
                    }
                },
            );
            map
        },
    };

    // Create specification
    let specification = |suites: HashMap<String, String>,
                         givens: HashMap<String, Vec<String>>,
                         whens: HashMap<String, Vec<String>>,
                         thens: HashMap<String, Vec<String>>| {
        // Create test cases
        let mut suite_givens = HashMap::new();

        // Basic test: empty display
        let empty_display = BaseGiven::new(
            "testEmptyDisplay",
            vec!["pressing nothing, the display is empty".to_string()],
            vec![],
            vec![BaseThen::new(
                "result",
                Box::new(|store: &Store, _: &(), _: &()| {
                    let display = store.calculator.get_display();
                    assert_eq!(display, "");
                    Ok(())
                }),
            )],
            Box::new(|| Store {
                calculator: Calculator::new(),
            }),
            (),
        );

        suite_givens.insert("testEmptyDisplay".to_string(), empty_display);

        // Test: single digit
        let single_digit = BaseGiven::new(
            "testSingleDigit",
            vec!["entering a number puts it on the display".to_string()],
            vec![BaseWhen::new(
                "press",
                Box::new(|store: &mut Store, _: &(), _: &()| {
                    store.calculator.press("2");
                    Ok(())
                }),
            )],
            vec![BaseThen::new(
                "result",
                Box::new(|store: &Store, _: &(), _: &()| {
                    let display = store.calculator.get_display();
                    assert_eq!(display, "2");
                    Ok(())
                }),
            )],
            Box::new(|| Store {
                calculator: Calculator::new(),
            }),
            (),
        );

        suite_givens.insert("testSingleDigit".to_string(), single_digit);

        vec![BaseSuite::new(
            "Testing Calculator operations".to_string(),
            suite_givens,
        )]
    };

    // Create adapter
    let adapter = SimpleTestAdapter::new();

    // Create Rusto instance
    let rusto_instance = rusto(
        "initial".to_string(),
        specification,
        implementation,
        Box::new(adapter),
        rusto::ITTestResourceRequest {
            name: "test".to_string(),
            ports: vec![8080],
            ..Default::default()
        },
    );

    println!("Rusto instance created successfully!");
    println!("Run `cargo test` to execute the tests.");

    Ok(())
}
