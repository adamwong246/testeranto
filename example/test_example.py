import asyncio
from pitono import Pitono, SimpleTestAdapter
from pitono.types import ITestSpecification, ITestImplementation, ITTestResourceRequest
from pitono.core_generator import PitonoCoreGenerator

# Define a simple test specification
def test_specification(suites, givens, whens, thens):
    return {
        'suites': suites,
        'givens': givens,
        'whens': whens,
        'thens': thens
    }

# Create a simple test implementation
test_implementation = ITestImplementation(
    suites={},
    givens={},
    whens={},
    thens={}
)

# Create a test resource requirement
test_resource_requirement = ITTestResourceRequest(ports=0)

# Create a test adapter
test_adapter = SimpleTestAdapter()

# Create uber_catcher
def uber_catcher(func):
    try:
        func()
    except Exception as e:
        print(f"Error: {e}")

# Create Pitono instance
pitono = Pitono(
    input_val=None,
    test_specification=test_specification,
    test_implementation=test_implementation,
    test_resource_requirement=test_resource_requirement,
    test_adapter=test_adapter,
    uber_catcher=uber_catcher
)

print("Pitono initialized successfully!")

# Test the core generator
def test_core_generator():
    entry_points = ["example/test1.py", "example/test2.py"]
    generator = PitonoCoreGenerator("test_suite", entry_points)
    generator.write_core_json()
    print("Core generator test completed!")

# Let's test running a simple suite
async def test_suite():
    from pitono.base_suite import BaseSuite
    from pitono.base_given import BaseGiven
    from pitono.base_when import BaseWhen
    from pitono.base_then import BaseThen
    
    # Create a simple then implementation
    class SimpleThen(BaseThen):
        async def but_then(self, store, then_cb, test_resource_configuration, pm):
            return True
    
    # Create a simple when implementation
    class SimpleWhen(BaseWhen):
        async def and_when(self, store, when_cb, test_resource, pm):
            return store
    
    # Create a simple given implementation
    class SimpleGiven(BaseGiven):
        async def given_that(self, subject, test_resource_configuration, artifactory, given_cb, initial_values, pm):
            return {"initial": "store"}
    
    # Create test instances
    then = SimpleThen("test then", lambda: True)
    when = SimpleWhen("test when", lambda: None)
    given = SimpleGiven("test given", ["test feature"], [when], [then], lambda: None, {})
    
    suite = BaseSuite("test suite", {"test_given": given})
    
    # Mock functions
    def artifactory(path, value):
        print(f"Artifactory: {path} -> {value}")
    
    def t_log(*args):
        print("LOG:", *args)
    
    # Run the suite
    result = await suite.run(
        None,
        None,
        artifactory,
        t_log,
        None
    )
    print(f"Suite result: {result.to_obj()}")

if __name__ == "__main__":
    # Test core generator
    test_core_generator()
    
    # Run the test suite
    asyncio.run(test_suite())
