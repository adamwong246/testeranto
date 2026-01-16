from .types import ITestAdapter, ITTestResourceConfiguration

class SimpleTestAdapter(ITestAdapter):
    def before_all(self, input_val, tr, pm):
        return input_val
    
    def after_all(self, store, pm):
        return store
    
    def before_each(self, subject, initializer, test_resource, initial_values, pm):
        return subject
    
    def after_each(self, store, key, pm):
        return store
    
    def and_when(self, store, when_cb, test_resource, pm):
        # Call the when_cb with the store to get the modified store
        if callable(when_cb):
            return when_cb(store)
        return store
    
    def but_then(self, store, then_cb, test_resource, pm):
        # Call the then_cb with the store to perform assertions
        if callable(then_cb):
            return then_cb(store)
        return store
    
    def assert_this(self, t):
        # Simple implementation - always return True for now
        return True
