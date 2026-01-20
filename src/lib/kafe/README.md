# Kafe - Java Implementation of Testeranto

Kafe is a Java implementation of the Testeranto BDD testing framework, following the same patterns as other language implementations (TypeScript, Python, Go, Ruby, Rust).

## Overview

This implementation provides Java classes for writing BDD-style tests with Given-When-Then structure, integrated with the Testeranto ecosystem.

## Structure

- `types.java`: Core type definitions and interfaces
- `BaseSuite.java`: Base class for test suites
- `BaseGiven.java`: Base class for Given conditions
- `BaseWhen.java`: Base class for When actions
- `BaseThen.java`: Base class for Then assertions
- `SimpleTestAdapter.java`: Default adapter implementation
- `Kafe.java`: Main orchestrator class

## Usage

### Basic Example

```java
import kafe.*;
import java.util.*;

public class CalculatorTest {
    public static void main(String[] args) {
        // Define test implementation
        Map<String, Object> suites = new HashMap<>();
        Map<String, Function<Object, Object>> givens = new HashMap<>();
        Map<String, Function<Object, Function<Object, Object>>> whens = new HashMap<>();
        Map<String, Function<Object, Function<Object, Object>>> thens = new HashMap<>();
        
        // Add your test definitions here...
        
        ITestImplementation implementation = new ITestImplementation(
            suites, givens, whens, thens
        );
        
        // Create test specification
        ITestSpecification specification = (suitesObj, givensObj, whensObj, thensObj) -> {
            // Build test specs
            return new ArrayList<>();
        };
        
        // Create Kafe instance
        Kafe kafe = new Kafe(
            null,
            specification,
            implementation,
            new ITestResourceRequest(1),
            new SimpleTestAdapter(),
            (runnable) -> { runnable.run(); return null; }
        );
        
        // Run tests
        IFinalResults results = kafe.receiveTestResourceConfig(
            "{\"name\":\"test\",\"fs\":\".\",\"ports\":[]}",
            "ipcfile"
        );
        
        System.exit(results.fails);
    }
}
```

### Running Tests

To run tests with Kafe:

```bash
java -cp ".:kafe/*" kafe.Kafe '{"name":"test","fs":".","ports":[]}'
```

## Integration with Testeranto

Kafe follows the same patterns as other Testeranto implementations:

1. **Test Resource Configuration**: Passed as a JSON string argument
2. **Results Output**: Writes to `testeranto/reports/allTests/example/java.Calculator.test.ts.json`
3. **Artifact Generation**: Supports test artifacts and reporting

## Building

Since this is a stub implementation, you'll need to compile the Java files:

```bash
cd src/lib/kafe
javac -d . *.java
```

## Future Enhancements

1. **Complete Implementation**: Fill in the placeholder methods
2. **Dependency Management**: Add Maven/Gradle support
3. **WebSocket Support**: Real-time test reporting
4. **Annotation Support**: Java annotations for test definitions
5. **JUnit Integration**: Compatibility with JUnit

## See Also

- [Tiposkripto](../tiposkripto/) - TypeScript/JavaScript implementation
- [Pitono](../pitono/) - Python implementation
- [Golingvu](../golingvu/) - Go implementation
- [Rubeno](../rubeno/) - Ruby implementation
- [Rusto](../rusto/) - Rust implementation
