from typing import Any, List, Dict, Callable
import json
from .types import ITestSpecification, ITestImplementation, ITestAdapter, ITTestResourceRequest
from .simple_adapter import SimpleTestAdapter
from .base_suite import BaseSuite
from .base_given import BaseGiven
from .base_when import BaseWhen
from .base_then import BaseThen
from .PM.python import PM_Python

# Export these for easier imports
__all__ = [
    'Pitono', 'ITestSpecification', 'ITestImplementation', 
    'ITestAdapter', 'ITTestResourceRequest',
    'main', 'set_default_instance'
]

import sys
import asyncio

def Pitono(
    input_val: Any = None,
    test_specification: ITestSpecification = None,
    test_implementation: ITestImplementation = None,
    test_adapter: ITestAdapter = None,
    test_resource_requirement: ITTestResourceRequest = None,
    uber_catcher: Callable[[Callable], None] = None,
    **kwargs
):
    # Handle both positional and keyword arguments
    # The first argument can be either input_val or test_subject
    # For compatibility with the TypeScript pattern, we'll treat the first argument as the test subject
    test_subject = input_val
    
    # Create a Pitono instance and return it
    # This matches the TypeScript usage pattern where Testeranto is called directly
    # The first argument is the test subject (like Rectangle.prototype in TypeScript)
    instance = PitonoClass(
        test_subject,
        test_specification,
        test_implementation,
        test_resource_requirement or {},
        test_adapter,
        uber_catcher or (lambda x: None)  # uber_catcher placeholder
    )
    return instance

# Store the default instance to be used when the module is run directly
# This can be set by the user when they import and configure Pitono
_default_instance = None

def set_default_instance(instance):
    global _default_instance
    _default_instance = instance

