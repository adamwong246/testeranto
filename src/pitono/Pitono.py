from typing import Any, Callable, Dict, List, Optional
import json
import asyncio
from .types import ITestSpecification, ITestImplementation, ITestAdapter, ITTestResourceRequest
from .simple_adapter import SimpleTestAdapter
from .base_suite import BaseSuite
from .base_given import BaseGiven
from .base_when import BaseWhen
from .base_then import BaseThen
from .PM.python import PM_Python

# Export these for easier imports
__all__ = [
    'Pitono', 'set_default_instance', 'main'
]

import sys

def Pitono(
    input_val: Any = None,
    test_specification: ITestSpecification = None,
    test_implementation: ITestImplementation = None,
    test_adapter: ITestAdapter = None,
    test_resource_requirement: ITTestResourceRequest = None,
    uber_catcher: Callable[[Callable], None] = None,
    **kwargs
):
    # Create a Pitono instance and return it
    instance = PitonoClass(
        input_val,
        test_specification,
        test_implementation,
        test_resource_requirement or {},
        test_adapter,
        uber_catcher or (lambda x: None)
    )
    return instance

# Store the default instance
_default_instance = None

def set_default_instance(instance):
    global _default_instance
    _default_instance = instance

async def main():
    print("hello world")
    
    # If no arguments are provided, just exit successfully
    if len(sys.argv) < 3:
        print("No test arguments provided - exiting")
        sys.exit(0)
        
    partialTestResource = sys.argv[1]
    ipcfile = sys.argv[2]
    
    if _default_instance is None:
        print("ERROR: No default Pitono instance has been configured")
        sys.exit(-1)
        
    result = await _default_instance.receiveTestResourceConfig(partialTestResource, ipcfile)
    sys.exit(result.fails)

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
        self.test_implementation = test_implementation
        self.test_subject = input_val
        self.test_adapter = test_adapter
        
        # Initialize classy implementations
        self._initialize_classy_implementations(test_implementation)
        
        # Generate specs - the specification function may expect 5 arguments
        # Let's try to call it with the expected number of parameters
        try:
            import inspect
            sig = inspect.signature(test_specification)
            if len(sig.parameters) == 5:
                # Add a Check parameter
                self.specs = test_specification(
                    self.Suites(),
                    self.Given(),
                    self.When(),
                    self.Then(),
                    lambda x: x  # Simple Check function
                )
            else:
                # Assume 4 parameters
                self.specs = test_specification(
                    self.Suites(),
                    self.Given(),
                    self.When(),
                    self.Then()
                )
        except:
            # Fallback to 4 parameters
            self.specs = test_specification(
                self.Suites(),
                self.Given(),
                self.When(),
                self.Then()
            )
        
        # Initialize test jobs
        self.test_jobs = []
        # Create test jobs from the specs
        for i, suite_spec in enumerate(self.specs):
            # Create a BaseSuite instance
            suite = BaseSuite(
                suite_spec['name'],
                suite_spec['givens']
            )
            suite.index = i
            
            # Create a runner function
            async def runner(pm, t_log):
                return await suite.run(
                    self.test_subject,
                    {},  # test_resource_config will be provided later
                    lambda f_path, value: None,  # Simple artifactory
                    t_log,
                    pm
                )
            
            self.test_jobs.append({
                'receiveTestResourceConfig': lambda pm: self._run_test_job(runner, suite, pm),
                'to_obj': suite.to_obj
            })
        
    def Suites(self):
        return self.suites_overrides
    
    def Given(self):
        # Return a function that creates the appropriate Given instance
        def create_given(given_type, features, whens, thens, initial_values=None):
            if given_type in self.given_overrides:
                return self.given_overrides[given_type](features, whens, thens, initial_values)
            else:
                raise ValueError(f"Given type '{given_type}' not found")
        
        # Create a wrapper that provides access to all given types
        # Support both attribute access and indexing
        class GivenWrapper:
            def __getattr__(self, name):
                def given_func(features, whens, thens, initial_values=None):
                    return create_given(name, features, whens, thens, initial_values)
                return given_func
            
            def __getitem__(self, name):
                def given_func(features, whens, thens, initial_values=None):
                    return create_given(name, features, whens, thens, initial_values)
                return given_func
        
        return GivenWrapper()
    
    def When(self):
        # Similar approach for When
        def create_when(when_type, *args):
            if when_type in self.when_overrides:
                return self.when_overrides[when_type](*args)
            else:
                raise ValueError(f"When type '{when_type}' not found")
        
        class WhenWrapper:
            def __getattr__(self, name):
                def when_func(*args):
                    return create_when(name, *args)
                return when_func
            
            def __getitem__(self, name):
                def when_func(*args):
                    return create_when(name, *args)
                return when_func
        
        return WhenWrapper()
    
    def Then(self):
        # Similar approach for Then
        def create_then(then_type, *args):
            if then_type in self.then_overrides:
                return self.then_overrides[then_type](*args)
            else:
                raise ValueError(f"Then type '{then_type}' not found")
        
        class ThenWrapper:
            def __getattr__(self, name):
                def then_func(*args):
                    return create_then(name, *args)
                return then_func
            
            def __getitem__(self, name):
                def then_func(*args):
                    return create_then(name, *args)
                return then_func
        
        return ThenWrapper()
    
    def _initialize_classy_implementations(self, test_implementation):
        # Create classy implementations similar to TypeScript
        classyGivens = {}
        for key in test_implementation.givens.keys():
            def create_given_closure(given_key):
                def given_func(features, whens, thens, initial_values=None):
                    return BaseGiven(
                        given_key,
                        features,
                        whens,
                        thens,
                        test_implementation.givens[given_key],
                        initial_values
                    )
                return given_func
            classyGivens[key] = create_given_closure(key)
        
        classyWhens = {}
        for key in test_implementation.whens.keys():
            def create_when_closure(when_key):
                def when_func(*args):
                    # Create a BaseWhen instance
                    # name = f"{when_key}: {args}"
                    when_cb = test_implementation.whens[when_key](*args)
                    return BaseWhen(when_key, when_cb)
                return when_func
            classyWhens[key] = create_when_closure(key)
        
        classyThens = {}
        for key in test_implementation.thens.keys():
            def create_then_closure(then_key):
                def then_func(*args):
                    # Create a BaseThen instance
                    # name = f"{then_key}: {args}"
                    then_cb = test_implementation.thens[then_key](*args)
                    return BaseThen(then_key, then_cb)
                return then_func
            classyThens[key] = create_then_closure(key)
        
        self.given_overrides = classyGivens
        self.when_overrides = classyWhens
        self.then_overrides = classyThens
    
    def _initialize_classy_implementations(self, test_implementation):
        # Create classy implementations similar to TypeScript
        classyGivens = {}
        for key in test_implementation.givens.keys():
            def create_given_closure(given_key):
                def given_func(features, whens, thens, initial_values=None):
                    return BaseGiven(
                        given_key,
                        features,
                        whens,
                        thens,
                        test_implementation.givens[given_key],
                        initial_values
                    )
                return given_func
            classyGivens[key] = create_given_closure(key)
        
        classyWhens = {}
        for key in test_implementation.whens.keys():
            def create_when_closure(when_key):
                def when_func(*args):
                    # Create a BaseWhen instance
                    when_cb = test_implementation.whens[when_key](*args)
                    return BaseWhen(when_key, when_cb)
                return when_func
            classyWhens[key] = create_when_closure(key)
        
        classyThens = {}
        for key in test_implementation.thens.keys():
            def create_then_closure(then_key):
                def then_func(*args):
                    # Create a BaseThen instance
                    then_cb = test_implementation.thens[then_key](*args)
                    return BaseThen(then_key, then_cb)
                return then_func
            classyThens[key] = create_then_closure(key)
        
        self.given_overrides = classyGivens
        self.when_overrides = classyWhens
        self.then_overrides = classyThens

    async def _run_test_job(self, runner, suite, puppet_master):
        try:
            # Create a simple t_log function
            def t_log(*args):
                print(" ".join(map(str, args)))
            
            # Run the suite
            suite_done = await runner(puppet_master, t_log)
            fails = suite_done.fails
            
            # Get features and artifacts
            features = []
            if hasattr(suite_done, 'features') and callable(suite_done.features):
                features = suite_done.features()
            elif hasattr(suite_done, 'features'):
                features = suite_done.features
            
            artifacts = []
            if hasattr(suite_done, 'artifacts'):
                artifacts = suite_done.artifacts
            
            # Create a simple result object
            class Result:
                def __init__(self, fails, artifacts, features):
                    self.fails = fails
                    self.artifacts = artifacts
                    self.features = features
            
            return Result(
                fails,
                artifacts,
                features
            )
        except Exception as e:
            print(f"Error in test job: {e}")
            import traceback
            traceback.print_exc()
            
            class Result:
                def __init__(self, fails, artifacts, features):
                    self.fails = fails
                    self.artifacts = artifacts
                    self.features = features
            
            return Result(1, [], [])
    
    async def receiveTestResourceConfig(self, partialTestResource: str, websocket_port: str) -> Any:
        # Don't print to reduce noise in test output

        # Parse the test resource configuration
        import os
        import re
        
        def fix_json_string(s):
            # Try to fix common JSON issues
            # Replace single quotes with double quotes, but be careful with escaped quotes
            # First, handle property names without quotes
            # This regex adds quotes around property names (very basic)
            # Note: This is a simple fix and may not handle all cases
            pattern = r'(\s*)(\w+)(\s*):'
            fixed = re.sub(pattern, r'\1"\2"\3:', s)
            # Replace single quotes with double quotes, but not escaped ones
            # This is tricky, so we'll do a simple approach
            # First, replace \' with a temporary marker
            fixed = fixed.replace("\\'", "___TEMP_ESCAPED_SINGLE_QUOTE___")
            # Replace remaining single quotes with double quotes
            fixed = fixed.replace("'", '"')
            # Restore escaped single quotes
            fixed = fixed.replace("___TEMP_ESCAPED_SINGLE_QUOTE___", "\\'")
            return fixed
        
        # First, check if it's a file path
        if os.path.exists(partialTestResource):
            try:
                with open(partialTestResource, 'r') as f:
                    test_resource_config = json.load(f)
            except json.JSONDecodeError as e:
                print(f"Error parsing JSON from file {partialTestResource}: {e}")
                # Try to read and fix the file content
                with open(partialTestResource, 'r') as f:
                    content = f.read()
                try:
                    fixed_content = fix_json_string(content)
                    test_resource_config = json.loads(fixed_content)
                except json.JSONDecodeError as e2:
                    print(f"Error even after fixing JSON: {e2}")
                    print(f"Content was: {content}")
                    raise
        else:
            # Try to parse as JSON string
            try:
                test_resource_config = json.loads(partialTestResource)
            except json.JSONDecodeError as e:
                print(f"Error parsing JSON string: {e}")
                print(f"String was: {partialTestResource}")
                # Try to fix common issues
                try:
                    fixed = fix_json_string(partialTestResource)
                    test_resource_config = json.loads(fixed)
                except json.JSONDecodeError as e2:
                    print(f"Error even after fixing JSON: {e2}")
                    # As a last resort, try to parse as Python literal (not safe for production)
                    # But for testing, we can use ast.literal_eval
                    import ast
                    try:
                        # ast.literal_eval can handle Python literals including dicts with single quotes
                        parsed = ast.literal_eval(partialTestResource)
                        # Convert to JSON-serializable dict
                        if isinstance(parsed, dict):
                            test_resource_config = parsed
                        else:
                            raise
                    except:
                        print(f"Could not parse as Python literal either")
                        raise
        
        # Create a PM_Python instance
        pm = PM_Python(test_resource_config, websocket_port)
        # Connect to WebSocket - suppress any connection errors
        try:
            await pm.connect()
        except Exception as e:
            # Don't print the error to avoid cluttering test output
            # The PM_Python class already handles disconnected state gracefully
            pass
        
        # Run all test jobs
        total_fails = 0
        all_features = set()
        all_artifacts = []
        
        # Collect all suite results
        suite_results = []
        
        # First, we need to create test jobs from the specs
        # The specs should contain the test suites to run
        if not hasattr(self, 'test_jobs') or not self.test_jobs:
            # Create test jobs from the specs
            self.test_jobs = []
            for i, suite_spec in enumerate(self.specs):
                # Create a BaseSuite instance
                suite = BaseSuite(
                    suite_spec['name'],
                    suite_spec['givens']
                )
                suite.index = i
                
                # Create a runner function
                async def runner(pm, t_log):
                    return await suite.run(
                        self.test_subject,
                        test_resource_config,
                        lambda f_path, value: None,  # Simple artifactory
                        t_log,
                        pm
                    )
                
                self.test_jobs.append({
                    'receiveTestResourceConfig': lambda pm: self._run_test_job(runner, suite, pm),
                    'to_obj': suite.to_obj
                })
        
        for job in self.test_jobs:
            try:
                result = await job['receiveTestResourceConfig'](pm)
                total_fails += result.fails
                # Add features to the set
                if hasattr(result, 'features'):
                    for feature in result.features:
                        all_features.add(feature)
                if hasattr(result, 'artifacts'):
                    all_artifacts.extend(result.artifacts)
                # Get the suite object
                suite_obj = job['to_obj']()
                suite_results.append(suite_obj)
            except Exception as e:
                print(f"Error running test job: {e}")
                import traceback
                traceback.print_exc()
                total_fails += 1
        
        # Write the final tests.json
        try:
            # Flatten all givens from all suites
            all_givens = []
            for suite in suite_results:
                if 'givens' in suite:
                    all_givens.extend(suite['givens'])
            
            # Prepare tests data matching the TypeScript structure
            # Based on the example tests.json file
            tests_data = {
                "name": self.specs[0]['name'] if self.specs and len(self.specs) > 0 and 'name' in self.specs[0] else "Unnamed Test",
                "givens": all_givens,
                "fails": total_fails,
                "failed": total_fails > 0,
                "features": list(all_features),
                "artifacts": all_artifacts
            }
            
            # Write to file
            tests_json_path = f"{test_resource_config['fs']}/tests.json"
            # Ensure the directory exists
            import os
            os.makedirs(os.path.dirname(tests_json_path), exist_ok=True)
            with open(tests_json_path, 'w') as f:
                json.dump(tests_data, f, indent=2)
            print(f"tests.json written to: {tests_json_path}")
                
        except Exception as e:
            print(f"Error writing tests.json: {e}")
            import traceback
            traceback.print_exc()
        
        # Return result
        class Result:
            def __init__(self, fails):
                self.fails = fails
                self.features = list(all_features)
                self.artifacts = all_artifacts
        return Result(total_fails)
