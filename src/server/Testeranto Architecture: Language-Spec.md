# Testeranto Architecture: Unified Build & Analysis with Dual Test Strategies

## Overview

After analyzing 7 runtimes, we've identified a significant simplification: **Build and static analysis follow a single unified pattern across all runtimes**, while **test execution requires only two distinct strategies**. This reduces complexity while maintaining performance benefits.

## The Three Layers, Two Strategy Patterns

### Layer 1: Build Process → 1 Strategy
- **All runtimes**: Builder watches source → produces artifacts
- **Same pattern**: File watching, incremental builds, metafile generation
- **No differentiation**: Node builder works like Go builder works like Java builder

### Layer 2: Static Analysis → 1 Strategy  
- **All runtimes**: Analyzer watches source → produces analysis results
- **Same pattern**: File watching, tool execution, result reporting
- **User-configured**: Tools installed dynamically based on config

### Layer 3: Test Execution → 2 Strategies
- **Strategy A (Process-based)**: Node, Python, Ruby, PHP, Go, Rust
- **Strategy B (Shared-resource)**: Java, Web

## Visual Summary

```
┌─────────────────────────────────────────────────────────┐
│                    ALL 7 RUNTIMES                       │
├─────────────────────────────────────────────────────────┤
│  LAYER 1: BUILD PROCESS                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │ Node    │  │ Python  │  │ Go      │  │ Java    │    │
│  │ Builder │  │ Builder │  │ Builder │  │ Builder │    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
│  SAME PATTERN: Watch → Build → Metafile                 │
├─────────────────────────────────────────────────────────┤
│  LAYER 2: STATIC ANALYSIS                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │ Node    │  │ Python  │  │ Go      │  │ Java    │    │
│  │ Analyzer│  │ Analyzer│  │ Analyzer│  │ Analyzer│    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
│  SAME PATTERN: Watch → Analyze → Report                 │
├─────────────────────────────────────────────────────────┤
│  LAYER 3: TEST EXECUTION                                │
│                                                         │
│  STRATEGY A: PROCESS-BASED (6 languages)                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │ Node    │  │ Python  │  │ Go      │  │ Rust    │    │
│  │ Process │  │ Process │  │ Binary  │  │ Binary  │    │
│  │ Pool    │  │ Pool    │  │ Runner  │  │ Runner  │    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
│                                                         │
│  STRATEGY B: SHARED-RESOURCE (2 languages)              │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │ Java            │  │ Web             │              │
│  │ JVM +           │  │ Chrome +        │              │
│  │ Classloaders    │  │ Contexts        │              │
│  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

## Why This Makes Sense

### Builders are Similar:
- All need to: watch files, compile/transform, output artifacts
- Differences are in tools (esbuild vs go build vs javac), not pattern

### Analyzers are Similar:
- All need to: watch files, run linters, report issues
- Differences are in tools (ESLint vs pylint vs golangci-lint), not pattern

### Test Execution is Fundamentally Different:
- **Process-based**: Cheap to create/destroy (Node, Python, Go, Rust, Ruby, PHP)
- **Shared-resource**: Expensive startup, cheap sandboxes (Java JVM, Chrome)

## Implementation Benefits

1. **Simplified Build/Analysis Code**: One pattern to implement for all runtimes
2. **Consistent Configuration**: Same config format for build/analysis across languages
3. **Easier Maintenance**: Build/analysis logic doesn't need strategy branching
4. **Clear Separation**: Test execution is the only complex part

## The Architecture Now

```
For EACH of 7 runtimes:
1. Builder Service (1 pattern)
   - Watches source files
   - Builds artifacts to /dist
   - Generates metafile
   
2. Analyzer Service (1 pattern) 
   - Watches source files
   - Runs user-configured tools
   - Writes results to /analysis
   
3. Test Executor Service (2 patterns)
   - Pattern A: Process-based (Node, Python, Go, Rust, Ruby, PHP)
   - Pattern B: Shared-resource (Java, Web)
```

## Detailed Strategy Breakdown

### Strategy A: Process-Based Test Execution
**Applicable to**: Node.js, Python, Go, Rust, Ruby, PHP
**Characteristics**:
- Fast process creation/destruction
- Good isolation between test runs
- Can use process pools for concurrency control
- Minimal shared state between tests

**Implementation Approach**:
- Single container per runtime
- Process pool manager to limit concurrent tests
- Clean environment between test runs
- Reuse container for multiple tests

### Strategy B: Shared-Resource Test Execution
**Applicable to**: Java, Web (Chrome)
**Characteristics**:
- Heavy resource startup cost (JVM ~200-500ms, Chrome ~500MB+)
- Cheap sandbox creation within the resource
- Resource sharing provides significant performance benefits

**Implementation Approach**:
- **Java**: Single JVM with classloader isolation per test suite
- **Web**: Single Chrome instance with browser contexts per test
- Memory management and cleanup between test runs
- Warm-up strategies to reduce startup overhead

## Target Languages

| Category               | Languages                              |
|------------------------|----------------------------------------|
| Process-Based Tests    | Node.js, Python, Go, Rust, Ruby, PHP  |
| Shared-Resource Tests  | Java, Web (JavaScript/TypeScript)     |

*Note: Shell/Bash is excluded from the target list as it does not align with the primary testing scenarios.*

## Key Files to Modify

1. `testeranto/bundles/allTests-docker-compose.yml` - Service definitions per runtime
2. `src/server/serverClasees/ServerTestExecutor.ts` - Dual-strategy test routing
3. `src/clients/index.ts` - Unified builder/analyzer clients
4. `src/lib/types.ts` - Type definitions for unified patterns
5. `src/server/serverClasees/BuildProcessManager.ts` - Unified build management

## Performance Considerations

### For Process-Based Test Execution:
- Process spawning overhead minimal for interpreted languages
- Binary execution fast for compiled languages
- Memory usage scales linearly with concurrent tests
- Excellent isolation allows aggressive parallelism

### For Shared-Resource Test Execution:
- JVM warm-up important for Java performance
- Single Chrome instance saves ~500MB per additional instance
- Browser contexts provide good isolation with minimal overhead
- Memory monitoring essential for resource management

## Implementation Priorities

**Phase 1**: Unified Build/Analysis + Node (Process) + Web (Shared)  
**Phase 2**: Python (Process) + Go (Process)  
**Phase 3**: Java (Shared) + Ruby (Process)  
**Phase 4**: Rust + PHP + remaining languages

## Next Steps

1. Implement unified builder/analyzer pattern for all runtimes
2. Implement dual-strategy test execution
3. Measure performance compared to previous approach
4. Adjust strategies based on real-world results
5. Implement remaining runtimes incrementally

---

_Last updated: 2025-12-09_