async def main():
    print("DEBUG: main function called")
    print(f"DEBUG: sys.argv: {sys.argv}")
    try:
        if len(sys.argv) < 3:
            print("Usage: python <test_file.py> <partialTestResource> <ipcfile>")
            sys.exit(-1)
            
        partialTestResource = sys.argv[1]
        ipcfile = sys.argv[2]
        print(f"DEBUG: Args - partialTestResource: {partialTestResource}, ipcfile: {ipcfile}")
        
        if _default_instance is None:
            print("ERROR: No default Pitono instance has been configured")
            print("Make sure to call set_default_instance() in your test file")
            sys.exit(-1)
            
        # Call receiveTestResourceConfig on the default instance
        print("DEBUG: Calling receiveTestResourceConfig")
        result = await _default_instance.receiveTestResourceConfig(partialTestResource, ipcfile)
        print(f"DEBUG: Test execution completed with {result.fails} failures")
        sys.exit(result.fails)
    except Exception as e:
        print(f"Error in main: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(-1)

# Run the main function if this module is executed directly
if __name__ == "__main__":
    print("DEBUG: pitono __main__ block executed")
    print("This suggests python -m pitono was run directly")
    print("You should run your test file directly instead")
    sys.exit(1)

class PitonoClass:
    def __init__(
        self,
        input_val: Any,
        test_specification: ITestSpecification,
        test_implementation: ITestImplementation,
        test_resource_requirement: ITTestResourceRequest,
        test_adapter: ITestAdapter,
        uber_catcher: Callable[[Callable], None]
    ):
        self.test_resource_requirement = test_resource_requirement
        self.artifacts: List[Any] = []
        self.test_jobs: List[Any] = []
        self.test_specification = test_specification
        self.suites_overrides: Dict[str, Any] = {}
        self.given_overrides: Dict[str, Any] = {}
        self.when_overrides: Dict[str, Any] = {}
        self.then_overrides: Dict[str, Any] = {}
        self.puppet_master: Any = None
        self.specs: Any = None
        self.assert_this_func = getattr(test_adapter, 'assert_this', None)
        self.test_implementation = test_implementation
        self.test_subject = input_val  # This is the test subject (like Rectangle.prototype)
        self.test_adapter = test_adapter
        
        # Generate specs by calling the test specification function
        # The specification function takes suites, givens, whens, thens, and checks
        # We need to pass the implementation's methods
        # Make sure we're passing exactly what the specification expects
        # The checks parameter might need to be handled differently
        try:
            self.specs = test_specification(
                self.test_implementation.suites,
                self.test_implementation.givens,
                self.test_implementation.whens,
                self.test_implementation.thens,
                {}  # checks - pass an empty dict for now
            )
        except TypeError as e:
            # If the function doesn't accept 5 arguments, try with 4
            if "positional arguments" in str(e) and "5" in str(e):
                self.specs = test_specification(
                    self.test_implementation.suites,
                    self.test_implementation.givens,
                    self.test_implementation.whens,
                    self.test_implementation.thens
                )
            else:
                raise e
        
        # Create test jobs - each test job would handle running a specific test case
        # For now, we'll create a simple test job structure
        self.test_jobs = [self]
    
    def suites(self) -> Dict[str, Any]:
        return self.suites_overrides
    
    def given(self) -> Dict[str, Any]:
        return self.given_overrides
    
    def when(self) -> Dict[str, Any]:
        return self.when_overrides
    
    def then(self) -> Dict[str, Any]:
        return self.then_overrides
    
    def get_test_jobs(self) -> List[Any]:
        return self.test_jobs
    
    def get_specs(self) -> Any:
        return self.specs
    
    def assert_this(self, t: Any) -> Any:
        return self.assert_this_func(t)
    
    async def receiveTestResourceConfig(self, partialTestResource: str, ipcfile: str) -> Any:
        print(f"DEBUG: receiveTestResourceConfig called with ipcfile: {ipcfile}")
        print(f"DEBUG: partialTestResource: {partialTestResource}")
        
        # Parse the partial test resource configuration
        test_resource_config = json.loads(partialTestResource)
        print(f"DEBUG: Parsed test resource config: {test_resource_config}")
        
        # Create a PM_Python instance using the provided ipcfile
        pm = PM_Python(test_resource_config, ipcfile)
        print("DEBUG: PM_Python instance created")
        
        # Track test results
        total_fails = 0
        test_results = []
        
        # Run the test implementation
        try:
            print("DEBUG: Starting test implementation")
            # The implementation should use the pm to run tests
            # The test subject is passed as the first argument
            # The implementation might expect different parameters, so we need to be flexible
            if hasattr(self.test_implementation, '__call__'):
                print("DEBUG: test_implementation is callable, calling it")
                # If it's a callable, call it directly
                result = await self.test_implementation(
                    self.test_subject, 
                    self.specs, 
                    pm, 
                    self.test_adapter
                )
                # If the implementation returns a result, use it to track failures
                if hasattr(result, 'fails'):
                    total_fails = result.fails
                    print(f"DEBUG: Implementation returned fails: {total_fails}")
            else:
                print("DEBUG: test_implementation is not callable, skipping")
                # Otherwise, we need to process the test specification and implementation
                # This is a simplified version - in reality, this would be more complex
                # For now, we'll just run through each test case
                pass
            
            # Write tests.json using the PM with actual test results
            # This structure should match the example from the provided URL
            tests_data = {
                "name": "Test Suite",
                "givens": [
                    {
                        "key": "test_given",
                        "name": ["Test given scenario"],
                        "whens": [
                            {
                                "name": "test_when: ",
                                "error": None if total_fails == 0 else "Test failed",
                                "artifacts": []
                            }
                        ],
                        "thens": [],
                        "error": None if total_fails == 0 else "Test failed",
                        "features": [],
                        "artifacts": []
                    }
                ],
                "fails": total_fails,
                "features": []
            }
            
            # Add more detailed results if available
            if total_fails > 0:
                tests_data["givens"][0]["failed"] = True
                tests_data["failed"] = True
            
            # Ensure the tests.json is always written
            print("DEBUG: About to write tests.json")
            pm.write_file_sync("tests.json", json.dumps(tests_data, indent=2))
            print(f"DEBUG: tests.json written to {test_resource_config['fs']}/tests.json")
            
            # Return an object with a 'fails' property
            class Result:
                def __init__(self, fails):
                    self.fails = fails
            return Result(total_fails)
        except Exception as e:
            print(f"DEBUG: Error running tests: {e}")
            import traceback
            traceback.print_exc()
            
            # Try to write an error to tests.json even if the test failed
            try:
                print("DEBUG: Attempting to write error tests.json")
                tests_data = {
                    "name": "Test Suite",
                    "givens": [],
                    "fails": 1,
                    "features": [],
                    "error": str(e)
                }
                pm.write_file_sync("tests.json", json.dumps(tests_data, indent=2))
                print(f"DEBUG: Error tests.json written to {test_resource_config['fs']}/tests.json")
            except Exception as write_error:
                print(f"DEBUG: Failed to write tests.json: {write_error}")
                import traceback
                traceback.print_exc()
                pass
            
            class Result:
                def __init__(self, fails):
                    self.fails = fails
            return Result(1)
