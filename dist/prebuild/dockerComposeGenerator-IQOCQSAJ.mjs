import {
  baseNodeImage
} from "./chunk-D7FJV2YP.mjs";

// src/server/docker/dockerComposeGenerator.ts
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

// src/server/golang/golangDocker.ts
var golangDocker = `FROM golang:latest
WORKDIR /workspace
# Install Node.js and esbuild for Linux platform
RUN apt-get update && apt-get install -y nodejs npm
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional`;

// src/server/node/nodeDocker.ts
var nodeDocker = `FROM ${baseNodeImage}
WORKDIR /workspace
# Install libxml2-utils for xmllint and netcat-openbsd for network checks
RUN apk add --update --no-cache libxml2-utils netcat-openbsd
# Reinstall esbuild for Linux platform
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
`;

// src/server/python/pythonDocker.ts
var pythonDocker = `FROM python:latest
WORKDIR /workspace
# Install Node.js and esbuild for Linux platform
RUN apt-get update && apt-get install -y nodejs npm
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
`;

// src/server/web/webDocker.ts
var webDocker = `FROM ${baseNodeImage}
WORKDIR /workspace
# Install libxml2-utils for xmllint, netcat-openbsd for network checks, and Chromium for browser tests
RUN apk add --update --no-cache libxml2-utils netcat-openbsd chromium nss freetype freetype-dev harfbuzz ca-certificates ttf-freefont font-noto-emoji
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
# Reinstall esbuild for Linux platform
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
# Install puppeteer-core for browser automation
RUN npm install --no-save puppeteer-core --no-audit --no-fund --ignore-scripts --no-optional
`;

// src/server/docker/baseCompose.ts
var baseCompose_default = (services, testsName) => {
  return {
    version: "3.8",
    services,
    volumes: {
      node_modules: {
        driver: "local"
      }
    },
    networks: {
      default: {
        name: `${testsName}_network`
      }
    }
  };
};

