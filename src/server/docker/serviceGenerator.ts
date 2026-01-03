/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IBuiltConfig, IRunTime } from "../../Types";
import {
  golangDockerComposeFile,
  golangDockerFile,
} from "../runtimes/golang/docker";
import { nodeDockerComposeFile } from "../runtimes/node/docker";
import {
  pythonDockerComposeFile,
  pythonDockerFile,
} from "../runtimes/python/docker";
import { webDockerCompose } from "../runtimes/web/docker";

import aiderPoolService from "./aiderPoolService";
// import chromiumService from "./chromiumService";

export async function generateServices(
  config: IBuiltConfig,
  runtimes: IRunTime[],
  webSocketPort: number | undefined,
  log: (...args: any[]) => void,
  error: (...args: any[]) => void
): Promise<Record<string, any>> {
  const services: any = {};

  // Add Chromium service for web tests using browserless/chrome
  // const chromiumPort = config.chromiumPort || config.httpPort + 1;
  // services["chromium"] = chromiumService(config.httpPort, chromiumPort);

  // Add Aider Pool service
  services["aider-pool"] = {
    ...aiderPoolService,
    // Note: .aider.conf.yml is mounted as a volume in aiderPoolService.ts
    // It's not an environment variable file, so we don't use env_file here
  };

  // Ensure all services use the same network configuration
  for (const serviceName in services) {
    services[serviceName].networks = ["default"];
  }

  for (const runtime of runtimes) {
    if (runtime === "node") {
      services[`${runtime}-builder`] = nodeDockerComposeFile(config);
    } else if (runtime === "web") {
      services[`${runtime}-builder`] = webDockerCompose(config);
    } else if (runtime === "golang") {
      services[`${runtime}-builder`] = golangDockerComposeFile(config);
    } else if (runtime === "python") {
      services[`${runtime}-builder`] = pythonDockerComposeFile(config);
    } else {
      throw `unknown runtime ${runtime}`;
    }

    // Check if the runtime has tests in the config
    // const hasTests =
    //   config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
    // if (!hasTests) continue;

    // 1. Build Service
    // const buildServiceName = `${runtime}-build`;
    // const buildService = await import("./buildService");
    // const buildServiceConfig = buildService.default(runtime);

    // console.log("buildServiceConfig", runtime);

    // Add completion signal environment variable
    // if (!buildServiceConfig.environment) {
    //   buildServiceConfig.environment = {};
    // }
    // buildServiceConfig.environment.COMPLETION_SIGNAL_PATH = `/workspace/testeranto/metafiles/${runtime}/build_complete`;

    // services[buildServiceName] = buildServiceConfig;

    // // 2. Static Analysis Service
    // const analysisServiceName = `${runtime}-analysis`;
    // const analysisServiceConfig = await generateStaticAnalysisService(
    //   config,
    //   runtime
    // );
    // services[analysisServiceName] = analysisServiceConfig;

    // // 3. Process Pool Service
    // const processPoolServiceName = `${runtime}-process-pool`;
    // const processPoolServiceConfig = await generateProcessPoolService(
    //   config,
    //   runtime
    // );
    // services[processPoolServiceName] = processPoolServiceConfig;
  }

  return services;
}

// async function generateStaticAnalysisService(
//   config: IBuiltConfig,
//   runtime: IRunTime
// ): Promise<any> {
//   const runtimeInfo = getRuntimeInfo(runtime);

//   const serviceConfig: any = {
//     restart: "no",
//     environment: {
//       RUNTIME: runtime,
//       WS_HOST: "host.docker.internal",
//       WS_PORT: config.httpPort.toString(),
//       IN_DOCKER: "true",
//       COMPLETION_SIGNAL_PATH: `/workspace/testeranto/metafiles/${runtime}/analysis_complete`,
//     },
//     networks: ["default"],
//     image: runtimeInfo.image,
//     volumes: [
//       `${process.cwd()}:/workspace`,
//       "node_modules:/workspace/node_modules",
//     ],
//     working_dir: "/workspace",
//     depends_on: {
//       [`${runtime}-build`]: {
//         condition: "service_healthy",
//       },
//     },
//   };

//   // Add chromium dependency for web static analysis
//   if (runtime === "web") {
//     serviceConfig.depends_on.chromium = {
//       condition: "service_healthy",
//     };
//   }

//   // Generate analysis command
//   serviceConfig.command = generateAnalysisCommand(runtime, config);

//   return serviceConfig;
// }

// async function generateProcessPoolService(
//   config: IBuiltConfig,
//   runtime: IRunTime
// ): Promise<any> {
//   const runtimeInfo = getRuntimeInfo(runtime);
//   const processPoolType = getProcessPoolType(runtime);

