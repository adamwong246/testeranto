import { command } from "./command";

export function generateWebTestCommand(
  runtime: string,
  testPath: string,
  betterTestPath: string,
  dockerManPort?: number,
  webSocketPort?: number
): string[] {
  // For web runtime, we connect directly to browserless/chrome service
  // No need to start a separate WebSocket server
  if (runtime === "web") {
    return [
      "sh",
      "-c",
      `
      # Set environment variables for connecting to chromium service
      export CHROME_HOST=chromium
      export CHROME_PORT=9222
      export IN_DOCKER=true
      # Also set for Node.js process
      export IN_DOCKER=true
      
      # First, wait for chromium hostname to be resolvable
      echo "Waiting for chromium hostname to be resolvable..."
      timeout 120 sh -c '
        while ! nslookup chromium 2>/dev/null; do
          echo "Chromium hostname not resolvable yet, waiting..."
          sleep 3
        done
        echo "Chromium hostname is now resolvable"
      ' || echo "DNS resolution check timed out, continuing..."
      
      # Then wait for chromium service to be healthy
      echo "Waiting for chromium service to be healthy..."
      timeout 120 sh -c '
        while ! curl -f http://chromium:3000/health 2>/dev/null; do
          echo "Chromium health check failed, waiting..."
          sleep 5
        done
        echo "Chromium is healthy"
      ' || echo "Chromium health check may have timed out, continuing anyway..."
      
      # Run the test command
      echo "Running web test command..."
      ${command(testPath, runtime, betterTestPath)}
      `
    ];
  }
  // For other runtimes, use the original command
  return ["sh", "-c", command(testPath, runtime, betterTestPath)];
}