// src/server/docker/buildService.ts
var buildService_default = (runtime) => {
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/${runtime}/${runtime}.Dockerfile`,
      tags: [`bundles-${runtime}-build:latest`],
      args: runtime === "node" ? {
        NODE_MJS_HASH: "cab84cac12fc3913ce45e7e53425b8bb"
      } : {}
    },
    volumes: [
      "../../src:/workspace/src:ro",
      "../../dist:/workspace/dist:ro",
      "../../testeranto:/workspace/testeranto",
      "../../package.json:/workspace/package.json:ro",
      "../../tsconfig.json:/workspace/tsconfig.json:ro",
      "../../allTests.ts:/workspace/allTests.ts:ro",
      "node_modules:/workspace/node_modules"
    ],
    image: `bundles-${runtime}-build:latest`,
    restart: "unless-stopped",
    environment: {
      BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/${runtime}`,
      METAFILES_DIR: `/workspace/testeranto/metafiles/${runtime}`,
      DOCKERMAN_PORT: "60593"
    },
    command: [
      "sh",
      "-c",
      `echo 'Starting ${runtime} build in watch mode...'; 
                echo 'Installing dependencies in /workspace/node_modules...'; 
                cd /workspace &&                 # Remove any .npmrc files
                rm -f .npmrc .npmrc.* || true &&                 # Clear npm cache and authentication
                npm cache clean --force &&                 # Clear any npm authentication
                npm config delete _auth 2>/dev/null || true &&                 npm config delete _authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true &&                 npm config delete always-auth 2>/dev/null || true &&                 npm config delete registry 2>/dev/null || true &&                 npm config set registry https://registry.npmjs.org/ &&                 npm config set always-auth false &&                 npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo "npm install may have warnings";
                echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...';
                npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild installation may have issues";
                npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild-sass-plugin installation may have issues";
                echo 'Creating output directory...'; 
                mkdir -p /workspace/testeranto/bundles/allTests/${runtime};
                mkdir -p /workspace/testeranto/metafiles/${runtime};
                echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
                # Create a dummy allTests.json to pass health check initially
                # echo '{"status":"building"}' > /workspace/testeranto/metafiles/${runtime}/allTests.json;
                # Run in watch mode and keep the process alive
                npx tsx dist/prebuild/server/builders/${runtime}.mjs allTests.ts dev || echo "Build process exited, but keeping container alive for health checks";
                # Keep the container running even if the build command exits
                while true; do
                  sleep 3600
                done`
    ],
    // command: [
    //   "sh",
    //   "-c",
    //   `echo 'Starting node build in watch mode...';
    //                     echo 'Installing dependencies in /workspace/node_modules...';
    //                     cd /workspace &&                 # Remove any .npmrc files
    //                     rm -f .npmrc .npmrc.* || true &&                 # Clear npm cache and authentication
    //                     npm cache clean --force &&                 # Clear any npm authentication
    //                     npm config delete _auth 2>/dev/null || true &&                 npm config delete _authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true &&                 npm config delete always-auth 2>/dev/null || true &&                 npm config delete registry 2>/dev/null || true &&                 npm config set registry https://registry.npmjs.org/ &&                 npm config set always-auth false &&                 npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo "npm install may have warnings";
    //                     echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...';
    //                     npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild installation may have issues";
    //                     npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild-sass-plugin installation may have issues";
    //                     echo 'Creating output directory...';
    //                     mkdir -p /workspace/testeranto/bundles/allTests/${runtime};
    //                     mkdir -p /workspace/testeranto/metafiles/${runtime};
    //                     echo 'BUNDLES_DIR env:' "$BUNDLES_DIR";
    //                     # Create a dummy allTests.json to pass health check initially
    //                     echo '{"status":"building"}' > /workspace/testeranto/metafiles/${runtime}/allTests.json;
    //                     # Run in watch mode and keep the process alive
    //                     npx tsx ${runtime}.mjs allTests.ts dev || echo "Build process exited, but keeping container alive for health checks";
    //                     # Keep the container running even if the build command exits
    //                     while true; do
    //                       sleep 3600
    //                     done`,
    // ],
    healthcheck: {
      test: [
        "CMD-SHELL",
        `[ -f /workspace/testeranto/metafiles/${runtime}/allTests.json ] && echo "healthy" || exit 1`
      ],
      interval: "10s",
      timeout: "30s",
      retries: 10,
      start_period: "60s"
    }
  };
};

// src/server/docker/chromiumService.ts
var chromiumService_default = {
  image: "browserless/chrome:latest",
  container_name: "chromium",
  restart: "unless-stopped",
  ports: ["3000:3000", "9222:9222"],
  shm_size: "2g",
  environment: {
    CONNECTION_TIMEOUT: "60000",
    MAX_CONCURRENT_SESSIONS: "10",
    ENABLE_CORS: "true",
    REMOTE_DEBUGGING_PORT: "9222",
    REMOTE_DEBUGGING_ADDRESS: "0.0.0.0"
  },
  healthcheck: {
    test: ["CMD", "curl", "-f", "http://localhost:3000/health"],
    interval: "10s",
    timeout: "10s",
    retries: 5,
    start_period: "30s"
  },
  networks: ["default"]
};

// src/server/docker/chromiumCommand.ts
var chromiumCommand = `
                # Wait for browserless/chrome to be ready
                echo "Waiting for browserless/chrome to be ready..."
                MAX_CHROMIUM_RETRIES=30
                CHROMIUM_RETRY_COUNT=0
                while [ $CHROMIUM_RETRY_COUNT -lt $MAX_CHROMIUM_RETRIES ]; do
                  if curl -s http://chromium:3000/health 2>/dev/null | grep -q '"ready":true'; then
                    echo "\u2705 browserless/chrome is ready"
                    break
                  fi
                  echo "browserless/chrome not ready yet (attempt $((CHROMIUM_RETRY_COUNT+1))/$MAX_CHROMIUM_RETRIES)"
                  CHROMIUM_RETRY_COUNT=$((CHROMIUM_RETRY_COUNT+1))
                  sleep 2
                done
                if [ $CHROMIUM_RETRY_COUNT -eq $MAX_CHROMIUM_RETRIES ]; then
                  echo "\u26A0\uFE0F browserless/chrome may not be fully ready, but proceeding anyway"
                fi
                `;

