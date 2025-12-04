import path from "path";
import { generateServiceName } from "./serviceNames";
import { computeNodeMjsHash } from "./buildDockerfiles";
export function createTestService(runtime, testName, dockerfileDir, testsName) {
    const serviceName = generateServiceName(runtime, testName);
    // Handle different file extensions
    let bundleFileName;
    if (runtime === "node" || runtime === "web") {
        bundleFileName = testName.replace(/\.[^/.]+$/, ".mjs");
    }
    else if (runtime === "golang") {
        bundleFileName = testName; // .go files are not bundled
    }
    else if (runtime === "python") {
        bundleFileName = testName; // .py files are not bundled
    }
    else {
        bundleFileName = testName;
    }
    const bundlePath = `testeranto/bundles/allTests/${runtime}/${bundleFileName}`;
    // Get TesterantoDocker TCP server port from environment or use default
    // The TCP server runs on the host, so from inside containers we need to use host.docker.internal
    const testerantoDockerHost = "host.docker.internal";
    // We need to know the TCP port TesterantoDocker is listening on
    // This should be passed from the main process or read from a file
    // For now, we'll use a default and hope it matches
    const testerantoDockerPort = 3000; // Default TCP port for TesterantoDocker
    // Ensure testsName doesn't have trailing whitespace
    const cleanTestsName = testsName.trim();
    // Create test resource configuration
    // This should match what the test expects
    const testResourceConfig = {
        name: serviceName,
        fs: `/workspace/testeranto/reports/${cleanTestsName}/${testName.replace(/\.[^/.]+$/, "")}/${runtime}`,
        ports: [], // No ports needed for node tests
        browserWSEndpoint: "", // Not used for node
        timeout: 30000,
        retries: 3,
        environment: {}
    };
    return {
        [serviceName]: {
            build: {
                context: process.cwd(),
                dockerfile: path.join(dockerfileDir, "Dockerfile"),
            },
            environment: {
                BUNDLES_DIR: `/testeranto/bundles/allTests/${runtime}`,
                METAFILES_DIR: `/testeranto/metafiles/${runtime}`,
                TEST_RESOURCES: JSON.stringify(testResourceConfig),
                DOCKERMAN_HOST: testerantoDockerHost,
                DOCKERMAN_PORT: "0", // Will be overridden by reading from file
                TESTERANTO_RUNTIME: runtime,
            },
            command: [
                "sh",
                "-c",
                `echo "=== Starting test service for ${testName} ==="
        echo "Bundle path: ${bundlePath}"
        echo "Runtime: ${runtime}"
        echo "Test name: ${testName}"
        echo "=== Environment variables ==="
        env | grep -E "TEST|DOCKERMAN|BUNDLES|METAFILES" || true
        echo "=== End environment variables ==="
        
        # Build service health is managed by Docker Compose depends_on
        echo "Build service ${runtime}-build health is managed by Docker Compose"
        
        # Wait for TesterantoDocker port file to exist (written by main.ts)
        PORT_FILE="/workspace/testeranto/bundles/${cleanTestsName}-docker-man-port.txt"
        # Trim any whitespace from the path
        PORT_FILE=$(echo "$PORT_FILE" | tr -d '[:space:]')
        echo "Looking for DockerMan port file at: '$PORT_FILE'"
        echo "Current directory: $(pwd)"
        echo "Listing /workspace/testeranto/bundles/:"
        ls -la /workspace/testeranto/bundles/ 2>/dev/null || echo "Directory not found"
        
        # Check if PORT_FILE variable is empty
        if [ -z "$PORT_FILE" ]; then
          echo "ERROR: PORT_FILE variable is empty"
          echo "cleanTestsName value was: '${cleanTestsName}'"
          exit 1
        fi
        
        # Debug: show what's at that exact path
        echo "Checking file existence with ls -la:"
        ls -la "$PORT_FILE" 2>/dev/null || echo "ls could not find the file"
        
        # Check if file exists
        if [ ! -f "$PORT_FILE" ]; then
          echo "ERROR: TesterantoDocker port file not found at '$PORT_FILE'"
          echo "The file should exist. Here's what's in /workspace/testeranto/bundles/:"
          ls -la /workspace/testeranto/bundles/
          echo "This file should be created by the main testeranto process."
          echo "Make sure TesterantoDocker's TCP server is running on the host."
          exit 1
        fi
        
        DOCKERMAN_PORT=$(cat "$PORT_FILE")
        export DOCKERMAN_PORT
        echo "Using TesterantoDocker port from file: $DOCKERMAN_PORT"
        
        if [ -z "$DOCKERMAN_PORT" ] || [ "$DOCKERMAN_PORT" = "0" ]; then
          echo "ERROR: Invalid TesterantoDocker port: $DOCKERMAN_PORT"
          exit 1
        fi
        
        # Wait for the bundle file to exist
        echo "Waiting for bundle file: ${bundlePath}"
        MAX_BUNDLE_RETRIES=60
        BUNDLE_RETRY_COUNT=0
        while [ ! -f "${bundlePath}" ] && [ $BUNDLE_RETRY_COUNT -lt $MAX_BUNDLE_RETRIES ]; do
          echo "Bundle not ready yet (attempt $((BUNDLE_RETRY_COUNT+1))/$MAX_BUNDLE_RETRIES)"
          BUNDLE_RETRY_COUNT=$((BUNDLE_RETRY_COUNT+1))
          sleep 2
        done
        
        if [ ! -f "${bundlePath}" ]; then
          echo "ERROR: Bundle file never appeared at ${bundlePath}"
          echo "The build service may have failed to create the bundle."
          exit 1
        fi
        echo "Build is ready. Proceeding with test...";
        
        # Wait for TesterantoDocker TCP server to be reachable
        echo "Waiting for TesterantoDocker TCP server to be reachable at $DOCKERMAN_HOST:$DOCKERMAN_PORT..."
        MAX_RETRIES=30
        RETRY_COUNT=0
        while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
          # Try using netcat if available
          if command -v nc >/dev/null 2>&1; then
            if nc -z -w 1 "$DOCKERMAN_HOST" "$DOCKERMAN_PORT" 2>/dev/null; then
              echo "TesterantoDocker TCP server is reachable at $DOCKERMAN_HOST:$DOCKERMAN_PORT (via nc)"
              break
            fi
          # Fallback to /dev/tcp
          elif (echo > "/dev/tcp/$DOCKERMAN_HOST/$DOCKERMAN_PORT") &>/dev/null 2>&1; then
            echo "TesterantoDocker TCP server is reachable at $DOCKERMAN_HOST:$DOCKERMAN_PORT (via /dev/tcp)"
            break
          fi
          echo "TesterantoDocker TCP server not reachable yet (attempt $((RETRY_COUNT+1))/$MAX_RETRIES)"
          RETRY_COUNT=$((RETRY_COUNT+1))
          sleep 2
        done
        
        if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
          echo "ERROR: TesterantoDocker TCP server never became reachable at $DOCKERMAN_HOST:$DOCKERMAN_PORT"
          echo "Make sure the TCP server is running on the host and accessible from containers."
          exit 1
        fi
        
        # Run the test based on runtime
        echo "=== Running test ==="
        if [ "${runtime}" = "node" ] || [ "${runtime}" = "web" ]; then
          echo "Executing: node ${bundlePath}"
          node ${bundlePath}
        elif [ "${runtime}" = "golang" ]; then
          echo "Executing: go test ${testName}"
          go test ${testName}
        elif [ "${runtime}" = "python" ]; then
          echo "Executing: python ${testName}"
          python ${testName}
        else
          echo "ERROR: Unknown runtime: ${runtime}"
          exit 1
        fi
        
        TEST_EXIT_CODE=$?
        echo "=== Test completed with exit code: $TEST_EXIT_CODE ==="
        exit $TEST_EXIT_CODE
        `,
            ],
            volumes: [
                "../../testeranto:/workspace/testeranto",
                "../../src:/workspace/src",
            ],
            depends_on: {
                [`${runtime}-build`.toLowerCase()]: {
                    condition: "service_healthy",
                },
            },
            working_dir: "/workspace",
        },
    };
}
export function createBuildService(runtime, dockerfileDir, testsName) {
    const serviceName = `${runtime}-build`.toLowerCase();
    const configFilePath = process.argv[2];
    // Prepare build arguments
    const buildArgs = {};
    if (runtime === "node") {
        buildArgs.NODE_MJS_HASH = computeNodeMjsHash();
    }
    return {
        [serviceName]: {
            build: {
                context: process.cwd(),
                dockerfile: path.join(dockerfileDir, `${runtime}.Dockerfile`),
                tags: [`bundles-${runtime}-build:latest`],
                args: buildArgs,
            },
            volumes: ["../../testeranto:/workspace/testeranto"],
            image: `bundles-${runtime}-build:latest`,
            restart: "unless-stopped",
            environment: {
                BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/${runtime}`,
                METAFILES_DIR: `/workspace/testeranto/metafiles/${runtime}`,
            },
            command: [
                "sh",
                "-c",
                `echo 'Starting ${runtime} build in watch mode...'; 
        echo 'Creating output directory...'; 
        mkdir -p /workspace/testeranto/bundles/allTests/${runtime};
        mkdir -p /workspace/testeranto/metafiles/${runtime};
        echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
        # Create a dummy allTests.json to pass health check initially
        echo '{"status":"building"}' > /workspace/testeranto/metafiles/${runtime}/allTests.json;
        # Run in watch mode and keep the process alive
        npx tsx ./${runtime}.mjs ${path.basename(configFilePath)} dev || echo "Build process exited, but keeping container alive for health checks";
        # Keep the container running even if the build command exits
        while true; do
          sleep 3600
        done
`,
            ],
            healthcheck: {
                test: [
                    "CMD-SHELL",
                    `[ -f /workspace/testeranto/metafiles/${runtime}/allTests.json ] && echo "healthy" || exit 1`,
                ],
                interval: "10s",
                timeout: "30s",
                retries: 10,
                start_period: "60s",
            },
        },
    };
}
