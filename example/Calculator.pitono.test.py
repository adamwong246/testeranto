import sys
import os

# Add the current directory to the Python path to find local modules
sys.path.insert(0, os.path.dirname(__file__))

# Import Calculator from the current directory
from Calculator import Calculator

# Try to import pitono components
try:
    # Try relative import first
    from ..src.pitono.Pitono import Pitono, set_default_instance, main
except ImportError:
    try:
        # Try absolute import
        from src.pitono.Pitono import Pitono, set_default_instance, main
    except ImportError:
        print("Could not import pitono. Make sure to run from the project root")
        raise

# Import specification, implementation, and adapter
try:
    from .Calculator.pitono.specification import specification
    from .Calculator.pitono.implementation import implementation
    from .Calculator.pitono.adapter import SimpleTestAdapter
except ImportError as e:
    print(f"Import error: {e}")
    # Create fallback implementations if needed
    raise

# Create the test instance
test_instance = Pitono(
    Calculator,  # Pass the Calculator class as input
    specification,
    implementation,
    SimpleTestAdapter(),
    {"ports": 1}
)

# Set it as the default instance
set_default_instance(test_instance)

# Run the main function if this file is executed directly
if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