// src/server/docker/command.ts
var command = (testPath, runtime, betterTestPath) => `echo "=== Starting test service for ${testPath} ==="
                echo "Bundle path: testeranto/bundles/allTests/${runtime}/${betterTestPath}"
                echo "Runtime: ${runtime}"
                echo "Test name: ${testPath}"
                echo "=== Environment variables ==="
                env | grep -E "TEST|DOCKERMAN|BUNDLES|METAFILES|CHROMIUM" || true
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
                
                ${chromiumCommand}
                
                # Wait for the bundle file to exist
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
                        echo "\u2705 DockerMan TCP server is reachable at $HOST:$DOCKERMAN_PORT (via nc)"
                        DOCKERMAN_HOST="$HOST"
                        SUCCESS=1
                        break
                      fi
                    # Fallback to /dev/tcp
                    elif (echo > "/dev/tcp/$HOST/$DOCKERMAN_PORT") &>/dev/null 2>&1; then
                      echo "\u2705 DockerMan TCP server is reachable at $HOST:$DOCKERMAN_PORT (via /dev/tcp)"
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
                
                # Also check WebSocket server if port is provided
                if [ -n "$WEBSOCKET_PORT" ] && [ "$WEBSOCKET_PORT" != "0" ]; then
                  echo "Checking WebSocket server on port $WEBSOCKET_PORT..."
                  WS_SUCCESS=0
                  for HOST in $HOSTS_TO_TRY; do
                    echo "Trying WebSocket connection to $HOST:$WEBSOCKET_PORT..."
                    if command -v nc >/dev/null 2>&1; then
                      if nc -z -w 1 "$HOST" "$WEBSOCKET_PORT" 2>/dev/null; then
                        echo "\u2705 WebSocket server is reachable at $HOST:$WEBSOCKET_PORT"
                        WS_SUCCESS=1
                        break
                      fi
                    elif (echo > "/dev/tcp/$HOST/$WEBSOCKET_PORT") &>/dev/null 2>&1; then
                      echo "\u2705 WebSocket server is reachable at $HOST:$WEBSOCKET_PORT"
                      WS_SUCCESS=1
                      break
                    fi
                  done
                  if [ $WS_SUCCESS -eq 0 ]; then
                    echo "\u26A0\uFE0F WebSocket server may not be reachable, but continuing anyway"
                  fi
                fi
                
                # For web tests, we need to run in browser, not with Node directly
                # Create an HTML file that loads the test bundle
                echo "Creating HTML wrapper for web test..."
                HTML_FILE="/tmp/test_$$.html"
                cat > "$HTML_FILE" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Web Test: ${testPath}</title>
    <meta charset="utf-8">
</head>
<body>
    <div id="root"></div>
    <script type="module">
        // Import the test bundle
        import('./testeranto/bundles/allTests/${runtime}/${betterTestPath}?t=' + Date.now()).then(module => {
            // The test bundle should handle communication with WebSocket server
            if (module.default) {
                return module.default;
            }
            return module;
        }).catch(error => {
            console.error('Failed to load test module:', error);
            // Signal completion even on error
            window.__testComplete = true;
            window.__testError = error.message;
        });
    </script>
</body>
</html>
EOF
                
                echo "HTML wrapper created at: $HTML_FILE"
                
                # We need to run a Node script that uses Puppeteer to open the page
                # and communicate results back via WebSocket
                echo "=== Running web test in browser ==="
                echo "Creating browser test runner script..."
                
                RUNNER_SCRIPT="/tmp/runner_$$.mjs"
                cat > "$RUNNER_SCRIPT" << 'EOF'
import puppeteer from 'puppeteer-core';

const htmlFile = process.argv[2];
const testName = process.argv[3] || 'web-test';

async function run() {
    console.log('Connecting to Chromium...');
    
    try {
        // Connect to existing browserless/chrome via WebSocket
        // Try to get WebSocket URL from JSON endpoints
        let wsUrl;
        
        // Try port 9222 first (remote debugging port)
        try {
            const devToolsInfo = await fetch('http://chromium:9222/json/version');
            const data = await devToolsInfo.json();
            wsUrl = data.webSocketDebuggerUrl;
            console.log('Using WebSocket from port 9222:', wsUrl);
        } catch (error) {
            // Fallback to port 3000
            try {
                const devToolsInfo = await fetch('http://chromium:3000/json/version');
                const data = await devToolsInfo.json();
                wsUrl = data.webSocketDebuggerUrl;
                console.log('Using WebSocket from port 3000:', wsUrl);
            } catch (error) {
                // Fallback to direct WebSocket connection
                wsUrl = 'ws://chromium:3000';
                console.log('Using fallback WebSocket:', wsUrl);
            }
        }
        
        const browser = await puppeteer.connect({
            browserWSEndpoint: wsUrl,
            defaultViewport: null,
        });
        
        console.log('Connected to Chromium');
        
        const page = await browser.newPage();
        
        // Set up console logging
        page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            console.log('Browser ' + type + ': ' + text);
        });
        
        page.on('pageerror', error => {
            console.error('Browser page error: ' + error.message);
        });
        
        // Expose a function for the test to signal completion
        await page.exposeFunction('signalTestComplete', (success, results) => {
            console.log('Test completed: success=' + success + ', results=' + JSON.stringify(results));
            window.__testComplete = true;
            window.__testSuccess = success;
            window.__testResults = results;
        });
        
        // Navigate to the HTML file
        console.log('Navigating to file://' + htmlFile);
        await page.goto('file://' + htmlFile, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        // Wait for test completion - the test should signal completion
        console.log('Waiting for test completion (max 60 seconds)...');
        try {
            await page.waitForFunction(() => window.__testComplete === true, { 
                timeout: 60000,
                polling: 1000 
            });
            
            // Get test results
            const testSuccess = await page.evaluate(() => window.__testSuccess);
            const testResults = await page.evaluate(() => window.__testResults);
            
            if (testSuccess) {
                console.log('\u2705 Test passed: ' + testName);
            } else {
                console.log('\u274C Test failed: ' + testName);
                console.log('Results: ' + JSON.stringify(testResults));
            }
        } catch (waitError) {
            console.log('Test timeout or error waiting for completion:', waitError.message);
            // Check if there's an error
            const testError = await page.evaluate(() => window.__testError);
            if (testError) {
                console.error('Test error: ' + testError);
            }
        }
        
        // Close the page
        await page.close();
        
        // Don't close the browser since it's shared
        // await browser.close();
        
        console.log('Test execution finished');
        process.exit(0);
        
    } catch (error) {
        console.error('Failed to run web test:', error);
        process.exit(1);
    }
}

run().catch(err => {
    console.error('Test runner error:', err);
    process.exit(1);
});
EOF
                
                echo "Running browser test..."
                # Install puppeteer-core if not present
                if ! npm list puppeteer-core 2>/dev/null | grep -q puppeteer-core; then
                    echo "Installing puppeteer-core..."
                    npm install --no-save puppeteer-core --no-audit --no-fund --ignore-scripts --no-optional || echo "puppeteer-core installation may have issues"
                fi
                
                node "$RUNNER_SCRIPT" "$HTML_FILE" "${testPath}"
                
                TEST_EXIT_CODE=$?
                echo "=== Web test completed with exit code: $TEST_EXIT_CODE ==="
                exit $TEST_EXIT_CODE`;

