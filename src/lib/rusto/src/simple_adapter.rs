use crate::types::{IbddInAny, ITTestResourceConfiguration, ITestAdapter};
use async_trait::async_trait;

pub struct SimpleTestAdapter;

impl SimpleTestAdapter {
    pub fn new() -> Self {
        Self
    }
}

#[async_trait]
impl<I: IbddInAny + Send + Sync> ITestAdapter<I> for SimpleTestAdapter {
    async fn before_all(
        &self,
        input_val: I::Iinput,
        _tr: &ITTestResourceConfiguration,
        _pm: &dyn std::any::Any,
    ) -> I::Iinput {
        input_val
    }
    
    async fn after_all(
        &self,
        store: I::Istore,
        _pm: &dyn std::any::Any,
    ) -> I::Istore {
        store
    }
    
    async fn before_each(
        &self,
        subject: I::Isubject,
        _initializer: I::Given,
        _test_resource: &ITTestResourceConfiguration,
        _initial_values: &dyn std::any::Any,
        _pm: &dyn std::any::Any,
    ) -> I::Isubject {
        subject
    }
    
    async fn after_each(
        &self,
        store: I::Istore,
        _key: &str,
        _pm: &dyn std::any::Any,
    ) -> I::Istore {
        store
    }
    
    async fn and_when(
        &self,
        store: I::Istore,
        _when_cb: I::Given,
        _test_resource: &ITTestResourceConfiguration,
        _pm: &dyn std::any::Any,
    ) -> I::Istore {
        store
    }
    
    async fn but_then(
        &self,
        store: I::Istore,
        _then_cb: I::Then,
        _test_resource: &ITTestResourceConfiguration,
        _pm: &dyn std::any::Any,
    ) -> I::Istore {
        store
    }
    
    fn assert_this(&self, _t: I::Then) -> bool {
        true
    }
}
