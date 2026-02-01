# Rusto - Testeranto Implementation for Rust

Rusto is a Rust implementation of the Testeranto BDD testing framework.

## Overview

This crate provides a Rust implementation of the Testeranto testing framework, following the same patterns as other language implementations (TypeScript, Python, Go, Ruby).

## Structure

- `src/types.rs`: Core type definitions and traits
- `src/base_suite.rs`: BaseSuite struct for test suites
- `src/base_given.rs`: BaseGiven struct for Given conditions
- `src/base_when.rs`: BaseWhen struct for When actions
- `src/base_then.rs`: BaseThen struct for Then assertions
- `src/simple_adapter.rs`: SimpleTestAdapter default implementation
- `src/rusto.rs`: Main Rusto struct and entry point

## Usage

Add to your `Cargo.toml`:

```toml
[dependencies]
rusto = { path = "./src/lib/rusto" }
```

Basic example:

```rust
use rusto::{Rusto, SimpleTestAdapter, ITestImplementation, ITestSpecification};
use async_trait::async_trait;

// Define your test implementation
let implementation = ITestImplementation {
    suites: /* ... */,
    givens: /* ... */,
    whens: /* ... */,
    thens: /* ... */,
};

// Create Rusto instance
let rusto = Rusto::new(
    input,
    test_specification,
    implementation,
    test_resource_requirement,
    Box::new(SimpleTestAdapter::new()),
);

// Run tests
let results = rusto.receive_test_resource_config(partial_test_resource).await;
```

## Testing

Run tests with:

```bash
cargo test
```

## Integration

Rusto follows the same patterns as other Testeranto implementations:

1. **Test Resource Configuration**: Passed as JSON string
2. **Results Output**: Writes to `testeranto/reports/allTests/example/rust.Calculator.test.ts.json`
3. **Async Support**: Built on Tokio for async operations
4. **Error Handling**: Uses `thiserror` for comprehensive error types

## Future Enhancements

1. **WebSocket Support**: Real-time test reporting
2. **More Adapters**: Specialized adapter implementations
3. **Performance Optimizations**: Lever Rust's performance characteristics
4. **Macro Support**: DSL macros for cleaner test definitions

## See Also

- [Tiposkripto](../tiposkripto/) - TypeScript/JavaScript implementation
- [Pitono](../pitono/) - Python implementation
- [Golingvu](../golingvu/) - Go implementation
- [Rubeno](../rubeno/) - Ruby implementation