// src/server/docker/generateWebTestCommand.ts
function generateWebTestCommand(runtime, testPath, betterTestPath) {
  return ["sh", "-c", command(testPath, runtime, betterTestPath)];
}

// src/server/docker/serviceConfig.ts
var serviceConfig_default = {
  image: "browserless/chrome:latest",
  container_name: "chromium",
  restart: "unless-stopped",
  ports: ["3000:3000", "9222:9222"],
  shm_size: "2g",
  environment: {
    CONNECTION_TIMEOUT: "60000",
    MAX_CONCURRENT_SESSIONS: "10",
    ENABLE_CORS: "true",
    REMOTE_DEBUGGING_PORT: "9222",
    REMOTE_DEBUGGING_ADDRESS: "0.0.0.0"
  },
  healthcheck: {
    test: ["CMD", "curl", "-f", "http://localhost:3000/health"],
    interval: "10s",
    timeout: "10s",
    retries: 5,
    start_period: "30s"
  },
  networks: ["default"],
  depends_on: {}
};

// src/server/docker/serviceConfigCommand.ts
var serviceConfigCommand_default = (runtime, testPath, betterTestPath) => [
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
                        echo "\u2705 DockerMan TCP server is reachable at $HOST:$DOCKERMAN_PORT (via nc)"
                        DOCKERMAN_HOST="$HOST"
                        SUCCESS=1
                        break
                      fi
                    # Fallback to /dev/tcp
                    elif (echo > "/dev/tcp/$HOST/$DOCKERMAN_PORT") &>/dev/null 2>&1; then
                      echo "\u2705 DockerMan TCP server is reachable at $HOST:$DOCKERMAN_PORT (via /dev/tcp)"
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
                exit $TEST_EXIT_CODE`
];

// src/server/docker/dockerComposeGenerator.ts
async function setupDockerCompose(config, testsName, options) {
  const logger = options?.logger;
  const dockerManPort = options?.dockerManPort;
  const webSocketPort = options?.webSocketPort;
  const log = logger?.log || console.log;
  const error = logger?.error || console.error;
  if (!testsName || testsName.trim() === "") {
    testsName = "allTests";
    log(`WARNING: testsName was empty, using default: ${testsName}`);
  }
  const runtimes = ["node", "web", "golang", "python"];
  const composeDir = path.join(process.cwd(), "testeranto", "bundles");
  try {
    fs.mkdirSync(composeDir, { recursive: true });
    log(`Created directory: ${composeDir}`);
    for (const runtime of runtimes) {
      const hasTests = config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
      if (hasTests) {
        const runtimeDir = path.join(composeDir, "allTests", runtime);
        fs.mkdirSync(runtimeDir, { recursive: true });
        log(`Created runtime directory: ${runtimeDir}`);
        const tests = config[runtime]?.tests;
        if (tests) {
          for (const testPath of Object.keys(tests)) {
            const testDirPath = path.dirname(testPath);
            const testDir = path.join(runtimeDir, testDirPath);
            fs.mkdirSync(testDir, { recursive: true });
            log(`Created test directory: ${testDir}`);
            const dockerfilePath = path.join(testDir, "Dockerfile");
            if (!fs.existsSync(dockerfilePath)) {
              let dockerfileContent = "";
              if (runtime === "node") {
                dockerfileContent = nodeDocker;
              } else if (runtime === "web") {
                dockerfileContent = webDocker;
              } else if (runtime === "golang") {
                dockerfileContent = golangDocker;
              } else if (runtime === "python") {
                dockerfileContent = pythonDocker;
              }
              if (dockerfileContent) {
                fs.writeFileSync(dockerfilePath, dockerfileContent);
                log(`Created Dockerfile at: ${dockerfilePath}`);
              }
            }
          }
        }
      }
    }
  } catch (err) {
    error(`Error creating directories:`, err);
    throw err;
  }
  for (const runtime of runtimes) {
    const hasTests = config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
    if (!hasTests)
      continue;
    const runtimeDockerfilePath = path.join(
      composeDir,
      "allTests",
      runtime,
      `${runtime}.Dockerfile`
    );
    fs.mkdirSync(path.dirname(runtimeDockerfilePath), { recursive: true });
    let dockerfileContent = "";
    if (runtime === "node") {
      dockerfileContent = `FROM ${baseNodeImage}
ARG TIMESTAMP
WORKDIR /workspace

# Install Python and build tools needed for npm packages with native addons
RUN apk add --update --no-cache python3 make g++ linux-headers libxml2-utils netcat-openbsd

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/${runtime}
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}
RUN mkdir -p /workspace/dist/prebuild/builders
RUN mkdir -p /workspace/dist/prebuild/builders
RUN mkdir -p /workspace/dist/prebuild/builders
RUN mkdir -p /workspace/dist/prebuild/builders

