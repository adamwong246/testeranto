# Architecture Choices for Web Test Execution

## Current State

- Web tests use Puppeteer's `page.exposeFunction()` to expose manager commands to tests
- Single Chromium instance in docker-compose (if implemented)
- Communication is one-way (manager → test) through Puppeteer bridge
- Different from TCP-based communication used by Node, Golang, and Python runtimes

## Proposed Changes

### 1. Multiple Chromium Instances (Option B)

**Decision**: Implement multiple Chromium containers for parallel web test execution.

**Reasoning**:

- Enables true parallel execution of web tests
- Provides better test isolation (no state contamination between tests)
- Scales with available system resources
- Aligns with container-based architecture where each test could have its own browser environment

**Implementation Approach**:

- Modify `dockerComposeGenerator.ts` to create multiple Chromium services
- Use dynamic port assignment (4445, 4446, etc.) for additional instances
- Implement connection pooling or round-robin assignment in `BrowserManager`
- Update test service configuration to specify which Chromium instance to use

### 2. WebSocket Communication

**Decision**: Replace Puppeteer-exposed functions with WebSocket communication.

**Reasoning**:

- Creates consistency with TCP-based communication used by other runtimes (Node, Golang, Python)
- Enables bidirectional communication (test ↔ manager) instead of one-way function calls
- More flexible protocol that can evolve independently of Puppeteer API
- Browser-native technology that aligns with web environment
- Simplifies architecture by removing Puppeteer-specific bridge code

**Implementation Approach**:

- Extend `TcpServer` to handle WebSocket connections or create separate `WebSocketServer`
- Use same JSON message format as TCP protocol: `["command", ...args, callbackId]`
- Web tests connect via `ws://DOCKERMAN_HOST:WS_PORT/` instead of using `page.exposeFunction()`
- Update web test bundles to use WebSocket client instead of relying on exposed functions

## Benefits of Combined Approach

1. **Consistent Architecture**: All runtimes use socket-based communication (TCP or WebSocket)
2. **Parallel Execution**: Multiple Chromium instances enable concurrent web testing
3. **Better Isolation**: Each test can run in separate browser instance if needed
4. **Simplified Code**: Remove Puppeteer-specific bridge code in favor of standard WebSocket protocol
5. **Scalability**: Can add more Chromium instances as needed for larger test suites

## Trade-offs and Considerations

### Multiple Chromium Instances:

- **Resource Usage**: Each Chromium container uses ~2GB RAM (with current `shm_size: "2g"`)
- **Port Management**: Need dynamic port assignment and service discovery
- **Orchestration**: More complex to manage multiple browser instances

### WebSocket Communication:

- **Implementation Effort**: Need to implement WebSocket server and client code
- **Connection Management**: Handle WebSocket connection lifecycle, reconnection, etc.
- **Backward Compatibility**: Existing web tests would need to be updated

## Recommended Implementation Order

1. [ ] First implement WebSocket communication while keeping single Chromium instance
2. [ ] Test and validate WebSocket approach works correctly
3. [ ] Then implement multiple Chromium instances with connection management
4. [ ] Update test distribution logic to utilize multiple browser instances

This phased approach minimizes risk and allows validation of each component independently.
