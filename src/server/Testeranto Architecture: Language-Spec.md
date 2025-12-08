# Testeranto Architecture: Language-Specific Strategies

## Overview

Given 7 runtimes with different characteristics, we've categorized them into 4 distinct strategies to balance performance, isolation, and implementation complexity.

## Runtime Categories & Strategies

### 1. Interpreted Scripting Languages

**Runtimes**: Node.js, Python, Ruby, PHP
**Characteristics**:

- Fast startup (<100ms)
- Interpreter-based execution
- Global state concerns
- Dependency management (npm/pip/gem/composer)

**Strategy**: Combined Build-and-Test Service with Process Pools

- Single container per runtime
- Spawn subprocesses for each test
- Virtual environment/isolation per test (venv, bundle exec, etc.)
- Shared dependency cache across tests
- Process-level isolation (good enough for these languages)

**Implementation Notes**:

- Use process pools to limit concurrent tests
- Clean environment between test runs
- Reuse container for multiple tests

---

### 2. Compiled Native Languages

**Runtimes**: Go, Rust
**Characteristics**:

- Compilation overhead but fast execution
- Produce standalone binaries
- Excellent process isolation
- Cargo/go modules for dependencies

**Strategy**: Separate Build Service + Combined Test Execution

- **Build service**: Compile once, cache binaries
- **Test service**: Run compiled tests in parallel
- Binary caching between test runs
- Native process isolation (excellent)

**Implementation Notes**:

- Volume mounts for build artifacts
- Compilation caching (Cargo cache, Go build cache)
- Can run many test binaries concurrently in same container

---

### 3. Virtual Machine Language

**Runtime**: Java
**Characteristics**:

- JVM startup overhead (~200-500ms)
- Bytecode execution
- Classloader-based isolation possible
- Maven/Gradle build systems

**Strategy**: Combined Service with Shared JVM

- Single container with JVM
- Compile with Maven/Gradle
- Run tests with shared JVM, separate classloaders
- JVM tuning for multiple concurrent tests

**Implementation Notes**:

- Use testing frameworks that support classloader isolation (JUnit, TestNG)
- JVM memory tuning for multiple test suites
- Warm JVM to reduce startup overhead

---

### 4. Browser Environment

**Runtime**: Web (Chrome)
**Characteristics**:

- Very heavy resource usage (~500MB+ per instance)
- Tab/context-based isolation
- No traditional "build" but asset bundling
- DevTools Protocol for automation

**Strategy**: Combined Service with Shared Chrome Instance

- Single container with Chrome
- Serve test bundles/assets
- Browser context per test (isolated cookies, localStorage)
- Memory management for Chrome

**Implementation Notes**:

- Single Chrome instance, multiple browser contexts
- CDP (Chrome DevTools Protocol) for management
- Resource limits per context
- Cleanup between tests (clear storage, cookies)

---

## Architecture Benefits

1.  **Performance Optimized**: Each category gets appropriate resource management
2.  **Isolation Balanced**: Right level of isolation for each runtime type
3.  **Implementation Manageable**: 4 strategies instead of 7
4.  **Extensible**: New languages fit into existing categories
5.  **Resource Efficient**: Avoids over/under isolation

## Implementation Priorities

**Phase 1**: Node + Web (highest priority, covers two different categories)  
**Phase 2**: Python + Go (adds top interpreted and compiled languages)  
**Phase 3**: Java + Ruby (fills VM category and extends interpreted)  
**Phase 4**: Rust + C# + PHP + Kotlin + C++ (completes each category with next most popular)

## Target Languages per Category

| Category   | Primary (Phase 1‑2)      | Secondary (Phase 3‑4)        |
|------------|--------------------------|------------------------------|
| Interpreted| Node.js, Python          | Ruby, PHP                    |
| Compiled   | Go                       | Rust, C++                    |
| VM         | –                        | Java, C#, Kotlin             |
| Chrome     | Web (JavaScript/TypeScript)| – (already covered)         |

*Note: Shell/Bash is excluded from the target list as it does not align with the primary testing scenarios.*

## Key Files to Modify

1.  `testeranto/bundles/allTests-docker-compose.yml` - Service definitions per category
2.  `src/server/serverClasees/ServerTestExecutor.ts` - Category-based test routing
3.  `src/clients/index.ts` - PM classes for each category
4.  `src/lib/types.ts` - Type definitions for categories
5.  `src/server/serverClasees/BuildProcessManager.ts` - Category-specific build management

## Performance Considerations

### For Lightweight Tests (Interpreted Languages):

- Process spawning overhead minimal
- Can run many tests in parallel
- Memory usage scales linearly

### For Compiled Languages:

- Compilation overhead but test execution is fast
- Binary caching crucial for performance
- Excellent isolation allows aggressive parallelism

### For Java:

- JVM warm-up important
- Classloader isolation cheaper than new JVMs
- Memory tuning critical

### For Web:

- Single Chrome instance saves ~500MB per additional instance
- Browser contexts provide good isolation
- Memory monitoring essential

## Next Steps

1.  Implement Phase 1 (Node + Web) to validate the architecture
2.  Measure performance compared to current approach
3.  Adjust strategies based on real-world results
4.  Implement remaining phases incrementally

---

_Last updated: 2025-12-08_
