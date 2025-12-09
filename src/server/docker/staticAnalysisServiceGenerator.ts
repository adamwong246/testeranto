/* eslint-disable @typescript-eslint/no-explicit-any */

import { IBuiltConfig, IRunTime } from "../../Types";

export async function generateStaticAnalysisServices(
  config: IBuiltConfig,
  runtimes: IRunTime[]
): Promise<Record<string, any>> {
  const services: any = {};

  for (const runtime of runtimes) {
    const tests = config[runtime]?.tests;
    if (!tests) continue;

    for (const [testPath, testConfig] of Object.entries(tests)) {
      // Create static analysis services only for python and web runtimes
      if (runtime !== "python" && runtime !== "web") {
        continue;
      }

      // Generate service name from test path
      const sanitizedTestPath = testPath
        .toLowerCase()
        .replace(/\//g, "-")
        .replace(/\./g, "-")
        .replace(/[^a-z0-9-]/g, "-");
      const serviceName = `${runtime}-${sanitizedTestPath}`;
      const staticAnalysisServiceName = `${serviceName}-static-analysis`;

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

      // Add chromium dependency for web static analysis
      if (runtime === "web") {
        staticAnalysisServiceConfig.depends_on.chromium = {
          condition: "service_healthy",
        };
      }

      // Add monitoring configuration to static analysis services
      if (config.monitoring) {
        if (!staticAnalysisServiceConfig.environment) {
          staticAnalysisServiceConfig.environment = {};
        }
        staticAnalysisServiceConfig.environment.WS_PORT =
          config.httpPort.toString();
        staticAnalysisServiceConfig.environment.WS_HOST = "host.docker.internal";
        staticAnalysisServiceConfig.environment.IN_DOCKER = "true";
        staticAnalysisServiceConfig.environment.MONITORING_WS_PORT =
          config.httpPort.toString();
        staticAnalysisServiceConfig.environment.MONITORING_API_PORT =
          config.monitoring.apiPort?.toString() || "3003";
      }

      // Static analysis command based on runtime
      if (runtime === "web") {
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

  return services;
}
