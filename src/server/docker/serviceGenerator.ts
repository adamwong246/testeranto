/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  services["chromium"] = chromiumService;
  
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
        condition: "service_started"  // Changed from "service_healthy"
      };
    }
    
    services[buildServiceName] = serviceConfig;
  }

  // Add test services for each test, but skip web tests
  // Web tests should all run through the single Chromium service
  for (const runtime of runtimes) {
    const tests = config[runtime]?.tests;
    if (!tests) continue;

    // Skip creating services for web tests
    // Web tests will run through the Chromium service's API/web interface
    if (runtime === "web") {
      continue;
    }

    for (const [testPath, testConfig] of Object.entries(tests)) {
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
      } else if (runtime === "golang") {
        // No change for golang
      } else if (runtime === "python") {
        // No change for python
      } else {
        throw "unknown runtime";
      }

      // Build service configuration for test services
      // Use testServiceConfig which doesn't have port mappings
      const serviceConfig: any = { ...testServiceConfig };

      // Always remove container_name for test services to avoid conflicts
      // Docker Compose will generate unique names automatically
      delete serviceConfig.container_name;

      // Remove image field if present, we'll use build instead
      delete serviceConfig.image;

      // Remove ports from test services to avoid conflicts
      // Test services only need internal communication within Docker network
      delete serviceConfig.ports;

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

      // Add WS_PORT and WS_HOST environment variables
      if (!serviceConfig.environment) {
        serviceConfig.environment = {};
      }
      // Default to 3002 to match Server_TCP default HTTP_PORT
      serviceConfig.environment.WS_PORT = webSocketPort?.toString() || "3002";
      // Use host.docker.internal to reach the host machine from Docker containers
      serviceConfig.environment.WS_HOST = "host.docker.internal";
      // Indicate we're running in Docker
      serviceConfig.environment.IN_DOCKER = "true";

      services[serviceName] = serviceConfig;
    }
  }

  return services;
}
