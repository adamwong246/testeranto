"""
Calculator test file for pitono.
This file contains tests for the Calculator class.
"""
import sys
import os
import asyncio
import importlib.util

print("This is a simple console message.")

# Add the current directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Add the parent directory to find src/lib/pitono
project_root = os.path.abspath(os.path.join(current_dir, '..'))
sys.path.insert(0, project_root)

# Import Calculator from the current directory
from Calculator import Calculator

# Load the required modules from the same directory using absolute paths
spec_path = os.path.join(current_dir, 'Calculator.pitono.specification.py')
spec_spec = importlib.util.spec_from_file_location("specification", spec_path)
spec_module = importlib.util.module_from_spec(spec_spec)
spec_spec.loader.exec_module(spec_module)
specification = spec_module.specification

impl_path = os.path.join(current_dir, 'Calculator.pitono.implementation.py')
impl_spec = importlib.util.spec_from_file_location("implementation", impl_path)
impl_module = importlib.util.module_from_spec(impl_spec)
impl_spec.loader.exec_module(impl_module)
implementation = impl_module.implementation

adapter_path = os.path.join(current_dir, 'Calculator.pitono.adapter.py')
adapter_spec = importlib.util.spec_from_file_location("SimpleTestAdapter", adapter_path)
adapter_module = importlib.util.module_from_spec(adapter_spec)
adapter_spec.loader.exec_module(adapter_module)
SimpleTestAdapter = adapter_module.SimpleTestAdapter

# Try to import pitono from src/lib/pitono
try:
    # Add src/lib to the path
    src_lib_path = os.path.join(project_root, 'src/lib')
    sys.path.insert(0, src_lib_path)
    
    from pitono.Pitono import Pitono, set_default_instance, main
except ImportError as e:
    print(f"Error importing pitono: {e}")
    print("Trying alternative import path...")
    # Try to import directly
    try:
        # Add the pitono directory directly
        pitono_dir = os.path.join(project_root, 'src/lib/pitono')
        sys.path.insert(0, pitono_dir)
        from Pitono import Pitono, set_default_instance, main
    except ImportError as e2:
        print(f"Failed to import pitono: {e2}")
        sys.exit(1)

# Create a mock input value (not used in our case)
mock_input = None

# Create the test instance
try:
    test_instance = Pitono(
        mock_input,
        specification,
        implementation,
        SimpleTestAdapter(),
        {"ports": 1}
    )
    # Set it as the default instance
    set_default_instance(test_instance)
    print("Test instance created successfully")
except Exception as e:
    print(f"Error creating test instance: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Run the main function if this file is executed directly
if __name__ == "__main__":
    print("Starting Calculator tests...")
    
    if len(sys.argv) >= 3:
        asyncio.run(main())
    else:
        # Run in standalone mode for debugging
        print("Running in standalone mode...")

        # Create a simple test resource configuration
        test_resource_config = {
            "name": "local-test",
            "fs": "testeranto/bundles/allTests/python/Calculator.pitono.test.bundle.py",
            "ports": [8080],
            "browser_ws_endpoint": None,
            "timeout": 30000,
            "retries": 0,
            "environment": {}
        }
        
        import json
        config_json = json.dumps(test_resource_config)
        # Keep the original sys.argv[0] as the script name
        sys.argv = [sys.argv[0], config_json, 'ipcfile']
        print(f"Running with sys.argv: {sys.argv}")
        
        try:
            asyncio.run(main())
        except Exception as e:
            print(f"Error running tests: {e}")
            import traceback
            traceback.print_exc()
            sys.exit(1)
