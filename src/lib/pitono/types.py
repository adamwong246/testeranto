from typing import TypeVar, Generic, Callable, Any, Dict, List, Optional, Protocol, Union
from dataclasses import dataclass

# Type variables for BDD input/output types
Iinput = TypeVar('Iinput')
Isubject = TypeVar('Isubject')
Istore = TypeVar('Istore')
Iselection = TypeVar('Iselection')
Then = TypeVar('Then')
Given = TypeVar('Given')

# Test resource configuration
@dataclass
class ITTestResourceConfiguration:
    name: str
    fs: str
    ports: List[int]
    browser_ws_endpoint: Optional[str] = None
    timeout: Optional[int] = None
    retries: Optional[int] = None
    environment: Optional[Dict[str, str]] = None

# Test adapter interface - matches the TypeScript ITestAdapter
class ITestAdapter(Protocol):
    def before_all(self, input_val: Any, tr: ITTestResourceConfiguration, pm: Any) -> Any:
        ...
    
    def after_all(self, store: Any, pm: Any) -> Any:
        ...
    
    def before_each(self, subject: Any, initializer: Any, test_resource: ITTestResourceConfiguration, 
                   initial_values: Any, pm: Any) -> Any:
        ...
    
    def after_each(self, store: Any, key: str, pm: Any) -> Any:
        ...
    
    def and_when(self, store: Any, when_cb: Any, test_resource: Any, pm: Any) -> Any:
        ...
    
    def but_then(self, store: Any, then_cb: Any, test_resource: Any, pm: Any) -> Any:
        ...
    
    def assert_this(self, t: Any) -> bool:
        ...

# Test specification function type - matches TypeScript ITestSpecification
# It can take either 4 or 5 arguments to be flexible
ITestSpecification = Callable[..., Any]

# Test implementation structure - matches TypeScript ITestImplementation structure
class ITestImplementation:
    suites: Dict[str, Any]
    givens: Dict[str, Callable[..., Any]]
    whens: Dict[str, Callable[..., Callable[[Any], Any]]]
    thens: Dict[str, Callable[..., Callable[[Any], Any]]]
    
    def __init__(self, 
                 suites: Dict[str, Any], 
                 givens: Dict[str, Callable[..., Any]], 
                 whens: Dict[str, Callable[..., Callable[[Any], Any]]], 
                 thens: Dict[str, Callable[..., Callable[[Any], Any]]]):
        self.suites = suites
        self.givens = givens
        self.whens = whens
        self.thens = thens

# Test resource request
@dataclass
class ITTestResourceRequest:
    ports: int

# Final results
@dataclass
class IFinalResults:
    failed: bool
    fails: int
    artifacts: List[Any]
    features: List[str]

# BDD input type interface - simplified version of Ibdd_in
class Ibdd_in(Protocol):
    pass

# BDD output type interface - simplified version of Ibdd_out
class Ibdd_out(Protocol):
    pass
