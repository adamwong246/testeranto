import asyncio
import sys
import os

# Add the src directory to Python path to find the pitono package
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

try:
    from pitono import Pitono
    from pitono.types import ITestSpecification, ITestImplementation, ITTestResourceRequest
    from pitono.core_generator import PitonoCoreGenerator
except ImportError as e:
    print(f"Import error: {e}")
    print("Current Python path:")
    for path in sys.path:
        print(f"  {path}")
    print("Please make sure to activate the virtual environment and install the pitono package")
    print("Run: python3 -m venv venv && source venv/bin/activate && pip install -e ./src/pitono")
    raise

# Define a simple Rectangle class to test
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def set_width(self, width):
        self.width = width
    
    def set_height(self, height):
        self.height = height
    
    def get_width(self):
        return self.width
    
    def get_height(self):
        return self.height
    
    def area(self):
        return self.width * self.height

# Define test specification
def test_specification(Suite, Given, When, Then, Check):
    return [
        Suite(
            "Testing Rectangle functionality",
            {
                "test_initial_dimensions": Given["Default"](
                    ["A rectangle with initial dimensions"],
                    [],
                    [Then["get_width"](2), Then["get_height"](2)]
                ),
                "test_set_width": Given["Default"](
                    ["Setting width of rectangle"],
                    [When["set_width"](4)],
                    [Then["get_width"](4)]
                ),
                "test_area": Given["Default"](
                    ["Calculate area of rectangle"],
                    [When["set_width"](3), When["set_height"](4)],
                    [Then["area"](12)]
                )
            },
            []
        )
    ]

# Helper function for assertions
def _assert_equal(actual, expected):
    if actual != expected:
        raise AssertionError(f"Expected {expected}, got {actual}")
    return True

# Define test implementation
test_implementation = ITestImplementation(
    suites={
        "Default": "Testing Rectangle class"
    },
    givens={
        "Default": lambda *args: Rectangle(2, 2)
    },
    whens={
        "set_width": lambda width: lambda rect, pm: (rect.set_width(width) or rect),
        "set_height": lambda height: lambda rect, pm: (rect.set_height(height) or rect)
    },
    thens={
        "get_width": lambda expected: lambda rect, pm: 
            (_assert_equal(rect.get_width(), expected), rect)[1],
        "get_height": lambda expected: lambda rect, pm: 
            (_assert_equal(rect.get_height(), expected), rect)[1],
        "area": lambda expected: lambda rect, pm: 
            (_assert_equal(rect.area(), expected), rect)[1],
    }
)

# Create test resource requirement
test_resource_requirement = ITTestResourceRequest(ports=0)

# Create test adapter
class TestAdapter:
    async def beforeEach(self, subject, initializer, test_resource, initial_values, pm):
        # Call the initializer with initial_values unpacked
        # Handle case where initial_values might be None
        if initial_values is None:
            return initializer()
        # Check if initial_values is iterable
        try:
            return initializer(*initial_values)
        except TypeError:
            # If it's not iterable, pass it directly
            return initializer(initial_values)
    
    async def andWhen(self, store, when_cb, test_resource, pm):
        # Execute the when callback which should modify the store and return it
        # The when_cb is a function that takes the store and pm
        result = when_cb(store, pm)
        return result
    
    async def butThen(self, store, then_cb, test_resource, pm):
        # Execute the then callback which should modify the store and return it
        # The assertion is handled within the callback
        result = then_cb(store, pm)
        return result
    
    async def afterEach(self, store, key, pm):
        # Clean up if necessary
        pass
    
    async def beforeAll(self, input_val, test_resource, pm):
        # Setup before all tests
        # Return the initial subject which will be passed to beforeEach
        return None
    
    async def afterAll(self, store, pm):
        # Clean up after all tests
        pass
    
    def assertThis(self, x):
        # This seems to be used for assertions, but our assertions are in the then callbacks
        # We can just pass through
        pass

test_adapter = TestAdapter()

# Create uber_catcher
def uber_catcher(func):
    return func()

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
    entry_points = ["example/test_example.py"]
    generator = PitonoCoreGenerator("test_suite", entry_points)
    generator.write_core_json()
    print("Pitono core.json written to: testeranto/pitono/test_suite/core.json")
    print("Core generator test completed!")

if __name__ == "__main__":
    # Run the test
    async def run_test():
        try:
            # Try to run the tests
            # The exact method name might be different, but let's assume it's 'run_tests'
            if hasattr(pitono, 'run_tests') and callable(pitono.run_tests):
                result = await pitono.run_tests()
                print(f"Test completed with result: {result}")
            else:
                print("run_tests method not found on Pitono instance")
                # Print available methods
                for attr_name in dir(pitono):
                    if not attr_name.startswith('_'):
                        attr = getattr(pitono, attr_name)
                        if callable(attr):
                            print(f"Callable: {attr_name}")
        except Exception as e:
            print(f"Error running tests: {e}")
            import traceback
            traceback.print_exc()
    
    asyncio.run(run_test())
