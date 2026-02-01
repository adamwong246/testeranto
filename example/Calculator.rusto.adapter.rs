use std::collections::HashMap;

pub struct SimpleTestAdapter;

impl SimpleTestAdapter {
    pub fn new() -> Self {
        SimpleTestAdapter
    }
}

impl rusto::ITestAdapter for SimpleTestAdapter {
    type Input = String;
    type Subject = crate::Calculator;
    type Store = crate::Calculator;
    type Selection = String;
    
    fn before_all(&self, input: Self::Input, _test_resource: &rusto::ITTestResourceConfiguration, _pm: &()) -> Self::Subject {
        crate::Calculator::new()
    }
    
    fn after_all(&self, store: Self::Store, _pm: &()) -> Self::Store {
        store
    }
    
    fn before_each(&self, _subject: Self::Subject, initializer: Box<dyn Fn() -> Self::Store>, 
                   _test_resource: &rusto::ITTestResourceConfiguration, _initial_values: &(), _pm: &()) -> Self::Store {
        initializer()
    }
    
    fn after_each(&self, store: Self::Store, _key: &str, _pm: &()) -> Self::Store {
        store
    }
    
    fn and_when(&self, store: Self::Store, when_cb: Box<dyn Fn(Self::Store) -> Self::Store>, 
                _test_resource: &rusto::ITTestResourceConfiguration, _pm: &()) -> Self::Store {
        when_cb(store)
    }
    
    fn but_then(&self, store: Self::Store, then_cb: Box<dyn Fn(&Self::Store)>, 
                _test_resource: &rusto::ITTestResourceConfiguration, _pm: &()) -> Self::Selection {
        then_cb(&store);
        store.get_display()
    }
    
    fn assert_this(&self, t: Self::Selection) -> bool {
        // The assertion is done in the then callback
        true
    }
}
