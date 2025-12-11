// src/server/strategies.ts
var RUNTIME_STRATEGIES = {
  // Interpreted languages
  node: {
    name: "node",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "node:20-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false
  },
  python: {
    name: "python",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "python:3.11-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false
  },
  ruby: {
    name: "ruby",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "ruby:3-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false
  },
  php: {
    name: "php",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "php:8.2-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false
  },
  // Compiled languages
  go: {
    name: "go",
    category: "compiled",
    strategy: "separate-build-combined-test",
    image: "golang:1.21-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: false
  },
  rust: {
    name: "rust",
    category: "compiled",
    strategy: "separate-build-combined-test",
    image: "rust:1.70-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: false
  },
  // VM languages
  java: {
    name: "java",
    category: "VM",
    strategy: "combined-service-shared-jvm",
    image: "openjdk:17-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: true
  },
  // Browser environment
  web: {
    name: "web",
    category: "chrome",
    strategy: "combined-service-shared-chrome",
    image: "node:20-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: true
  }
};
function getStrategyForRuntime(runtime) {
  const runtimeName = runtime;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].strategy;
  }
  return "combined-build-test-process-pools";
}
function getCategoryForRuntime(runtime) {
  const runtimeName = runtime;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].category;
  }
  return "interpreted";
}
function shouldUseProcessPool(runtime) {
  const runtimeName = runtime;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].processPool;
  }
  return false;
}
function shouldUseSharedInstance(runtime) {
  const runtimeName = runtime;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].sharedInstance;
  }
  return false;
}

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

// src/server/docker/buildServiceGenerator.ts
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
  const strategy = getStrategyForRuntime(runtime);
  const useProcessPool = shouldUseProcessPool(runtime);
  if (strategy === "combined-build-test-process-pools") {
    serviceConfig.command = [
      "sh",
      "-c",
      `echo "Building ${runtime} tests..." &&        npx tsx dist/prebuild/server/builders/${runtime}.mjs allTests.ts dev &&        echo "Build complete. ${runtime} tests are ready to run via process pools." &&        echo "Running a sample test to verify functionality..." &&        # Try to run one test file if it exists
       if [ "${runtime}" = "node" ]; then          if [ -f "/workspace/testeranto/bundles/allTests/node/example/Calculator.test.mjs" ]; then            echo "Found test file: Calculator.test.mjs" &&            echo "Running test with port 3456..." &&            cd /workspace &&            node /workspace/testeranto/bundles/allTests/node/example/Calculator.test.mjs 3456 '{}' &&            echo "Test execution completed.";          else            echo "No test file found at /workspace/testeranto/bundles/allTests/node/example/Calculator.test.mjs";          fi;        fi &&        echo "Waiting for additional test execution requests..." &&        # Keep container alive for health checks and to accept test execution requests
       # Tests will be run via docker exec from NodeLauncher.ts
       echo "Container is ready to run tests via 'docker exec bundles-${runtime}-build-1 ...'" &&        sleep infinity`
    ];
  } else if (strategy === "combined-service-shared-chrome") {
    serviceConfig.command = [
      "sh",
      "-c",
      `echo "Building web tests..." &&        npx tsx dist/prebuild/server/builders/web.mjs allTests.ts dev &&        echo "Running web tests with shared Chrome instance..." &&        # Web tests need Chrome to be available
       # Check if chromium service is healthy
       echo "Waiting for chromium service to be healthy..." &&        # For now, just keep container alive
       echo "Web tests would run here with shared Chrome. Keeping container alive..." &&        sleep infinity`
    ];
  } else if (strategy === "separate-build-combined-test") {
    serviceConfig.command = [
      "sh",
      "-c",
      `echo "Building ${runtime} binaries..." &&        npx tsx dist/prebuild/server/builders/${runtime}.mjs allTests.ts dev &&        echo "Build complete. Test binaries ready for separate test containers." &&        # Keep container alive for health checks
       sleep infinity`
    ];
  }
  return {
    [`${runtime}-build`]: serviceConfig
  };
}

