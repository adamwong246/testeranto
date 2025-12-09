/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";

export async function generateTestServices(
  config: IBuiltConfig,
  runtimes: IRunTime[]
): Promise<Record<string, any>> {
  const services: any = {};

  for (const runtime of runtimes) {
    const tests = config[runtime]?.tests;
    if (!tests) continue;

    for (const [testPath, testConfig] of Object.entries(tests)) {
      // Skip creating test services for web (they run through Chromium)
      if (runtime === "web") {
        continue;
      }

      // Generate service name from test path
      const sanitizedTestPath = testPath
        .toLowerCase()
        .replace(/\//g, "-")
        .replace(/\./g, "-")
        .replace(/[^a-z0-9-]/g, "-");
      const serviceName = `${runtime}-${sanitizedTestPath}`;

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
      const serviceConfig: any = {
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
      };

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

      // Add chromium dependency for node and web tests
      if (runtime === "node" || runtime === "web") {
        serviceConfig.depends_on.chromium = {
          condition: "service_healthy",
        };
      }

      // Add monitoring configuration
      if (config.monitoring) {
        serviceConfig.environment.MONITORING_WS_PORT =
          config.httpPort.toString();
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
      if (runtime === "node") {
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

      // For Node runtime, we don't create separate test services
      // because we use the "Combined Build-and-Test Service with Process Pools" strategy
      if (runtime !== "web" && runtime !== "node") {
        services[serviceName] = serviceConfig;
      }
    }
  }

  return services;
}
