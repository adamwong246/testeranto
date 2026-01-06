"""
Calculator test file for pitono.
This file contains tests for the Calculator class.
"""
import sys
import os

# Add the src directory to the Python path to find pitono
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

# Import Calculator from the current directory
from Calculator import Calculator

# Try to import specification and implementation
# These might be in a subdirectory
specification = None
implementation = None

def create_specification(Suite, Given, When, Then, Check):
    """Create test specification for Calculator."""
    return [
        {
            'name': 'Calculator Suite',
            'givens': {
                "basic_operations": Given["Default"](
                    ["Basic calculator operations should work"],
                    [],
                    [Then["DisplayMatches"]("")]
                ),
                "addition": Given["Addition"](
                    ["Addition should work correctly"],
                    [When["Press"]("2"), When["Press"]("+"), When["Press"]("3"), When["Press"]("=")],
                    [Then["DisplayMatches"]("5")]
                ),
                "subtraction": Given["Subtraction"](
                    ["Subtraction should work correctly"],
                    [When["Press"]("7"), When["Press"]("-"), When["Press"]("3"), When["Press"]("=")],
                    [Then["DisplayMatches"]("4")]
                ),
                "multiplication": Given["Multiplication"](
                    ["Multiplication should work correctly"],
                    [When["Press"]("4"), When["Press"]("*"), When["Press"]("5"), When["Press"]("=")],
                    [Then["DisplayMatches"]("20")]
                ),
                "division": Given["Division"](
                    ["Division should work correctly"],
                    [When["Press"]("8"), When["Press"]("/"), When["Press"]("2"), When["Press"]("=")],
                    [Then["DisplayMatches"]("4")]
                ),
                "clear": Given["Clear"](
                    ["Clear should reset the display"],
                    [When["Press"]("5"), When["Press"]("+"), When["Press"]("3"), When["Press"]("C")],
                    [Then["DisplayMatches"]("")]
                )
            },
            'features': []
        }
    ]
    
# Define a comprehensive implementation that works with the existing Calculator class
class SimpleImplementation:
    """Simple test implementation for Calculator."""
    
    def __init__(self):
        self.suites = {
            "Default": "Default Suite",
            "Addition": "Addition Suite",
            "Subtraction": "Subtraction Suite", 
            "Multiplication": "Multiplication Suite",
            "Division": "Division Suite",
            "Clear": "Clear Suite"
        }
        self.givens = {
            "Default": lambda: lambda: {"calculator": Calculator(), "display": ""},
            "Addition": lambda: lambda: {"calculator": Calculator(), "display": ""},
            "Subtraction": lambda: lambda: {"calculator": Calculator(), "display": ""},
            "Multiplication": lambda: lambda: {"calculator": Calculator(), "display": ""},
            "Division": lambda: lambda: {"calculator": Calculator(), "display": ""},
            "Clear": lambda: lambda: {"calculator": Calculator(), "display": ""}
        }
        self.whens = {
            "Press": lambda button: lambda store, pm: self._press_button(store, button)
        }
        self.thens = {
            "DisplayMatches": lambda expected: lambda store, pm: store["calculator"].get_display() == expected
        }
    
    def _press_button(self, store, button):
        """Press a button on the calculator."""
        # Press the button on the calculator using the existing implementation
        calculator = store["calculator"]
        if button == "=":
            # Use the enter method to evaluate the expression
            calculator.enter()
        else:
            # Use the press method for other buttons
            calculator.press(button)
        # Update the display in the store
        store["display"] = calculator.get_display()
        return store

implementation = SimpleImplementation()

# Note: The actual test runner setup is handled by the pitono framework
# This file is meant to be imported and used by the test runner

if __name__ == "__main__":
    print("This test file is meant to be run through the pitono test runner.")
    print("To run tests, use the appropriate test command from the project root.")


# # First, ensure websockets is installed in the current environment
# try:
#     import websockets
#     print("websockets is already installed")
# except ImportError:
#     print("Installing websockets...")
#     try:
#         # Try to install websockets using pip
#         subprocess.check_call([sys.executable, "-m", "pip", "install", "websockets>=12.0"])
#         print("Successfully installed websockets")
#         # Reload the module
#         import importlib
#         if 'websockets' in sys.modules:
#             importlib.reload(sys.modules['websockets'])
#     except Exception as e:
#         print(f"Failed to install websockets: {e}")
#         print("Please install websockets manually: pip install websockets>=12.0")
#         sys.exit(1)

# # Import Calculator from the current directory
# from Calculator import Calculator

# # Check for websockets before importing pitono
# try:
#     import websockets
# except ImportError:
#     print("ERROR: websockets is not installed in the virtual environment")
#     print("Please install it with: pip install websockets>=12.0")
#     print("Or activate the correct virtual environment")
#     sys.exit(1)

# # Import pitono components
# try:
#     from src.pitono.Pitono import Pitono, set_default_instance, main
#     from src.pitono.simple_adapter import SimpleTestAdapter
# except ImportError as e:
#     print(f"Could not import pitono: {e}")
#     print("Make sure to run from the project root and install pitono")
#     raise
