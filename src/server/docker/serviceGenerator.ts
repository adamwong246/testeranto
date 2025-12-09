/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";
import buildService from "./buildService";
import chromiumService from "./chromiumService";
import { testServiceConfig } from "./serviceConfig";

export function createBuildService(
  runtime: IRunTime,
  dockerfileDir: string,
  testsName: string
): Record<string, any> {
  // Determine the Dockerfile path based on runtime
  let dockerfilePath: string;

  if (runtime === "node") {
    dockerfilePath = `testeranto/bundles/allTests/node/node.Dockerfile`;
  } else if (runtime === "web") {
    dockerfilePath = `testeranto/bundles/allTests/web/web.Dockerfile`;
  } else if (runtime === "golang") {
    dockerfilePath = `testeranto/bundles/allTests/golang/golang.Dockerfile`;
  } else if (runtime === "python") {
    dockerfilePath = `testeranto/bundles/allTests/python/python.Dockerfile`;
  } else {
    dockerfilePath = `${dockerfileDir}/Dockerfile`;
  }

  // Build the service configuration matching the old format (context: /Users/adam/Code/testeranto)
  const serviceConfig: any = {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: dockerfilePath,
    },
    volumes: ["./testeranto/metafiles:/workspace/testeranto/metafiles"],
    image: `bundles-${runtime}-build:latest`,
    restart: "no",
  };

  return {
    [`${runtime}-build`]: serviceConfig,
  };
}

