// src/server/docker/serviceGenerator.ts
import path from "path";

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
      "/Users/adam/Code/testeranto:/workspace",
      "node_modules:/workspace/node_modules"
    ],
    image: `bundles-${runtime}-build:latest`,
    restart: "unless-stopped",
    environment: {
      BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/${runtime}`,
      METAFILES_DIR: `/workspace/testeranto/metafiles/${runtime}`,
      // Don't serve files - Server_TCP will handle that
      ESBUILD_SERVE_PORT: "0",
      // Disable esbuild serve
      IN_DOCKER: "true"
      // Indicate we're running in Docker
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
                # Don't fail if chromium isn't ready yet - the build can still proceed
                echo "Starting build process for ${runtime}..."
                npx tsx dist/prebuild/server/builders/${runtime}.mjs allTests.ts dev || echo "Build process exited with code $?, but keeping container alive for health checks";
                # Keep the container running even if the build command exits
                echo "Build process finished, keeping container alive..."
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
var chromiumService_default = (httpPort, chromiumPort) => ({
  image: "browserless/chrome:latest",
  container_name: "chromium",
  restart: "unless-stopped",
  ports: [`${chromiumPort}:${chromiumPort}`, "9222:9222"],
  shm_size: "2g",
  environment: {
    CONNECTION_TIMEOUT: "60000",
    MAX_CONCURRENT_SESSIONS: "10",
    ENABLE_CORS: "true",
    REMOTE_DEBUGGING_PORT: "9222",
    REMOTE_DEBUGGING_ADDRESS: "0.0.0.0",
    PORT: chromiumPort.toString()
  },
  healthcheck: {
    test: ["CMD", "curl", "-f", `http://localhost:${chromiumPort}/health`],
    interval: "10s",
    timeout: "10s",
    retries: 30,
    start_period: "120s"
  },
  networks: ["default"]
});

