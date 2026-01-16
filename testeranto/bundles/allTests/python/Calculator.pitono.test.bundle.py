#!/usr/bin/env python3
"""
Python test bundle for: example/Calculator.pitono.test.py
Hash: 2e56dab370fe3ddf8a7941480410cf0e
This bundle executes the original test file.
"""
import sys
import os
import traceback

# Cache invalidation hash
BUNDLE_HASH = "2e56dab370fe3ddf8a7941480410cf0e"

def main():
    # Get the absolute path to the original test file
    original_test = r"example/Calculator.pitono.test.py"
    
    if not os.path.exists(original_test):
        print(f"ERROR: Original test file not found: {original_test}")
        return 1
    
    try:
        # Add the directory containing the original test to sys.path
        original_dir = os.path.dirname(os.path.abspath(original_test))
        if original_dir not in sys.path:
            sys.path.insert(0, original_dir)
        
        # Also add the workspace root (where example/ is located)
        workspace_root = os.environ.get('WORKSPACE_ROOT', '/workspace')
        if workspace_root not in sys.path:
            sys.path.insert(0, workspace_root)
        
        # Read and execute the original test file
        with open(original_test, 'r', encoding='utf-8') as f:
            code = f.read()
        
        # Execute in a dedicated namespace
        namespace = {}
        # Set __file__ to the original test file path so imports work correctly
        namespace['__file__'] = original_test
        # Also set __name__ to '__main__' if not defined
        if '__name__' not in namespace:
            namespace['__name__'] = '__main__'
        
        exec(code, namespace, namespace)
        
        # If the test has a main function, call it
        if 'main' in namespace and callable(namespace['main']):
            return namespace['main']()
        # If the test has a test_main function, call it
        elif 'test_main' in namespace and callable(namespace['test_main']):
            return namespace['test_main']()
        # Otherwise, assume success
        else:
            print(f"INFO: Test file executed successfully: {original_test}")
            return 0
            
    except SystemExit as e:
        # Propagate the exit code
        return e.code
    except Exception as e:
        print(f"ERROR executing test {original_test}:")
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())
