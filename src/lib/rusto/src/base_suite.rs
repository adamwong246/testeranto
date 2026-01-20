use crate::types::{IbddInAny, IbddOutAny, ITTestResourceConfiguration};
use std::collections::HashMap;

pub struct BaseSuite<I: IbddInAny, O: IbddOutAny> {
    pub name: String,
    pub givens: HashMap<String, Box<dyn std::any::Any>>,
    pub store: Option<I::Istore>,
    pub test_resource_configuration: Option<ITTestResourceConfiguration>,
    pub index: usize,
    pub failed: bool,
    pub fails: i32,
    pub artifacts: Vec<String>,
}

impl<I: IbddInAny, O: IbddOutAny> BaseSuite<I, O> {
    pub fn new(name: String, givens: HashMap<String, Box<dyn std::any::Any>>) -> Self {
        Self {
            name,
            givens,
            store: None,
            test_resource_configuration: None,
            index: 0,
            failed: false,
            fails: 0,
            artifacts: Vec::new(),
        }
    }
    
    pub fn add_artifact(&mut self, path: String) {
        let normalized_path = path.replace('\\', "/");
        self.artifacts.push(normalized_path);
    }
    
    pub fn features(&self) -> Vec<String> {
        let mut features = Vec::new();
        let mut seen = std::collections::HashSet::new();
        
        for given in self.givens.values() {
            // In a real implementation, we would extract features from the given
            // For now, return empty vector
        }
        
        features
    }
    
    pub fn to_obj(&self) -> HashMap<String, Box<dyn std::any::Any>> {
        let mut obj = HashMap::new();
        obj.insert("name".to_string(), Box::new(self.name.clone()) as Box<dyn std::any::Any>);
        obj.insert("fails".to_string(), Box::new(self.fails) as Box<dyn std::any::Any>);
        obj.insert("failed".to_string(), Box::new(self.failed) as Box<dyn std::any::Any>);
        obj.insert("features".to_string(), Box::new(self.features()) as Box<dyn std::any::Any>);
        obj.insert("artifacts".to_string(), Box::new(self.artifacts.clone()) as Box<dyn std::any::Any>);
        obj
    }
    
    pub async fn run(
        &mut self,
        input: I::Iinput,
        test_resource_configuration: ITTestResourceConfiguration,
    ) -> &Self {
        self.test_resource_configuration = Some(test_resource_configuration);
        self.fails = 0;
        self.failed = false;
        
        // In a real implementation, this would run all givens
        // For now, just return self
        
        self
    }
}