// src/server/docker/testServiceGenerator.ts
import path from "path";
async function generateTestServices(config, runtimes) {
  const services = {};
  for (const runtime of runtimes) {
    const tests = config[runtime]?.tests;
    if (!tests)
      continue;
    for (const [testPath, testConfig] of Object.entries(tests)) {
      if (runtime === "web") {
        continue;
      }
      const sanitizedTestPath = testPath.toLowerCase().replace(/\//g, "-").replace(/\./g, "-").replace(/[^a-z0-9-]/g, "-");
      const serviceName = `${runtime}-${sanitizedTestPath}`;
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
      if (runtime !== "web" && runtime !== "node") {
        services[serviceName] = serviceConfig;
      }
    }
  }
  return services;
}

// src/server/docker/staticAnalysisServiceGenerator.ts
async function generateStaticAnalysisServices(config, runtimes) {
  const services = {};
  for (const runtime of runtimes) {
    const tests = config[runtime]?.tests;
    if (!tests)
      continue;
    for (const [testPath, testConfig] of Object.entries(tests)) {
      if (runtime !== "python" && runtime !== "web") {
        continue;
      }
      const sanitizedTestPath = testPath.toLowerCase().replace(/\//g, "-").replace(/\./g, "-").replace(/[^a-z0-9-]/g, "-");
      const serviceName = `${runtime}-${sanitizedTestPath}`;
      const staticAnalysisServiceName = `${serviceName}-static-analysis`;
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
      if (runtime === "web") {
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
  return services;
}

// src/server/docker/serviceGenerator.ts
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
    const buildService = await import("./buildService-TYCEDALS.mjs");
    const serviceConfig = buildService.default(runtime);
    const strategy = getStrategyForRuntime(runtime);
    const useSharedInstance = shouldUseSharedInstance(runtime);
    if (!serviceConfig.environment) {
      serviceConfig.environment = {};
    }
    serviceConfig.environment.STRATEGY = strategy;
    serviceConfig.environment.RUNTIME = runtime;
    switch (strategy) {
      case "combined-service-shared-chrome":
        if (!serviceConfig.depends_on) {
          serviceConfig.depends_on = {};
        }
        serviceConfig.depends_on.chromium = {
          condition: "service_healthy"
        };
        serviceConfig.environment.CHROME_MAX_CONTEXTS = config.chrome?.maxContexts?.toString() || "6";
        serviceConfig.environment.CHROME_MEMORY_LIMIT_MB = config.chrome?.memoryLimitMB?.toString() || "512";
        break;
      case "combined-build-test-process-pools":
        if (config.processPool) {
          serviceConfig.environment.MAX_CONCURRENT_PROCESSES = config.processPool.maxConcurrent?.toString() || "4";
          serviceConfig.environment.PROCESS_TIMEOUT_MS = config.processPool.timeoutMs?.toString() || "30000";
        }
        break;
      case "separate-build-combined-test":
        if (!serviceConfig.volumes) {
          serviceConfig.volumes = [];
        }
        serviceConfig.volumes.push("./testeranto/build-cache:/workspace/testeranto/build-cache");
        break;
    }
    if (useSharedInstance) {
      serviceConfig.environment.SHARED_INSTANCE = "true";
      if (!serviceConfig.restart || serviceConfig.restart === "no") {
        serviceConfig.restart = "unless-stopped";
      }
    }
    services[buildServiceName] = serviceConfig;
  }
  const testServices = await generateTestServices(config, runtimes);
  const filteredTestServices = {};
  for (const [serviceName, serviceConfig] of Object.entries(testServices)) {
    let foundRuntime = null;
    for (const runtime of runtimes) {
      if (serviceName.includes(runtime)) {
        foundRuntime = runtime;
        break;
      }
    }
    if (foundRuntime) {
      const strategy = getStrategyForRuntime(foundRuntime);
      if (strategy === "separate-build-combined-test") {
        if (!serviceConfig.environment) {
          serviceConfig.environment = {};
        }
        serviceConfig.environment.STRATEGY = strategy;
        serviceConfig.environment.RUNTIME = foundRuntime;
        if (!serviceConfig.depends_on) {
          serviceConfig.depends_on = {};
        }
        serviceConfig.depends_on[`${foundRuntime}-build`] = {
          condition: "service_healthy"
        };
        filteredTestServices[serviceName] = serviceConfig;
      }
    }
  }
  Object.assign(services, filteredTestServices);
  const staticAnalysisServices = await generateStaticAnalysisServices(config, runtimes);
  Object.assign(services, staticAnalysisServices);
  return services;
}

// src/server/nodeVersion.ts
var version = "20.19.4";
var baseNodeImage = `node:${version}-alpine`;

export {
  baseNodeImage,
  getStrategyForRuntime,
  getCategoryForRuntime,
  createBuildService,
  generateServices
};
