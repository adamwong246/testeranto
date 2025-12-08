import { IRunTime } from "../../Types";

export default (
  runtime: IRunTime,
  testPath: string,
  betterTestPath: string
) => [
  "sh",
  "-c",
  `echo "=== Starting test service for ${testPath} ==="
                echo "Bundle path: testeranto/bundles/allTests/${runtime}/${betterTestPath}"
                echo "Runtime: ${runtime}"
                echo "Test name: ${testPath}"
                echo "=== Environment variables ==="
                env | grep -E "TEST|DOCKERMAN|BUNDLES|METAFILES" || true
                echo "=== End environment variables ==="
                # Debug: Show DOCKERMAN_HOST and DOCKERMAN_PORT
                echo "DOCKERMAN_HOST='$DOCKERMAN_HOST'"
                echo "DOCKERMAN_PORT='$DOCKERMAN_PORT'"
                
                # Build service health is managed by Docker Compose depends_on
                echo "Build service ${runtime}-build health is managed by Docker Compose"
                
                # Get DockerMan port from environment variable
                if [ -z "$DOCKERMAN_PORT" ] || [ "$DOCKERMAN_PORT" = "0" ]; then
                  echo "ERROR: DOCKERMAN_PORT environment variable is not set or is 0"
                  echo "The DockerMan TCP server port must be passed via the DOCKERMAN_PORT environment variable."
                  echo "Make sure the TCP server is running and the port is passed to docker-compose."
                  exit 1
                fi
                echo "Using DockerMan port from environment variable: $DOCKERMAN_PORT"
                
                # Wait for the bundle file to exist (skip for golang since it uses source files directly)
                if [ "${runtime}" = "golang" ]; then
                  echo "Golang runtime detected: using source file directly, not waiting for bundle"
                  # Check if source file exists
                  if [ ! -f "${testPath}" ]; then
                    echo "ERROR: Source file not found at ${testPath}"
                    exit 1
                  fi
                  echo "Source file found: ${testPath}"
                else
                  echo "Waiting for bundle file: testeranto/bundles/allTests/${runtime}/${betterTestPath}"
                  MAX_BUNDLE_RETRIES=60
                  BUNDLE_RETRY_COUNT=0
                  while [ ! -f "testeranto/bundles/allTests/${runtime}/${betterTestPath}" ] && [ $BUNDLE_RETRY_COUNT -lt $MAX_BUNDLE_RETRIES ]; do
                    echo "Bundle not ready yet (attempt $((BUNDLE_RETRY_COUNT+1))/$MAX_BUNDLE_RETRIES)"
                    BUNDLE_RETRY_COUNT=$((BUNDLE_RETRY_COUNT+1))
                    sleep 2
                  done
                  
                  if [ ! -f "testeranto/bundles/allTests/${runtime}/${betterTestPath}" ]; then
                    echo "ERROR: Bundle file never appeared at testeranto/bundles/allTests/${runtime}/${betterTestPath}"
                    echo "The build service may have failed to create the bundle."
                    exit 1
                  fi
                  echo "Build is ready. Proceeding with test...";
                fi
                
                # Wait for DockerMan TCP server to be reachable
                # Ensure DOCKERMAN_HOST has a value
                if [ -z "$DOCKERMAN_HOST" ]; then
                  DOCKERMAN_HOST="host.docker.internal"
                  echo "DOCKERMAN_HOST was empty, using default: $DOCKERMAN_HOST"
                fi
                
                # Try multiple host options if the default doesn't work
                HOSTS_TO_TRY="$DOCKERMAN_HOST"
                # Add gateway IP for Linux containers
                GATEWAY_IP=$(ip route | grep default | awk '{print $3}' 2>/dev/null || echo "")
                if [ -n "$GATEWAY_IP" ]; then
                  HOSTS_TO_TRY="$HOSTS_TO_TRY $GATEWAY_IP"
                fi
                # Add docker host IP
                HOSTS_TO_TRY="$HOSTS_TO_TRY 172.17.0.1"
                
                echo "Waiting for DockerMan TCP server to be reachable on port $DOCKERMAN_PORT..."
                echo "Will try hosts: $HOSTS_TO_TRY"
                
                MAX_RETRIES=30
                RETRY_COUNT=0
                SUCCESS=0
                
                while [ $RETRY_COUNT -lt $MAX_RETRIES ] && [ $SUCCESS -eq 0 ]; do
                  for HOST in $HOSTS_TO_TRY; do
                    echo "Trying to connect to $HOST:$DOCKERMAN_PORT (attempt $((RETRY_COUNT+1))/$MAX_RETRIES)..."
                    # Try using netcat if available
                    if command -v nc >/dev/null 2>&1; then
                      if nc -z -w 1 "$HOST" "$DOCKERMAN_PORT" 2>/dev/null; then
                        echo "✅ DockerMan TCP server is reachable at $HOST:$DOCKERMAN_PORT (via nc)"
                        DOCKERMAN_HOST="$HOST"
                        SUCCESS=1
                        break
                      fi
                    # Fallback to /dev/tcp
                    elif (echo > "/dev/tcp/$HOST/$DOCKERMAN_PORT") &>/dev/null 2>&1; then
                      echo "✅ DockerMan TCP server is reachable at $HOST:$DOCKERMAN_PORT (via /dev/tcp)"
                      DOCKERMAN_HOST="$HOST"
                      SUCCESS=1
                      break
                    fi
                  done
                  
                  if [ $SUCCESS -eq 0 ]; then
                    echo "DockerMan TCP server not reachable yet (attempt $((RETRY_COUNT+1))/$MAX_RETRIES)"
                    RETRY_COUNT=$((RETRY_COUNT+1))
                    sleep 2
                  fi
                done
                
                if [ $SUCCESS -eq 0 ]; then
                  echo "ERROR: DockerMan TCP server never became reachable on port $DOCKERMAN_PORT"
                  echo "Tried hosts: $HOSTS_TO_TRY"
                  echo "Make sure the TCP server is running on the host and accessible from containers."
                  echo "On Linux, you may need to expose the port differently or use host networking."
                  exit 1
                fi
                
                echo "Using DockerMan host: $DOCKERMAN_HOST"
                
                # Run the test based on runtime
                echo "=== Running test ==="
                if [ "${runtime}" = "node" ]; then
                  echo "Executing: node testeranto/bundles/allTests/${runtime}/${betterTestPath}"
                  node testeranto/bundles/allTests/${runtime}/${betterTestPath}
                elif [ "${runtime}" = "golang" ]; then
                  # For golang, we need to compile and run the test program
                  # testPath is something like "src/example/Calculator.golingvu.test.go"
                  echo "Running golang (golingvu) test: ${testPath}"
                  
                  # First, check if we're in the right directory
                  echo "Current directory: $(pwd)"
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
                    TEST_DIR=$(dirname "${testPath}")
                    TEST_FILE=$(basename "${testPath}")
                    EXECUTABLE_NAME="/tmp/golang_test_$(echo ${testPath} | tr '/' '_' | tr '.' '_')"
                    
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
                elif [ "${runtime}" = "python" ]; then
                  echo "Executing: python ${testPath}"
                  python ${testPath}
                else
                  echo "ERROR: Unknown runtime: ${runtime}"
                  exit 1
                fi
                
                TEST_EXIT_CODE=$?
                echo "=== Test completed with exit code: $TEST_EXIT_CODE ==="
                exit $TEST_EXIT_CODE`,
];
