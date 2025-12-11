const golangScript = (testPath: string, betterTestPath: string) => `
echo "=== Starting test service for ${testPath} ==="
echo "Runtime: golang"
echo "Test name: ${testPath}"

# Build service health is managed by Docker Compose depends_on
echo "Build service golang-build health is managed by Docker Compose"

echo "Golang runtime detected: using source file directly, not waiting for bundle"
# Check if source file exists
if [ ! -f "${testPath}" ]; then
  echo "ERROR: Source file not found at ${testPath}"
  exit 1
fi
echo "Source file found: ${testPath}"

echo "=== Running test ==="
echo "Running golang (golingvu) test: ${testPath}"

# First, check if we're in the right directory
echo "Current directory: \$(pwd)"
echo "Checking if test file exists: ${testPath}"

if [ ! -f "${testPath}" ]; then
  echo "ERROR: Test file not found at ${testPath}"
  exit 1
fi

# Try to determine the best way to run this test
# Since it's a golingvu test, it might need special handling
# For now, try to run it with go run
echo "Attempting to run with: go run ${testPath}"
go run "${testPath}"
RUN_EXIT_CODE=$?

if [ $RUN_EXIT_CODE -eq 0 ]; then
  echo "Go run succeeded"
  exit 0
else
  echo "Go run failed with exit code: $RUN_EXIT_CODE"
  echo "Trying alternative approach..."
  
  # Try building and running as executable
  TEST_DIR=\$(dirname "${testPath}")
  TEST_FILE=\$(basename "${testPath}")
  EXECUTABLE_NAME="/tmp/golang_test_\$(echo ${testPath} | tr '/' '_' | tr '.' '_')"
  
  echo "Building in directory: $TEST_DIR"
  cd "$TEST_DIR" || { echo "ERROR: Failed to change to directory $TEST_DIR"; exit 1; }
  
  echo "Building: go build -o $EXECUTABLE_NAME $TEST_FILE"
  go build -o $EXECUTABLE_NAME $TEST_FILE
  
  if [ $? -eq 0 ]; then
    echo "Build successful, running: $EXECUTABLE_NAME"
    $EXECUTABLE_NAME
    BUILD_EXIT_CODE=$?
    echo "Executable exited with code: $BUILD_EXIT_CODE"
    exit $BUILD_EXIT_CODE
  else
    echo "ERROR: All attempts to run golang test failed"
    echo "This might be a golingvu test that requires special handling"
    exit 1
  fi
fi
`;
