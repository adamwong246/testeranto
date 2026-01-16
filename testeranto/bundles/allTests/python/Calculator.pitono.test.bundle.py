#!/usr/bin/env python3
"""
Python test bundle for: example/Calculator.pitono.test.py
Hash: 653d78d79bb435ab2159a5d42498be18
This bundle directly executes the original test file.
"""
import sys
import os
import runpy

# Cache invalidation hash
BUNDLE_HASH = "653d78d79bb435ab2159a5d42498be18"

def main():
    # Get the absolute path to the original test file
    original_test = r"/workspace/example/Calculator.pitono.test.py"
    
    if not os.path.exists(original_test):
        print(f"ERROR: Original test file not found: {original_test}")
        return 1
    
    try:
        # Change to the directory containing the original test file
        # This ensures relative imports work correctly
        original_dir = os.path.dirname(original_test)
        os.chdir(original_dir)
        
        # Add the directory to sys.path if not already there
        if original_dir not in sys.path:
            sys.path.insert(0, original_dir)
        
        # Use runpy to run the module, which properly handles __name__ == "__main__"
        # We need to use the module name relative to the workspace
        # First, let's try to find the module path relative to sys.path
        for path in sys.path:
            if path and original_test.startswith(path):
                # Calculate relative module path
                rel_path = os.path.relpath(original_test, path)
                if rel_path.endswith('.py'):
                    rel_path = rel_path[:-3]
                # Convert path separators to dots
                module_name = rel_path.replace(os.sep, '.')
                try:
                    # Run the module as __main__
                    runpy.run_module(module_name, run_name='__main__', alter_sys=True)
                    return 0
                except ImportError:
                    # If module import fails, fall back to run_path
                    pass
        
        # Fallback: use run_path which executes the file directly
        # This preserves __name__ == "__main__" behavior
        runpy.run_path(original_test, run_name='__main__')
        return 0
        
    except SystemExit as e:
        # Propagate the exit code
        return e.code if isinstance(e.code, int) else 0
    except Exception as e:
        print(f"ERROR executing test {original_test}:")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())
