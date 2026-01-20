use crate::types::IbddInAny;
use std::collections::HashMap;

pub struct BaseWhen<I: IbddInAny> {
    pub name: String,
    pub when_cb: Box<dyn Fn(I::Iselection) -> I::Then>,
    pub error: Option<String>,
    pub artifacts: Vec<String>,
    pub status: Option<bool>,
}

impl<I: IbddInAny> BaseWhen<I> {
    pub fn new(name: String, when_cb: Box<dyn Fn(I::Iselection) -> I::Then>) -> Self {
        Self {
            name,
            when_cb,
            error: None,
            artifacts: Vec::new(),
            status: None,
        }
    }
    
    pub fn add_artifact(&mut self, path: String) {
        let normalized_path = path.replace('\\', "/");
        self.artifacts.push(normalized_path);
    }
    
    pub fn to_obj(&self) -> HashMap<String, Box<dyn std::any::Any>> {
        let mut obj = HashMap::new();
        obj.insert("name".to_string(), Box::new(self.name.clone()) as Box<dyn std::any::Any>);
        obj.insert("status".to_string(), Box::new(self.status) as Box<dyn std::any::Any>);
        obj.insert("error".to_string(), Box::new(self.error.clone()) as Box<dyn std::any::Any>);
        obj.insert("artifacts".to_string(), Box::new(self.artifacts.clone()) as Box<dyn std::any::Any>);
        obj
    }
    
    pub async fn test(&mut self, store: I::Istore) -> Result<I::Istore, String> {
        // In a real implementation, this would execute the when callback
        // For now, just return the store unchanged
        Ok(store)
    }
}
