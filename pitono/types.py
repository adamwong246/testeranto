from typing import TypeVar, Generic, Callable, Any, Dict, List, Optional

# Type variables for BDD input/output types
Iinput = TypeVar('Iinput')
Isubject = TypeVar('Isubject')
Istore = TypeVar('Istore')
Iselection = TypeVar('Iselection')
Then = TypeVar('Then')
Given = TypeVar('Given')

# Test resource configuration
class ITTestResourceConfiguration:
    def __init__(
        self,
        name: str,
        fs: str,
        ports: List[int],
        browser_ws_endpoint: Optional[str] = None,
        timeout: Optional[int] = None,
        retries: Optional[int] = None,
        environment: Optional[Dict[str, str]] = None
    ):
        self.name = name
        self.fs = fs
        self.ports = ports
        self.browser_ws_endpoint = browser_ws_endpoint
        self.timeout = timeout
        self.retries = retries
        self.environment = environment or {}

# Test adapter interface
class ITestAdapter:
    def before_all(self, input_val: Any, tr: ITTestResourceConfiguration, pm: Any) -> Any:
        raise NotImplementedError()
    
    def after_all(self, store: Any, pm: Any) -> Any:
        raise NotImplementedError()
    
    def before_each(self, subject: Any, initializer: Any, test_resource: ITTestResourceConfiguration, 
                   initial_values: Any, pm: Any) -> Any:
        raise NotImplementedError()
    
    def after_each(self, store: Any, key: str, pm: Any) -> Any:
        raise NotImplementedError()
    
    def and_when(self, store: Any, when_cb: Any, test_resource: Any, pm: Any) -> Any:
        raise NotImplementedError()
    
    def but_then(self, store: Any, then_cb: Any, test_resource: Any, pm: Any) -> Any:
        raise NotImplementedError()
    
    def assert_this(self, t: Any) -> bool:
        raise NotImplementedError()

# Test specification function type
ITestSpecification = Callable[[Any, Any, Any, Any], Any]

# Test implementation structure
class ITestImplementation:
    def __init__(self, suites: Dict[str, Any], givens: Dict[str, Any], 
                 whens: Dict[str, Any], thens: Dict[str, Any]):
        self.suites = suites
        self.givens = givens
        self.whens = whens
        self.thens = thens

# Test resource request
class ITTestResourceRequest:
    def __init__(self, ports: int):
        self.ports = ports

# Final results
class IFinalResults:
    def __init__(self, failed: bool, fails: int, artifacts: List[Any], features: List[str]):
        self.failed = failed
        self.fails = fails
        self.artifacts = artifacts
        self.features = features
