from typing import Any
# Use relative import
from ..Calculator import Calculator

class SimpleTestAdapter:
    def before_all(self, input_val, tr, pm):
        return input_val
    
    def after_all(self, store, pm):
        return store
    
    def before_each(self, subject, initializer, test_resource, initial_values, pm):
        print("[ADAPTER] beforeEach called")
        # The initializer should be a function that returns a Calculator instance
        result = initializer()
        print(f"[ADAPTER] beforeEach result: {result}")
        if hasattr(result, 'get_display'):
            print(f"[ADAPTER] display: {result.get_display()}")
        # Make sure we always have a valid Calculator instance
        return result
    
    def after_each(self, store, key, pm):
        return store
    
    def and_when(self, store, when_cb, test_resource, pm):
        print("[ADAPTER] andWhen called")
        if hasattr(store, 'get_display'):
            print(f"[ADAPTER] store display: {store.get_display()}")
        
        # The when_cb is a function that takes the store and returns the modified store
        try:
            print("[ADAPTER] Calling when_cb which should be a function")
            # Apply the transformation to the store
            result = when_cb(store)
            if hasattr(result, 'get_display'):
                print(f"[ADAPTER] Result display: {result.get_display()}")
            
            # Verify the result is a Calculator instance
            if not isinstance(result, Calculator):
                raise TypeError(f"Expected Calculator instance, got {type(result)}")
            return result
        except Exception as e:
            print(f"[ADAPTER] Error in andWhen: {e}")
            raise e
    
    def but_then(self, store, then_cb, test_resource, pm):
        print("[ADAPTER] butThen called")
        if hasattr(store, 'get_display'):
            print(f"[ADAPTER] store: {store}, display: {store.get_display()}")
        
        # then_cb is the function that takes the store and makes assertions
        try:
            # Run the then callback which may throw if assertion fails
            then_cb(store)
            # Return the selection (the display value)
            if hasattr(store, 'get_display'):
                display = store.get_display()
                print(f"[ADAPTER] butThen returning selection: {display}")
                return display
            return None
        except Exception as e:
            print(f"[ADAPTER] Error in butThen: {e}")
            raise e
    
    def assert_this(self, t):
        # The actual value comes from butThen which returns the display
        # We don't need to do anything here as assertions are done in thenCB
        return t