# Create a fresh node_modules directory in /workspace to avoid host platform binaries
WORKDIR /workspace
# Remove any .npmrc files that might contain authentication
RUN rm -f .npmrc .npmrc.* || true
# Clear npm cache and authentication
RUN npm cache clean --force
# Set npm registry to public and disable authentication
RUN npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
# Copy only package.json (not package-lock.json which might have private registry URLs)
COPY package.json ./
# Install without authentication prompts, scripts, audit, or fund
RUN npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional
# Ensure esbuild and esbuild-sass-plugin are installed for Linux
RUN npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
RUN npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional
# Install tsx for running TypeScript files
RUN npm list tsx 2>/dev/null || npm install --no-save tsx --no-audit --no-fund --ignore-scripts --no-optional

# Copy the builder file to the location expected by the old command
COPY dist/prebuild/server/builders/${runtime}.mjs ./dist/prebuild/builders/${runtime}.mjs
# Also copy to current directory for the new command
COPY dist/prebuild/server/builders/${runtime}.mjs ./${runtime}.mjs

# Default command (will be overridden by docker-compose)
CMD ["npx", "tsx", "${runtime}.mjs", "allTests.ts", "dev"]`;
    } else if (runtime === "web") {
      dockerfileContent = `FROM ${baseNodeImage}
