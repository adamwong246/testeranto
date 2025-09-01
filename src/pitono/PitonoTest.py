from pitono import Pitono, set_default_instance, main
import asyncio
import sys

# Import your test components
from .Pitono.adapter import testAdapter
from .MockPitono import MockPitono
from .Pitono.specification import specification
from .Pitono.implementation import implementation

# Create the test instance
test_instance = Pitono(
    MockPitono,
    specification,
    implementation,
    testAdapter,
    {"ports": 1}
)

# Set it as the default instance
set_default_instance(test_instance)

# Run the main function if this file is executed directly
if __name__ == "__main__":
    asyncio.run(main())
