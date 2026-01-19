# Rubeno

The Ruby implementation of Testeranto.

## Overview

Rubeno is a Ruby implementation of the Testeranto BDD testing framework. It follows the same patterns as the other language implementations (TypeScript, Python, Go) to provide a consistent testing experience across multiple programming languages.

## Structure

The implementation consists of:

1. **Base Classes**: `BaseSuite`, `BaseGiven`, `BaseWhen`, `BaseThen` - Core BDD components
2. **Main Class**: `Rubeno` - Orchestrates test execution
3. **Test Adapter**: `SimpleTestAdapter` - Default adapter implementation
4. **Process Manager**: `PM_Ruby` - Handles communication
5. **Types**: Type definitions for the framework

## Usage

### Basic Example

```ruby
require 'rubeno'

# Define test implementation
test_implementation = Rubeno::ITestImplementation.new(
  suites: { 'Default' => ->(name, givens) { ... } },
  givens: { 'basic' => ->(initial_values) { ... } },
  whens: { 'press' => ->(button) { ->(store) { ... } } },
  thens: { 'displayIs' => ->(expected) { ->(store) { ... } } }
)

# Define test specification
test_specification = ->(suites, givens, whens, thens) do
  [
    suites.Default('Test Suite', {
      'test1' => givens.basic([], [whens.press('1')], [thens.displayIs('1')], nil)
    })
  ]
end

# Create test instance
test_instance = Rubeno.Rubeno(
  nil,
  test_specification,
  test_implementation,
  Rubeno::SimpleTestAdapter.new,
  Rubeno::ITTestResourceRequest.new(ports: 1)
)

# Set as default and run
Rubeno.set_default_instance(test_instance)
Rubeno.main
```

### Running Tests

To run tests with Rubeno:

```bash
ruby example/Calculator-test.rb '{"name":"test","fs":".","ports":[]}'
```

## Integration with Testeranto

Rubeno follows the same patterns as other Testeranto implementations:

1. **Test Resource Configuration**: Passed as a JSON string argument
2. **Results Output**: Writes to `testeranto/reports/allTests/example/ruby.Calculator.test.ts.json`
3. **WebSocket Communication**: Supports communication via WebSocket (when configured)
4. **Artifact Generation**: Supports test artifacts and reporting

## Docker Support

Rubeno includes a Dockerfile for running tests in containers:

```dockerfile
FROM ruby:3.2-alpine
WORKDIR /workspace
# ... (see testeranto/runtimes/ruby/ruby.Dockerfile)
```

## Extending

To create custom adapters, implement the `ITestAdapter` module:

```ruby
class CustomAdapter
  include Rubeno::ITestAdapter
  
  def before_all(input_val, tr, pm)
    # Custom setup
    input_val
  end
  
  # ... implement other methods
end
```

## Dependencies

- Ruby 2.7+ (for pattern matching and other modern features)
- JSON (standard library)

## Future Enhancements

1. **WebSocket Support**: Full WebSocket communication for real-time test reporting
2. **Advanced Adapters**: More sophisticated adapter implementations
3. **Plugin System**: Extensible plugin architecture
4. **Performance Optimizations**: Improved test execution performance

## See Also

- [Tiposkripto](../tiposkripto/) - TypeScript/JavaScript implementation
- [Pitono](../pitono/) - Python implementation
- [Golingvu](../golingvu/) - Go implementation

