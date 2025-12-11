export const pythonScript = (testPath: string, betterTestPath: string) => `
echo "=== Starting test service for ${testPath} ==="
echo "Runtime: python"
echo "Test name: ${testPath}"

# Build service health is managed by Docker Compose depends_on
echo "Build service python-build health is managed by Docker Compose"

echo "Waiting for bundle file: testeranto/bundles/allTests/python/${betterTestPath}"
MAX_BUNDLE_RETRIES=60
BUNDLE_RETRY_COUNT=0
while [ ! -f "testeranto/bundles/allTests/python/${betterTestPath}" ] && [ $BUNDLE_RETRY_COUNT -lt $MAX_BUNDLE_RETRIES ]; do
  echo "Bundle not ready yet (attempt $((BUNDLE_RETRY_COUNT+1))/$MAX_BUNDLE_RETRIES)"
  BUNDLE_RETRY_COUNT=$((BUNDLE_RETRY_COUNT+1))
  sleep 2
done

if [ ! -f "testeranto/bundles/allTests/python/${betterTestPath}" ]; then
  echo "ERROR: Bundle file never appeared at testeranto/bundles/allTests/python/${betterTestPath}"
  echo "The build service may have failed to create the bundle."
  exit 1
fi
echo "Build is ready. Proceeding with test..."

echo "=== Running test ==="
echo "Executing: python ${testPath}"
python ${testPath}

TEST_EXIT_CODE=$?
echo "=== Test completed with exit code: $TEST_EXIT_CODE ==="
exit $TEST_EXIT_CODE
`;
