// export const nodeScript = (
//   testPath: string,
//   betterTestPath: string,
//   webSocketPort: string = "3000"
// ) => `
// echo "=== Starting test service for ${testPath} ==="
// echo "Bundle path: testeranto/bundles/allTests/node/${betterTestPath}"
// echo "Runtime: node"
// echo "Test name: ${testPath}"
// echo "WebSocket port: ${webSocketPort}"

// # Build service health is managed by Docker Compose depends_on
// echo "Build service node-build health is managed by Docker Compose"

// echo "Waiting for bundle file: testeranto/bundles/allTests/node/${betterTestPath}"
// MAX_BUNDLE_RETRIES=60
// BUNDLE_RETRY_COUNT=0
// while [ ! -f "testeranto/bundles/allTests/node/${betterTestPath}" ] && [ $BUNDLE_RETRY_COUNT -lt $MAX_BUNDLE_RETRIES ]; do
//   echo "Bundle not ready yet (attempt $((BUNDLE_RETRY_COUNT+1))/$MAX_BUNDLE_RETRIES)"
//   BUNDLE_RETRY_COUNT=$((BUNDLE_RETRY_COUNT+1))
//   sleep 2
// done

// echo "Build is ready. Proceeding with test..."
// echo "Running command: node testeranto/bundles/allTests/node/${betterTestPath} ${webSocketPort} '{\"name\":\"node-test\",\"fs\":\"/workspace\",\"ports\":[],\"browserWSEndpoint\":\"\",\"timeout\":30000,\"retries\":3}'"
// node testeranto/bundles/allTests/node/${betterTestPath} ${webSocketPort} '{"name":"node-test","fs":"/workspace","ports":[],"browserWSEndpoint":"","timeout":30000,"retries":3}'

// TEST_EXIT_CODE=$?
// echo "=== Test completed with exit code: $TEST_EXIT_CODE ==="
// exit $TEST_EXIT_CODE
// `;