ARG TIMESTAMP
WORKDIR /workspace

# Install Python, build tools, Chromium for web/Puppeteer, libxml2-utils for xmllint, and netcat-openbsd for network checks
RUN apk add --update --no-cache python3 make g++ linux-headers libxml2-utils netcat-openbsd \\
    chromium \\
    nss \\
    freetype \\
    freetype-dev \\
    harfbuzz \\
    ca-certificates \\
    ttf-freefont \\
    font-noto-emoji

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/${runtime}
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}

# Reinstall esbuild for the correct platform (Linux)
# Remove any existing esbuild binaries and reinstall for the container's platform
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
# Ensure esbuild-sass-plugin is installed for web runtime
RUN npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional
# Install tsx for running TypeScript files
RUN npm list tsx 2>/dev/null || npm install --no-save tsx --no-audit --no-fund --ignore-scripts --no-optional

# Copy the builder file
COPY dist/prebuild/server/builders/${runtime}.mjs ./${runtime}.mjs

# Default command (will be overridden by docker-compose)
CMD ["npx", "tsx", "${runtime}.mjs", "allTests.ts", "dev"]`;
    } else if (runtime === "golang") {
      dockerfileContent = `FROM golang:latest
WORKDIR /workspace

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/${runtime}
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}

# Install Node.js for running the builder
RUN apt-get update && apt-get install -y nodejs npm
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm install -g tsx --no-audit --no-fund --ignore-scripts --no-optional

