use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use async_trait::async_trait;

// Type variables for BDD input/output types
pub trait IbddInAny {
    type Iinput;
    type Isubject;
    type Istore;
    type Iselection;
    type Then;
    type Given;
}

pub trait IbddOutAny {}

// Test resource configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ITTestResourceConfiguration {
    pub name: String,
    pub fs: String,
    pub ports: Vec<u16>,
    pub browser_ws_endpoint: Option<String>,
    pub timeout: Option<u32>,
    pub retries: Option<u32>,
    pub environment: Option<HashMap<String, String>>,
}

// Test adapter interface
#[async_trait]
pub trait ITestAdapter<I: IbddInAny> {
    async fn before_all(
        &self,
        input_val: I::Iinput,
        tr: &ITTestResourceConfiguration,
        pm: &dyn std::any::Any,
    ) -> I::Iinput;
    
    async fn after_all(
        &self,
        store: I::Istore,
        pm: &dyn std::any::Any,
    ) -> I::Istore;
    
    async fn before_each(
        &self,
        subject: I::Isubject,
        initializer: I::Given,
        test_resource: &ITTestResourceConfiguration,
        initial_values: &dyn std::any::Any,
        pm: &dyn std::any::Any,
    ) -> I::Isubject;
    
    async fn after_each(
        &self,
        store: I::Istore,
        key: &str,
        pm: &dyn std::any::Any,
    ) -> I::Istore;
    
    async fn and_when(
        &self,
        store: I::Istore,
        when_cb: I::Given,
        test_resource: &ITTestResourceConfiguration,
        pm: &dyn std::any::Any,
    ) -> I::Istore;
    
    async fn but_then(
        &self,
        store: I::Istore,
        then_cb: I::Then,
        test_resource: &ITTestResourceConfiguration,
        pm: &dyn std::any::Any,
    ) -> I::Istore;
    
    fn assert_this(&self, t: I::Then) -> bool;
}

// Test specification function type
pub type ITestSpecification<I, O> = dyn Fn(
    HashMap<String, Box<dyn Fn(String, HashMap<String, Box<dyn std::any::Any>>) -> Box<dyn std::any::Any>>>,
    HashMap<String, Box<dyn Fn(Vec<String>, Vec<Box<dyn std::any::Any>>, Vec<Box<dyn std::any::Any>>, Box<dyn std::any::Any>) -> Box<dyn std::any::Any>>>,
    HashMap<String, Box<dyn Fn(Box<dyn std::any::Any>) -> Box<dyn std::any::Any>>>,
    HashMap<String, Box<dyn Fn(Box<dyn std::any::Any>) -> Box<dyn std::any::Any>>>,
) -> Vec<Box<dyn std::any::Any>>;

// Test implementation structure
pub struct ITestImplementation<I: IbddInAny, O: IbddOutAny, M> {
    pub suites: HashMap<String, M>,
    pub givens: HashMap<String, Box<dyn Fn(Box<dyn std::any::Any>) -> I::Given>>,
    pub whens: HashMap<String, Box<dyn Fn(Box<dyn std::any::Any>) -> Box<dyn Fn(I::Iselection) -> I::Then>>>,
    pub thens: HashMap<String, Box<dyn Fn(Box<dyn std::any::Any>) -> Box<dyn Fn(I::Iselection) -> I::Then>>>,
}

// Test resource request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ITTestResourceRequest {
    pub ports: u16,
}

// Final results
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IFinalResults {
    pub failed: bool,
    pub fails: i32,
    pub artifacts: Vec<Box<dyn std::any::Any>>,
    pub features: Vec<String>,
}

// Default implementations
impl Default for ITTestResourceRequest {
    fn default() -> Self {
        Self { ports: 0 }
    }
}