// src/server/docker/serviceGenerator.ts
function createBuildService(runtime, dockerfileDir, testsName) {
  let dockerfilePath;
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
  const serviceConfig = {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: dockerfilePath
    },
    volumes: ["./testeranto/metafiles:/workspace/testeranto/metafiles"],
    image: `bundles-${runtime}-build:latest`,
    restart: "no"
  };
  return {
    [`${runtime}-build`]: serviceConfig
  };
}
async function generateServices(config, runtimes, webSocketPort, log, error) {
  const services = {};
  const chromiumPort = config.chromiumPort || config.httpPort + 1;
  services["chromium"] = chromiumService_default(config.httpPort, chromiumPort);
  for (const serviceName in services) {
    services[serviceName].networks = ["default"];
  }
  for (const runtime of runtimes) {
    const buildServiceName = `${runtime}-build`;
    const hasTests = config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
    if (!hasTests)
      continue;
    const serviceConfig = buildService_default(runtime);
    if (runtime === "web") {
      if (!serviceConfig.depends_on) {
        serviceConfig.depends_on = {};
      }
      serviceConfig.depends_on.chromium = {
        condition: "service_started"
        // Changed from "service_healthy"
      };
    }
    services[buildServiceName] = serviceConfig;
  }
  for (const runtime of runtimes) {
    const tests = config[runtime]?.tests;
    if (!tests)
      continue;
    for (const [testPath, testConfig] of Object.entries(tests)) {
      if (runtime === "web") {
      }
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
      const serviceConfig = {
        restart: "no",
        // Don't restart on failure - we want to see the exit status
        shm_size: "2g",
        environment: {
          CONNECTION_TIMEOUT: "60000",
          MAX_CONCURRENT_SESSIONS: "10",
          ENABLE_CORS: "true",
          REMOTE_DEBUGGING_PORT: "9222",
          REMOTE_DEBUGGING_ADDRESS: "0.0.0.0",
          WS_PORT: config.httpPort.toString(),
          WS_HOST: "host.docker.internal",
          IN_DOCKER: "true"
        },
        networks: ["default"]
      };
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
        dockerfile: dockerfilePath
      };
      serviceConfig.volumes = [
        `${process.cwd()}:/workspace`,
        "node_modules:/workspace/node_modules"
      ];
      serviceConfig.working_dir = "/workspace";
      serviceConfig.depends_on = {
        [`${runtime}-build`]: {
          condition: "service_healthy"
        }
      };
      if (runtime === "node" || runtime === "web") {
        serviceConfig.depends_on.chromium = {
          condition: "service_healthy"
        };
      }
      if (!serviceConfig.environment) {
        serviceConfig.environment = {};
      }
      serviceConfig.environment.WS_PORT = config.httpPort.toString();
      serviceConfig.environment.WS_HOST = "host.docker.internal";
      serviceConfig.environment.IN_DOCKER = "true";
      if (config.monitoring) {
        serviceConfig.environment.MONITORING_WS_PORT = config.httpPort.toString();
        serviceConfig.environment.MONITORING_API_PORT = config.monitoring.apiPort?.toString() || "3003";
      }
      if (runtime === "node" && config.node?.monitoring) {
        serviceConfig.environment.MONITOR_CAPTURE_CONSOLE = config.node.monitoring.captureConsole?.toString() || "true";
        serviceConfig.environment.MONITOR_CAPTURE_UNCAUGHT_EXCEPTIONS = config.node.monitoring.captureUncaughtExceptions?.toString() || "true";
      } else if (runtime === "python" && config.python?.monitoring) {
        serviceConfig.environment.MONITOR_CAPTURE_PYTEST_OUTPUT = config.python.monitoring.capturePytestOutput?.toString() || "true";
        serviceConfig.environment.MONITOR_CAPTURE_LOGGING = config.python.monitoring.captureLogging?.toString() || "true";
      } else if (runtime === "golang" && config.golang?.monitoring) {
        serviceConfig.environment.MONITOR_CAPTURE_TEST_OUTPUT = config.golang.monitoring.captureTestOutput?.toString() || "true";
        serviceConfig.environment.MONITOR_CAPTURE_COVERAGE = config.golang.monitoring.captureCoverage?.toString() || "false";
      }
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
        `
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
        `
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
        `
        ];
      }
      if (runtime !== "web") {
        services[serviceName] = serviceConfig;
      }
      if (runtime === "node" || runtime === "python" || runtime === "web") {
        const staticAnalysisServiceName = `${serviceName}-static-analysis`;
        const staticAnalysisServiceConfig = {
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
            IN_DOCKER: "true"
          },
          networks: ["default"],
          image: runtime === "python" ? "python:3.11-alpine" : "node:20.19.4-alpine",
          volumes: [
            `${process.cwd()}:/workspace`,
            "node_modules:/workspace/node_modules"
          ],
          working_dir: "/workspace",
          depends_on: {
            [`${runtime}-build`]: {
              condition: "service_healthy"
            }
          }
        };
        if (runtime === "node" || runtime === "web") {
          staticAnalysisServiceConfig.depends_on.chromium = {
            condition: "service_healthy"
          };
        }
        if (config.monitoring) {
          if (!staticAnalysisServiceConfig.environment) {
            staticAnalysisServiceConfig.environment = {};
          }
          staticAnalysisServiceConfig.environment.WS_PORT = config.httpPort.toString();
          staticAnalysisServiceConfig.environment.WS_HOST = "host.docker.internal";
          staticAnalysisServiceConfig.environment.IN_DOCKER = "true";
          staticAnalysisServiceConfig.environment.MONITORING_WS_PORT = config.httpPort.toString();
          staticAnalysisServiceConfig.environment.MONITORING_API_PORT = config.monitoring.apiPort?.toString() || "3003";
        }
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
          `
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
          `
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
          `
          ];
        }
        services[staticAnalysisServiceName] = staticAnalysisServiceConfig;
      }
    }
  }
  return services;
}

// src/server/nodeVersion.ts
var version = "20.19.4";
var baseNodeImage = `node:${version}-alpine`;

export {
  baseNodeImage,
  createBuildService,
  generateServices
};
