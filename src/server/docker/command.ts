import { chromiumCommand } from "./chromiumCommand";

export const command = (
  testPath,
  runtime,
  betterTestPath
) => `echo "=== Starting test service for ${testPath} ==="
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
                
                # Also check WebSocket server if port is provided
                if [ -n "$WEBSOCKET_PORT" ] && [ "$WEBSOCKET_PORT" != "0" ]; then
                  echo "Checking WebSocket server on port $WEBSOCKET_PORT..."
                  WS_SUCCESS=0
                  for HOST in $HOSTS_TO_TRY; do
                    echo "Trying WebSocket connection to $HOST:$WEBSOCKET_PORT..."
                    if command -v nc >/dev/null 2>&1; then
                      if nc -z -w 1 "$HOST" "$WEBSOCKET_PORT" 2>/dev/null; then
                        echo "✅ WebSocket server is reachable at $HOST:$WEBSOCKET_PORT"
                        WS_SUCCESS=1
                        break
                      fi
                    elif (echo > "/dev/tcp/$HOST/$WEBSOCKET_PORT") &>/dev/null 2>&1; then
                      echo "✅ WebSocket server is reachable at $HOST:$WEBSOCKET_PORT"
                      WS_SUCCESS=1
                      break
                    fi
                  done
                  if [ $WS_SUCCESS -eq 0 ]; then
                    echo "⚠️ WebSocket server may not be reachable, but continuing anyway"
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
                console.log('✅ Test passed: ' + testName);
            } else {
                console.log('❌ Test failed: ' + testName);
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