export async function generateServices(
  config: IBuiltConfig,
  runtimes: IRunTime[],
  webSocketPort: number | undefined,
  log: (...args: any[]) => void,
  error: (...args: any[]) => void
): Promise<Record<string, any>> {
  const services: any = {};

  // Add Chromium service for web tests using browserless/chrome
  // Use httpPort for WebSocket and chromiumPort for the browser service
  // Since chromiumPort may not be in config, we can use httpPort + 1 or a default
  const chromiumPort = config.chromiumPort || config.httpPort + 1;
  services["chromium"] = chromiumService(config.httpPort, chromiumPort);

  // Ensure all services use the same network configuration
  // Use "default" network which has custom name "allTests_network" in baseCompose
  for (const serviceName in services) {
    services[serviceName].networks = ["default"];
  }

  // Add build services for each runtime
  for (const runtime of runtimes) {
    const buildServiceName = `${runtime}-build`;

    // Check if the runtime has tests in the config
    const hasTests =
      config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
    if (!hasTests) continue;

    // Get the base service configuration
    const serviceConfig = buildService(runtime);

    // For web build, we don't need to expose ports anymore
    // Server_TCP will serve the built files
    if (runtime === "web") {
      // Add dependency on chromium service, but don't require it to be healthy
      // The build service can start building while chromium is starting
      if (!serviceConfig.depends_on) {
        serviceConfig.depends_on = {};
      }
      serviceConfig.depends_on.chromium = {
        condition: "service_started", // Changed from "service_healthy"
      };
    }

    services[buildServiceName] = serviceConfig;
  }

  // Check services are not scheduled before tests - they can run independently
  // Removed check service generation to simplify Docker Compose

  // Add test services for each test
  // For web, we only create static analysis services, not test services
  // (Web tests run through Chromium service)
  for (const runtime of runtimes) {
    const tests = config[runtime]?.tests;
    if (!tests) continue;

    for (const [testPath, testConfig] of Object.entries(tests)) {
      // Skip creating test services for web (they run through Chromium)
      // But we still need static analysis services for web
      if (runtime === "web") {
        // We'll handle web static analysis services in the code below
        // Continue to create static analysis service but not test service
      }
      // Generate service name from test path
      // Docker requires lowercase names for images
      // Convert everything to lowercase and replace all non-alphanumeric characters with hyphens
      const sanitizedTestPath = testPath
        .toLowerCase()
        .replace(/\//g, "-")
        .replace(/\./g, "-")
        .replace(/[^a-z0-9-]/g, "-");
      const serviceName = `${runtime}-${sanitizedTestPath}`;

      // Extract test name without extension for display
      const testNameParts = testPath.split("/");
      const testFileName = testNameParts[testNameParts.length - 1];
      const testName = testFileName.replace(/\.[^/.]+$/, "");

      // Determine the bundle file extension based on runtime
      let betterTestPath = testPath;

      if (runtime === "node") {
        betterTestPath = testPath.replace(".ts", ".mjs");
      } else if (runtime === "web") {
        betterTestPath = testPath.replace(".ts", ".mjs");
      } else if (runtime === "golang") {
        // No change for golang
      } else if (runtime === "python") {
        // No change for python
      } else {
        throw "unknown runtime";
      }

      // Build service configuration for test services
      // Use testServiceConfig which doesn't have port mappings
      const serviceConfig: any = {
        restart: "no", // Don't restart on failure - we want to see the exit status
        shm_size: "2g",
        environment: {
          CONNECTION_TIMEOUT: "60000",
          MAX_CONCURRENT_SESSIONS: "10",
          ENABLE_CORS: "true",
          REMOTE_DEBUGGING_PORT: "9222",
          REMOTE_DEBUGGING_ADDRESS: "0.0.0.0",
          WS_PORT: config.httpPort.toString(),
          WS_HOST: "host.docker.internal",
          IN_DOCKER: "true",
        },
        networks: ["default"],
      };

      // Remove ports from test services to avoid conflicts
      // Test services only need internal communication within Docker network

      // Set build configuration to use the Dockerfile we created
      const dockerfileDir = path.join(
        "testeranto",
        "bundles",
        "allTests",
        runtime,
        path.dirname(testPath)
      );
      const dockerfilePath = path.join(dockerfileDir, "Dockerfile");

      serviceConfig.build = {
        context: process.cwd(),
        dockerfile: dockerfilePath,
      };

      // Add volumes to mount the project directory and node_modules
      serviceConfig.volumes = [
        `${process.cwd()}:/workspace`,
        "node_modules:/workspace/node_modules",
      ];

      // Set working directory to /workspace
      serviceConfig.working_dir = "/workspace";

      // Update depends_on to include the build service and chromium
      serviceConfig.depends_on = {
        [`${runtime}-build`]: {
          condition: "service_healthy",
        },
      };

      // Check services are not scheduled before tests - they can run independently
      // Removed dependencies on check services

      // Add chromium dependency for node and web tests
      if (runtime === "node" || runtime === "web") {
        serviceConfig.depends_on.chromium = {
          condition: "service_healthy",
        };
      }

      // Add WS_PORT and WS_HOST environment variables
      if (!serviceConfig.environment) {
        serviceConfig.environment = {};
      }
      // Always use httpPort for both HTTP and WebSocket
      serviceConfig.environment.WS_PORT = config.httpPort.toString();
      // Use host.docker.internal to reach the host machine from Docker containers
      serviceConfig.environment.WS_HOST = "host.docker.internal";
      // Indicate we're running in Docker
      serviceConfig.environment.IN_DOCKER = "true";

      // Add monitoring configuration
      if (config.monitoring) {
        serviceConfig.environment.MONITORING_WS_PORT = config.httpPort.toString();
        serviceConfig.environment.MONITORING_API_PORT =
          config.monitoring.apiPort?.toString() || "3003";
      }

      // Add category-specific monitoring flags
      if (runtime === "node" && config.node?.monitoring) {
        serviceConfig.environment.MONITOR_CAPTURE_CONSOLE =
          config.node.monitoring.captureConsole?.toString() || "true";
        serviceConfig.environment.MONITOR_CAPTURE_UNCAUGHT_EXCEPTIONS =
          config.node.monitoring.captureUncaughtExceptions?.toString() ||
          "true";
      } else if (runtime === "python" && config.python?.monitoring) {
        serviceConfig.environment.MONITOR_CAPTURE_PYTEST_OUTPUT =
          config.python.monitoring.capturePytestOutput?.toString() || "true";
        serviceConfig.environment.MONITOR_CAPTURE_LOGGING =
          config.python.monitoring.captureLogging?.toString() || "true";
      } else if (runtime === "golang" && config.golang?.monitoring) {
        serviceConfig.environment.MONITOR_CAPTURE_TEST_OUTPUT =
          config.golang.monitoring.captureTestOutput?.toString() || "true";
        serviceConfig.environment.MONITOR_CAPTURE_COVERAGE =
          config.golang.monitoring.captureCoverage?.toString() || "false";
      }

      // Add appropriate command based on runtime
      // Static analysis runs in separate parallel service for interpreted languages
      // For compiled languages, static analysis happens in build service
      if (runtime === "node") {
        // Node tests should run the built bundle
        const bundlePath = `/workspace/testeranto/bundles/allTests/${runtime}/${betterTestPath}`;
        serviceConfig.command = [
          "sh",
          "-c",
          `
          echo "=== Running Node.js BDD test ==="
          echo "Static analysis is running in parallel service"
          if [ -f "${bundlePath}" ]; then 
            node "${bundlePath}"
          else 
            echo "Bundle not found: ${bundlePath}"
            exit 1
          fi
          echo "BDD test completed, keeping container alive..."
          sleep 3600
        `,
        ];
      } else if (runtime === "golang") {
        // For Go, run tests in the specific directory
        const testDir = path.dirname(testPath);
        serviceConfig.command = [
          "sh",
          "-c",
          `
          echo "=== Running Go BDD test ==="
          echo "Static analysis was performed during build phase"
          cd /workspace/${testDir} && go test -v ./...
          echo "BDD test completed, keeping container alive..."
          sleep 3600
        `,
        ];
      } else if (runtime === "python") {
        // For Python, run pytest on the specific test file
        const fullTestPath = `/workspace/${betterTestPath}`;
        serviceConfig.command = [
          "sh",
          "-c",
          `
          echo "=== Running Python BDD test ==="
          echo "Static analysis is running in parallel service"
          if [ -f "${fullTestPath}" ]; then 
            python3 -m pytest "${fullTestPath}" -v
          else 
            echo "Test file not found: ${fullTestPath}"
            exit 1
          fi
          echo "BDD test completed, keeping container alive..."
          sleep 3600
        `,
        ];
      }

      // Remove health check for test services - they should run and exit
      // Don't add any health check

      // Only add test service for non-web runtimes
      // Web tests run through Chromium service, not as separate Docker services
      if (runtime !== "web") {
        services[serviceName] = serviceConfig;
      }

      // Create a parallel static analysis service for interpreted languages and web
      // (For compiled languages, static analysis happens in build service)
      if (runtime === "node" || runtime === "python" || runtime === "web") {
        const staticAnalysisServiceName = `${serviceName}-static-analysis`;
        const staticAnalysisServiceConfig: any = {
          restart: "no",
          shm_size: "2g",
          environment: {
            CONNECTION_TIMEOUT: "60000",
            MAX_CONCURRENT_SESSIONS: "10",
            ENABLE_CORS: "true",
            REMOTE_DEBUGGING_PORT: "9222",
            REMOTE_DEBUGGING_ADDRESS: "0.0.0.0",
            WS_PORT: config.httpPort.toString(),
            WS_HOST: "host.docker.internal",
            IN_DOCKER: "true",
          },
          networks: ["default"],
          image:
            runtime === "python" ? "python:3.11-alpine" : "node:20.19.4-alpine",
          volumes: [
            `${process.cwd()}:/workspace`,
            "node_modules:/workspace/node_modules",
          ],
          working_dir: "/workspace",
          depends_on: {
            [`${runtime}-build`]: {
              condition: "service_healthy",
            },
          },
        };

        // Add chromium dependency for node and web static analysis
        if (runtime === "node" || runtime === "web") {
          staticAnalysisServiceConfig.depends_on.chromium = {
            condition: "service_healthy",
          };
        }

        // Add monitoring configuration to static analysis services
        if (config.monitoring) {
          if (!staticAnalysisServiceConfig.environment) {
            staticAnalysisServiceConfig.environment = {};
          }
          // Always use httpPort for both HTTP and WebSocket
          staticAnalysisServiceConfig.environment.WS_PORT = config.httpPort.toString();
          staticAnalysisServiceConfig.environment.WS_HOST =
            "host.docker.internal";
          staticAnalysisServiceConfig.environment.IN_DOCKER = "true";
          staticAnalysisServiceConfig.environment.MONITORING_WS_PORT =
            config.httpPort.toString();
          staticAnalysisServiceConfig.environment.MONITORING_API_PORT =
            config.monitoring.apiPort?.toString() || "3003";
        }

        // Static analysis command based on runtime
        // Use the checks configuration from allTests.ts if available
        // For now, install necessary tools and run basic checks
        if (runtime === "node") {
          const sourcePath = `/workspace/${testPath}`;
          staticAnalysisServiceConfig.command = [
            "sh",
            "-c",
            `
            echo "=== Running Node.js static analysis ==="
            # Install npm if not available (alpine uses apk)
            if ! command -v npm &> /dev/null; then
              echo "Installing npm..."
              apk add --update npm 2>/dev/null || echo "npm installation may have failed"
            fi
            # Install ESLint and TypeScript if not available
            if [ -f "/workspace/package.json" ]; then
              echo "Installing dependencies from package.json..."
              cd /workspace && npm install --no-audit --no-fund --ignore-scripts 2>&1 | tail -5 || echo "npm install may have warnings"
            fi
            # Check for ESLint
            echo "Checking for ESLint..."
            if npx --no-install eslint --version 2>/dev/null; then
              echo "Running ESLint..."
              npx eslint "${sourcePath}" 2>&1 || echo "ESLint check completed"
            else
              echo "ESLint not available, skipping"
            fi
            # Check for TypeScript
            echo "Checking for TypeScript..."
            if npx --no-install tsc --version 2>/dev/null; then
              echo "Running TypeScript type check..."
              npx tsc --noEmit "${sourcePath}" 2>&1 || echo "TypeScript check completed"
            else
              echo "TypeScript not available, skipping"
            fi
            echo "Static analysis completed, keeping container alive..."
            sleep 3600
          `,
          ];
        } else if (runtime === "web") {
          const sourcePath = `/workspace/${testPath}`;
          staticAnalysisServiceConfig.command = [
            "sh",
            "-c",
            `
            echo "=== Running Web static analysis ==="
            # Install npm if not available
            if ! command -v npm &> /dev/null; then
              echo "Installing npm..."
              apk add --update npm 2>/dev/null || echo "npm installation may have failed"
            fi
            # Install dependencies
            if [ -f "/workspace/package.json" ]; then
              echo "Installing dependencies from package.json..."
              cd /workspace && npm install --no-audit --no-fund --ignore-scripts 2>&1 | tail -5 || echo "npm install may have warnings"
            fi
            # Check for ESLint
            echo "Checking for ESLint..."
            if npx --no-install eslint --version 2>/dev/null; then
              echo "Running ESLint..."
              npx eslint "${sourcePath}" 2>&1 || echo "ESLint check completed"
            else
              echo "ESLint not available, skipping"
            fi
            # Check for TypeScript
            echo "Checking for TypeScript..."
            if npx --no-install tsc --version 2>/dev/null; then
              echo "Running TypeScript type check..."
              npx tsc --noEmit "${sourcePath}" 2>&1 || echo "TypeScript check completed"
            else
              echo "TypeScript not available, skipping"
            fi
            # Check for stylelint
            echo "Checking for stylelint..."
            if npx --no-install stylelint --version 2>/dev/null; then
              echo "Running stylelint..."
              # Find CSS/SCSS files in the same directory
              find $(dirname "${sourcePath}") -name "*.css" -o -name "*.scss" 2>/dev/null | head -3 | while read cssFile; do
                if [ -f "$cssFile" ]; then
                  npx stylelint "$cssFile" 2>&1 || echo "stylelint check completed for $cssFile"
                fi
              done
            else
              echo "stylelint not available, skipping"
            fi
            echo "Static analysis completed, keeping container alive..."
            sleep 3600
          `,
          ];
        } else if (runtime === "python") {
          const sourcePath = `/workspace/${betterTestPath}`;
          staticAnalysisServiceConfig.command = [
            "sh",
            "-c",
            `
            echo "=== Running Python static analysis ==="
            # Install Python static analysis tools if not available
            echo "Installing Python static analysis tools..."
            pip install --quiet flake8 pylint mypy 2>/dev/null || echo "Tool installation may have failed"
            # Run flake8 if available
            if command -v flake8 &> /dev/null && [ -f "${sourcePath}" ]; then
              echo "Running flake8..."
              flake8 "${sourcePath}" 2>&1 || echo "flake8 completed"
            else
              echo "flake8 not available"
            fi
            # Run pylint if available
            if command -v pylint &> /dev/null && [ -f "${sourcePath}" ]; then
              echo "Running pylint..."
              pylint "${sourcePath}" 2>&1 || echo "pylint completed"
            else
              echo "pylint not available"
            fi
            # Run mypy if available
            if command -v mypy &> /dev/null && [ -f "${sourcePath}" ]; then
              echo "Running mypy..."
              mypy "${sourcePath}" 2>&1 || echo "mypy completed"
            else
              echo "mypy not available"
            fi
            echo "Static analysis completed, keeping container alive..."
            sleep 3600
          `,
          ];
        }

        services[staticAnalysisServiceName] = staticAnalysisServiceConfig;
      }
    }
  }

  return services;
}
