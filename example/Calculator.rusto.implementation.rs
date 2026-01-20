use std::collections::HashMap;

#[derive(Clone, Debug)]
pub struct Calculator {
    display: String,
    memory: f64,
    values: HashMap<String, f64>,
}

impl Calculator {
    pub fn new() -> Self {
        Calculator {
            display: String::new(),
            memory: 0.0,
            values: HashMap::new(),
        }
    }

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

    pub fn memory_store(&mut self) -> &mut Self {
        if let Ok(value) = self.display.parse::<f64>() {
            self.memory = value;
            self.display.clear();
        }
        self
    }

    pub fn memory_recall(&mut self) -> &mut Self {
        self.display = self.memory.to_string();
        self
    }

    pub fn memory_clear(&mut self) -> &mut Self {
        self.memory = 0.0;
        self
    }

    pub fn memory_add(&mut self) -> &mut Self {
        if let Ok(value) = self.display.parse::<f64>() {
            self.memory += value;
            self.display.clear();
        }
        self
    }

    pub fn get_display(&self) -> String {
        self.display.clone()
    }

    fn evaluate_expression(&self) -> Result<f64, Box<dyn std::error::Error>> {
        self.display.parse::<f64>().map_err(|e| e.into())
    }
}

pub struct Implementation {
    pub suites: HashMap<String, String>,
    pub givens: HashMap<String, Box<dyn Fn() -> Calculator>>,
    pub whens: HashMap<String, Box<dyn Fn(String) -> Box<dyn Fn(Calculator) -> Calculator>>>,
    pub thens: HashMap<String, Box<dyn Fn(String) -> Box<dyn Fn(Calculator) -> ()>>>,
}

impl Implementation {
    pub fn new() -> Self {
        let mut suites = HashMap::new();
        suites.insert("Default".to_string(), "Default test suite for Calculator".to_string());
        
        let mut givens = HashMap::new();
        givens.insert("Default".to_string(), Box::new(|| Calculator::new()) as Box<dyn Fn() -> Calculator>);
        
        let mut whens = HashMap::new();
        whens.insert("press".to_string(), Box::new(|button: String| {
            Box::new(move |mut calc: Calculator| {
                calc.press(&button);
                calc
            }) as Box<dyn Fn(Calculator) -> Calculator>
        }) as Box<dyn Fn(String) -> Box<dyn Fn(Calculator) -> Calculator>>);
        
        whens.insert("enter".to_string(), Box::new(|_: String| {
            Box::new(move |mut calc: Calculator| {
                calc.enter();
                calc
            }) as Box<dyn Fn(Calculator) -> Calculator>
        }) as Box<dyn Fn(String) -> Box<dyn Fn(Calculator) -> Calculator>>);
        
        let mut thens = HashMap::new();
        thens.insert("result".to_string(), Box::new(|expected: String| {
            Box::new(move |calc: Calculator| {
                let actual = calc.get_display();
                assert_eq!(actual, expected);
            }) as Box<dyn Fn(Calculator) -> ()>
        }) as Box<dyn Fn(String) -> Box<dyn Fn(Calculator) -> ()>>);
        
        Implementation {
            suites,
            givens,
            whens,
            thens,
        }
    }
}