//   const serviceConfig: any = {
//     restart: "unless-stopped",
//     environment: {
//       RUNTIME: runtime,
//       WS_HOST: "host.docker.internal",
//       WS_PORT: config.httpPort.toString(),
//       IN_DOCKER: "true",
//       PROCESS_POOL_TYPE: processPoolType,
//       MAX_CONCURRENT_TESTS:
//         config.processPool?.maxConcurrent?.toString() || "4",
//       TEST_TIMEOUT_MS: config.processPool?.timeoutMs?.toString() || "30000",
//     },
//     networks: ["default"],
//     image: runtimeInfo.image,
//     volumes: [
//       `${process.cwd()}:/workspace`,
//       "node_modules:/workspace/node_modules",
//     ],
//     working_dir: "/workspace",
//     depends_on: {
//       [`${runtime}-build`]: {
//         condition: "service_healthy",
//       },
//       [`${runtime}-analysis`]: {
//         condition: "service_completed_successfully",
//       },
//     },
//   };

//   // Add chromium dependency for web process pool
//   if (runtime === "web") {
//     serviceConfig.depends_on.chromium = {
//       condition: "service_healthy",
//     };
//   }

//   // Add Chrome-specific environment variables for web
//   if (runtime === "web") {
//     serviceConfig.environment.CHROME_MAX_CONTEXTS =
//       config.chrome?.maxContexts?.toString() || "6";
//     serviceConfig.environment.CHROME_MEMORY_LIMIT_MB =
//       config.chrome?.memoryLimitMB?.toString() || "512";
//   }

//   // Generate process pool command
//   serviceConfig.command = generateProcessPoolCommand(runtime, processPoolType);

//   return serviceConfig;
// }

// function generateAnalysisCommand(
//   runtime: IRunTime,
//   config: IBuiltConfig
// ): string[] {
//   const command = `
//     echo "=== Starting static analysis for ${runtime} ==="

//     # Wait for build to complete
//     echo "Waiting for build service to complete..."
//     while [ ! -f /workspace/testeranto/metafiles/${runtime}/build_complete ]; do
//       sleep 1
//     done

//     echo "Build complete. Running static analysis..."

//     # Run static analysis based on runtime
//     case "${runtime}" in
//       "node"|"web")
//         echo "Running Node.js/Web static analysis..."
//         # Check if there are any checks configured
//         if [ -n "$(echo '${JSON.stringify(
//           config.check || {}
//         )}' | grep -v '^[{}]*$')" ]; then
//           echo "User-defined checks found, running analysis..."
//           # Run analysis (simplified for now)
//           find /workspace/src -name "*.ts" -o -name "*.tsx" | head -5 | while read file; do
//             echo "Analyzing: \$file"
//           done
//         else
//           echo "No checks configured, skipping analysis."
//         fi
//         ;;
//       "python")
//         echo "Running Python static analysis..."
//         # Python analysis would go here
//         ;;
//       "golang")
//         echo "Running Go static analysis..."
//         # Go analysis would go here
//         ;;
//     esac

//     echo "Static analysis complete. Creating completion signal..."
//     touch /workspace/testeranto/metafiles/${runtime}/analysis_complete

//     echo "Analysis service complete. Keeping container alive..."
//     sleep 3600
//   `;

//   return ["sh", "-c", command];
// }

// function generateProcessPoolCommand(
//   runtime: IRunTime,
//   processPoolType: string
// ): string[] {
//   const command = `
//     echo "Starting ${runtime} process pool (type: ${processPoolType})..."

//     # Wait for build and analysis to complete
//     echo "Waiting for build and analysis services..."
//     while [ ! -f /workspace/testeranto/metafiles/${runtime}/build_complete ] ||
//           [ ! -f /workspace/testeranto/metafiles/${runtime}/analysis_complete ]; do
//       sleep 1
//     done

//     echo "Build and analysis complete. Starting process pool..."

//     # Create metafiles directory if it doesn't exist
//     mkdir -p /workspace/testeranto/metafiles/${runtime}

//     # Start the appropriate process pool manager
//     case "${processPoolType}" in
//       "lightweight")
//         echo "Starting lightweight process pool for ${runtime}..."
//         # For interpreted languages, we'll run tests directly
//         echo "Lightweight process pool ready for ${runtime}"
//         ;;
//       "binary")
//         echo "Starting binary process pool for ${runtime}..."
//         echo "Binary process pool ready for ${runtime}"
//         ;;
//       "shared-jvm")
//         echo "Starting shared JVM process pool..."
//         echo "Shared JVM process pool ready"
//         ;;
//       "shared-chrome")
//         echo "Starting shared Chrome process pool..."
//         echo "Shared Chrome process pool ready"
//         ;;
//     esac

//     echo "Process pool running. Waiting for test execution requests..."

//     # Keep container alive
//     while true; do
//       sleep 3600
//     done
//   `;

//   return ["sh", "-c", command];
// }

// // Helper function to get runtime info
// function getRuntimeInfo(runtime: string): any {
//   const runtimeName = runtime as RuntimeName;
//   if (RUNTIME_STRATEGIES[runtimeName]) {
//     return RUNTIME_STRATEGIES[runtimeName];
//   }
//   // Default fallback
//   return {
//     image: "alpine:latest",
//     processPoolType: "lightweight",
//   };
// }
