from typing import Any
import os
import sys

# Add the current directory to sys.path to find Calculator
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Import Calculator using absolute import
from Calculator import Calculator

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
    
    def and_when(self, store, when_cb, test_resource, pm=None):
        print("[ADAPTER] andWhen called")
        # Handle case where store might not be a Calculator yet
        if hasattr(store, 'get_display'):
            print(f"[ADAPTER] store display: {store.get_display()}")
        else:
            print(f"[ADAPTER] store is not a Calculator: {type(store)}")
            # If store is not a Calculator, try to create one
            # This might happen if before_each wasn't called properly
            if isinstance(store, dict):
                # Try to get a Calculator from the store
                # This is a fallback
                pass
        
        # The when_cb is a function that takes the store and returns the modified store
        try:
            print("[ADAPTER] Calling when_cb which should be a function")
            # Apply the transformation to the store
            result = when_cb(store)
            if hasattr(result, 'get_display'):
                print(f"[ADAPTER] Result display: {result.get_display()}")
            
            # Verify the result is a Calculator instance
            if not isinstance(result, Calculator):
                print(f"[ADAPTER] Warning: result is not a Calculator: {type(result)}")
                # Try to handle this gracefully
                # If result is the same as store, and store is not a Calculator, we have a problem
                if result is store and not isinstance(store, Calculator):
                    # Create a new Calculator instance
                    result = Calculator()
                    print(f"[ADAPTER] Created new Calculator: {result}")
            return result
        except Exception as e:
            print(f"[ADAPTER] Error in andWhen: {e}")
            raise e
    
    def but_then(self, store, then_cb, test_resource, pm=None):
        print("[ADAPTER] butThen called")
        # Handle case where store might not be a Calculator
        if hasattr(store, 'get_display'):
            print(f"[ADAPTER] store: {store}, display: {store.get_display()}")
        else:
            print(f"[ADAPTER] store is not a Calculator: {type(store)}")
            # If store is not a Calculator, we can't get the display
            # This is an error, but let's try to handle it
            raise TypeError(f"Store should be a Calculator instance, got {type(store)}")
        
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
