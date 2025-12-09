import { chromiumCommand } from "./chromiumCommand";

export const command = (
  testPath,
  runtime,
  betterTestPath,
  chromiumPort = 3000
) => `echo "=== Starting test service for ${testPath} ==="
                echo "Bundle path: testeranto/bundles/allTests/${runtime}/${betterTestPath}"
                echo "Runtime: ${runtime}"
                echo "Test name: ${testPath}"
                
                # Build service health is managed by Docker Compose depends_on
                echo "Build service ${runtime}-build health is managed by Docker Compose"
                
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
                
                MAX_RETRIES=30
                RETRY_COUNT=0
                SUCCESS=0
                                
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


            // Fallback to configured chromium port
            try {
                const devToolsInfo = await fetch('http://chromium:${chromiumPort}/json/version');
                const data = await devToolsInfo.json();
                wsUrl = data.webSocketDebuggerUrl;
                console.log('Using WebSocket from chromium port ${chromiumPort}:', wsUrl);
            } catch (error) {
                // Fallback to direct WebSocket connection
                wsUrl = 'ws://chromium:${chromiumPort}';
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
