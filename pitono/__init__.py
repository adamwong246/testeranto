from typing import Any, List, Dict, Callable
from .types import ITestSpecification, ITestImplementation, ITestAdapter, ITTestResourceRequest
from .simple_adapter import SimpleTestAdapter

class Pitono:
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
        self.assert_this_func = test_adapter.assert_this
        
        # Generate specs
        self.specs = test_specification(
            self.suites(),
            self.given(),
            self.when(),
            self.then()
        )
    
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
