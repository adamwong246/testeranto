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
    if len(sys.argv) < 3:
        print("Usage: python <test_file.py> <partialTestResource> <ipcfile>")
        sys.exit(-1)
        
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
        
        # Generate specs
        self.specs = test_specification(
            self.Suites(),
            self.Given(),
            self.When(),
            self.Then()
        )
        
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
        class GivenWrapper:
            def __getattr__(self, name):
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
                    name = f"{when_key}: {args}"
                    when_cb = test_implementation.whens[when_key](*args)
                    return BaseWhen(name, when_cb)
                return when_func
            classyWhens[key] = create_when_closure(key)
        
        classyThens = {}
        for key in test_implementation.thens.keys():
            def create_then_closure(then_key):
                def then_func(*args):
                    # Create a BaseThen instance
                    name = f"{then_key}: {args}"
                    then_cb = test_implementation.thens[then_key](*args)
                    return BaseThen(name, then_cb)
                return then_func
            classyThens[key] = create_then_closure(key)
        
        self.given_overrides = classyGivens
        self.when_overrides = classyWhens
        self.then_overrides = classyThens
        
        # Initialize the classy implementations
        self._initialize_classy_implementations(test_implementation)

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
                def __init__(self, failed, fails, artifacts, features):
                    self.failed = failed
                    self.fails = fails
                    self.artifacts = artifacts
                    self.features = features
            
            return Result(
                fails > 0,
                fails,
                artifacts,
                features
            )
        except Exception as e:
            print(f"Error in test job: {e}")
            
            class Result:
                def __init__(self, failed, fails, artifacts, features):
                    self.failed = failed
                    self.fails = fails
                    self.artifacts = artifacts
                    self.features = features
            
            return Result(True, 1, [], [])
    
    async def receiveTestResourceConfig(self, partialTestResource: str, ipcfile: str) -> Any:
        # Parse the test resource configuration
        test_resource_config = json.loads(partialTestResource)
        
        # Create a PM_Python instance
        pm = PM_Python(test_resource_config, ipcfile)
        
        # Run all test jobs
        total_fails = 0
        all_features = set()
        all_artifacts = []
        
        # Collect all suite results
        suite_results = []
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
                total_fails += 1
        
        # Write the final tests.json
        try:
            # Flatten all givens from all suites
            all_givens = []
            for suite in suite_results:
                if 'givens' in suite:
                    all_givens.extend(suite['givens'])
            
            # Prepare tests data matching the TypeScript structure
            tests_data = {
                "name": self.specs[0].name if self.specs else "Unnamed Test",
                "givens": all_givens,
                "fails": total_fails,
                "features": list(all_features),
                "artifacts": all_artifacts
            }
            
            # Write to file
            tests_json_path = f"{test_resource_config['fs']}/tests.json"
            with open(tests_json_path, 'w') as f:
                json.dump(tests_data, f, indent=2)
                
        except Exception as e:
            print(f"Error writing tests.json: {e}")
        
        # Return result
        class Result:
            def __init__(self, fails):
                self.fails = fails
        return Result(total_fails)
