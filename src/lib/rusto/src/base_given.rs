use crate::types::{IbddInAny, ITTestResourceConfiguration};
use std::collections::HashMap;

pub struct BaseGiven<I: IbddInAny> {
    pub key: String,
    pub features: Vec<String>,
    pub whens: Vec<Box<dyn std::any::Any>>,
    pub thens: Vec<Box<dyn std::any::Any>>,
    pub given_cb: I::Given,
    pub initial_values: Box<dyn std::any::Any>,
    pub artifacts: Vec<String>,
    pub error: Option<String>,
    pub failed: bool,
    pub store: Option<I::Istore>,
    pub fails: i32,
}

impl<I: IbddInAny> BaseGiven<I> {
    pub fn new(
        key: String,
        features: Vec<String>,
        whens: Vec<Box<dyn std::any::Any>>,
        thens: Vec<Box<dyn std::any::Any>>,
        given_cb: I::Given,
        initial_values: Box<dyn std::any::Any>,
    ) -> Self {
        Self {
            key,
            features,
            whens,
            thens,
            given_cb,
            initial_values,
            artifacts: Vec::new(),
            error: None,
            failed: false,
            store: None,
            fails: 0,
        }
    }
    
    pub fn add_artifact(&mut self, path: String) {
        let normalized_path = path.replace('\\', "/");
        self.artifacts.push(normalized_path);
    }
    
    pub fn to_obj(&self) -> HashMap<String, Box<dyn std::any::Any>> {
        let mut obj = HashMap::new();
        obj.insert("key".to_string(), Box::new(self.key.clone()) as Box<dyn std::any::Any>);
        obj.insert("features".to_string(), Box::new(self.features.clone()) as Box<dyn std::any::Any>);
        obj.insert("artifacts".to_string(), Box::new(self.artifacts.clone()) as Box<dyn std::any::Any>);
        obj.insert("failed".to_string(), Box::new(self.failed) as Box<dyn std::any::Any>);
        obj.insert("fails".to_string(), Box::new(self.fails) as Box<dyn std::any::Any>);
        obj
    }
    
    pub async fn give(
        &mut self,
        subject: I::Isubject,
        key: &str,
        test_resource_configuration: &ITTestResourceConfiguration,
    ) -> Option<I::Istore> {
        self.key = key.to_string();
        self.failed = false;
        self.fails = 0;
        
        // In a real implementation, this would execute the given
        // For now, just return None
        
        None
    }
}