# Install esbuild for the correct platform (Linux)
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional

# Copy the builder file
COPY dist/prebuild/server/builders/${runtime}.mjs ./${runtime}.mjs

# Default command (will be overridden by docker-compose)
CMD ["npx", "tsx", "${runtime}.mjs", "allTests.ts", "dev"]`;
    } else if (runtime === "python") {
      dockerfileContent = `FROM python:latest
WORKDIR /workspace

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/${runtime}
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}

# Install Node.js for running the builder
RUN apt-get update && apt-get install -y nodejs npm
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm install -g tsx --no-audit --no-fund --ignore-scripts --no-optional

# Install esbuild for the correct platform (Linux)
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional

# Copy the builder file
COPY dist/prebuild/server/builders/${runtime}.mjs ./${runtime}.mjs

# Default command (will be overridden by docker-compose)
CMD ["npx", "tsx", "${runtime}.mjs", "allTests.ts", "dev"]`;
    }
    fs.writeFileSync(runtimeDockerfilePath, dockerfileContent);
    log(`Created runtime Dockerfile at: ${runtimeDockerfilePath}`);
  }
  const services = {};
  services["chromium"] = chromiumService_default;
  for (const runtime of runtimes) {
    const buildServiceName = `${runtime}-build`;
    const hasTests = config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
    if (!hasTests)
      continue;
    services[buildServiceName] = buildService_default(runtime);
  }
  for (const runtime of runtimes) {
    const tests = config[runtime]?.tests;
    if (!tests)
      continue;
    for (const [testPath, testConfig] of Object.entries(tests)) {
      const sanitizedTestPath = testPath.toLowerCase().replace(/\//g, "-").replace(/\./g, "-").replace(/[^a-z0-9-]/g, "-");
      const serviceName = `${runtime}-${sanitizedTestPath}`;
      const testNameParts = testPath.split("/");
      const testFileName = testNameParts[testNameParts.length - 1];
      const testName = testFileName.replace(/\.[^/.]+$/, "");
      let betterTestPath = testPath;
      if (runtime === "node") {
        betterTestPath = testPath.replace(".ts", ".mjs");
      } else if (runtime === "web") {
        betterTestPath = testPath.replace(".ts", ".mjs");
      } else if (runtime === "golang") {
      } else if (runtime === "python") {
      } else {
        throw "unknown runtime";
      }
      const serviceConfig = { ...serviceConfig_default };
      delete serviceConfig.container_name;
      if (runtime === "web") {
        if (!serviceConfig.depends_on) {
          serviceConfig.depends_on = {};
        }
        serviceConfig.depends_on["chromium"] = {
          condition: "service_healthy"
        };
        if (!serviceConfig.environment) {
          serviceConfig.environment = {};
        }
        serviceConfig.environment["CHROMIUM_URL"] = "http://chromium:3000";
        serviceConfig.environment["CHROMIUM_VNC_URL"] = "http://localhost:7900";
        serviceConfig.command = generateWebTestCommand(
          runtime,
          testPath,
          betterTestPath
          // dockerManPort,
          // webSocketPort
        );
      } else {
        serviceConfig.command = serviceConfigCommand_default(
          runtime,
          testPath,
          betterTestPath
        );
      }
      services[serviceName] = serviceConfig;
    }
  }
  const composeFilePath = path.join(
    composeDir,
    `${testsName}-docker-compose.yml`
  );
  console.log(
    "baseCompose(services, testsName)",
    baseCompose_default(services, testsName)
  );
  try {
    fs.writeFileSync(
      composeFilePath,
      yaml.dump(baseCompose_default(services, testsName), {
        lineWidth: -1,
        noRefs: true
      })
    );
    log(`Generated docker-compose file: ${composeFilePath}`);
  } catch (err) {
    error(`Error writing compose file:`, err);
    throw err;
  }
}
export {
  setupDockerCompose
};
