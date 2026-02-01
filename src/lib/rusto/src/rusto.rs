use crate::types::{
    IbddInAny, IbddOutAny, ITestSpecification, ITestImplementation, 
    ITestAdapter, ITTestResourceRequest, ITTestResourceConfiguration, IFinalResults
};
use std::collections::HashMap;
use serde_json;
use std::fs;
use std::path::Path;

pub struct Rusto<I: IbddInAny, O: IbddOutAny, M> {
    test_resource_requirement: ITTestResourceRequest,
    artifacts: Vec<Box<dyn std::any::Any>>,
    test_jobs: Vec<Box<dyn std::any::Any>>,
    test_specification: Box<ITestSpecification<I, O>>,
    suites_overrides: HashMap<String, Box<dyn Fn(String, HashMap<String, Box<dyn std::any::Any>>) -> Box<dyn std::any::Any>>>,
    given_overrides: HashMap<String, Box<dyn Fn(Vec<String>, Vec<Box<dyn std::any::Any>>, Vec<Box<dyn std::any::Any>>, Box<dyn std::any::Any>) -> Box<dyn std::any::Any>>>,
    when_overrides: HashMap<String, Box<dyn Fn(Box<dyn std::any::Any>) -> Box<dyn std::any::Any>>>,
    then_overrides: HashMap<String, Box<dyn Fn(Box<dyn std::any::Any>) -> Box<dyn std::any::Any>>>,
    puppet_master: Option<Box<dyn std::any::Any>>,
    specs: Vec<Box<dyn std::any::Any>>,
    total_tests: i32,
    assert_this: Box<dyn Fn(I::Then) -> bool>,
    test_adapter: Box<dyn ITestAdapter<I>>,
    test_subject: I::Iinput,
}

impl<I: IbddInAny + 'static, O: IbddOutAny + 'static, M: 'static> Rusto<I, O, M> {
    pub fn new(
        input_val: I::Iinput,
        test_specification: Box<ITestSpecification<I, O>>,
        test_implementation: ITestImplementation<I, O, M>,
        test_resource_requirement: ITTestResourceRequest,
        test_adapter: Box<dyn ITestAdapter<I>>,
    ) -> Self {
        // Initialize classy implementations
        let suites_overrides = HashMap::new();
        let given_overrides = HashMap::new();
        let when_overrides = HashMap::new();
        let then_overrides = HashMap::new();
        
        // Generate specs (simplified)
        let specs = Vec::new();
        
        Self {
            test_resource_requirement,
            artifacts: Vec::new(),
            test_jobs: Vec::new(),
            test_specification,
            suites_overrides,
            given_overrides,
            when_overrides,
            then_overrides,
            puppet_master: None,
            specs,
            total_tests: 0,
            assert_this: Box::new(|_| true),
            test_adapter,
            test_subject: input_val,
        }
    }
    
    pub async fn receive_test_resource_config(
        &mut self,
        partial_test_resource: &str,
        _websocket_port: &str,
    ) -> Result<IFinalResults, Box<dyn std::error::Error>> {
        // Parse test resource configuration
        let test_resource_config: ITTestResourceConfiguration = 
            serde_json::from_str(partial_test_resource)?;
        
        // Run tests (simplified)
        let total_fails = 0;
        let all_features = Vec::new();
        let all_artifacts: Vec<Box<dyn std::any::Any>> = Vec::new();
        
        // Write tests.json
        self.write_tests_json(total_fails, &all_features)?;
        
        Ok(IFinalResults {
            failed: total_fails > 0,
            fails: total_fails,
            artifacts: all_artifacts,
            features: all_features,
        })
    }
    
    fn write_tests_json(
        &self,
        total_fails: i32,
        features: &[String],
    ) -> Result<(), Box<dyn std::error::Error>> {
        let tests_data = serde_json::json!({
            "name": "Rust Test",
            "givens": [],
            "fails": total_fails,
            "failed": total_fails > 0,
            "features": features,
            "artifacts": []
        });
        
        // Create directory if it doesn't exist
        let dir_path = "testeranto/reports/allTests/example";
        if !Path::new(dir_path).exists() {
            fs::create_dir_all(dir_path)?;
        }
        
        // Write to file
        let file_path = format!("{}/rust.Calculator.test.ts.json", dir_path);
        fs::write(&file_path, serde_json::to_string_pretty(&tests_data)?)?;
        
        println!("tests.json written to: {}", file_path);
        Ok(())
    }
    
    // Helper methods for accessing overrides
    pub fn suites(&self) -> &HashMap<String, Box<dyn Fn(String, HashMap<String, Box<dyn std::any::Any>>) -> Box<dyn std::any::Any>>> {
        &self.suites_overrides
    }
    
    pub fn given(&self) -> &HashMap<String, Box<dyn Fn(Vec<String>, Vec<Box<dyn std::any::Any>>, Vec<Box<dyn std::any::Any>>, Box<dyn std::any::Any>) -> Box<dyn std::any::Any>>> {
        &self.given_overrides
    }
    
    pub fn when(&self) -> &HashMap<String, Box<dyn Fn(Box<dyn std::any::Any>) -> Box<dyn std::any::Any>>> {
        &self.when_overrides
    }
    
    pub fn then(&self) -> &HashMap<String, Box<dyn Fn(Box<dyn std::any::Any>) -> Box<dyn std::any::Any>>> {
        &self.then_overrides
    }
}
