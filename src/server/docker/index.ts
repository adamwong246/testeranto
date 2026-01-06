import { golangDockerComposeFile } from "../runtimes/golang/docker";
import { nodeDockerComposeFile } from "../runtimes/node/docker";
import { pythonDockerComposeFile } from "../runtimes/python/docker";
import { webDockerCompose } from "../runtimes/web/docker";
import aiderPoolService from "./aiderPoolService";
// import chromiumService from "./chromiumService";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";
import { golangDockerFile } from "../runtimes/golang/docker";
import { nodeDockerFile } from "../runtimes/node/docker";
import { pythonDockerFile } from "../runtimes/python/docker";
import { webDockerFile } from "../runtimes/web/docker";

export const BaseCompose = (services) => {
  return {
    version: "3.8",
    services,
    volumes: {
      node_modules: {
        driver: "local",
      },
    },
    networks: {
      default: {
        name: "allTests_network",
      },
    },
  };
};

export async function writeComposeFile(
  services: Record<string, any>,
  testsName: string,
  composeDir: string,
  error: (...args: any[]) => void
) {
  const composeFilePath = path.join(
    composeDir,
    `${testsName}-docker-compose.yml`
  );

  try {
    fs.writeFileSync(
      composeFilePath,
      yaml.dump(BaseCompose(services), {
        lineWidth: -1,
        noRefs: true,
      })
    );
  } catch (err) {
    error(`Error writing compose file:`, err);
    throw err;
  }
}

const runtimes: IRunTime[] = ["node", "web", "golang", "python"];

function generateDockerfileContent(
  runtime: IRunTime,
  config: IBuiltConfig
): string {
  switch (runtime) {
    case "node":
      return nodeDockerFile;

    case "web":
      return webDockerFile;

    case "golang":
      return golangDockerFile;
    case "python":
      return pythonDockerFile;
    default:
      throw "unknown runtime";
  }
}

async function generateRuntimeDockerfiles(
  config: IBuiltConfig,
  runtimes: IRunTime[],
  composeDir: string,
  log: (...args: any[]) => void,
  error: (...args: any[]) => void
) {
  log(`Generating Dockerfiles for runtimes: ${runtimes.join(", ")}`);
  for (const runtime of runtimes) {
    const runtimeDockerfilePath = path.join(
      composeDir,
      "allTests",
      runtime,
      `${runtime}.Dockerfile`
    );

    log(
      `Creating directory for ${runtime} Dockerfile: ${path.dirname(
        runtimeDockerfilePath
      )}`
    );
    fs.mkdirSync(path.dirname(runtimeDockerfilePath), { recursive: true });

    log(`Generating ${runtime} Dockerfile at: ${runtimeDockerfilePath}`);

    // Generate actual Dockerfile content
    const dockerfileContent = generateDockerfileContent(runtime, config);

    fs.writeFileSync(runtimeDockerfilePath, dockerfileContent);
    log(`Generated ${runtime} Dockerfile successfully`);
  }
}

export async function setupDockerCompose(
  config: IBuiltConfig,
  testsName: string,
  options?: {
    logger?: {
      log: (...args: any[]) => void;
      error: (...args: any[]) => void;
    };
    dockerManPort?: number;
    webSocketPort?: number;
  }
) {
  const logger = options?.logger;
  // const dockerManPort = options?.dockerManPort;
  const webSocketPort = options?.webSocketPort;
  const log = logger?.log || console.log;
  const error = logger?.error || console.error;

  // Ensure testsName is valid
  if (!testsName || testsName.trim() === "") {
    testsName = "allTests";
    log(`WARNING: testsName was empty, using default: ${testsName}`);
  }

  // First, ensure all necessary directories exist
  const composeDir = path.join(process.cwd(), "testeranto", "bundles");

  try {
    // Setup directories
    fs.mkdirSync(composeDir, { recursive: true });

    // Generate Dockerfiles for each runtime
    await generateRuntimeDockerfiles(config, runtimes, composeDir, log, error);

    const services = await generateServices(
      config,
      runtimes,
      webSocketPort,
      log,
      error
    );

    await writeComposeFile(services, testsName, composeDir, error);
  } catch (err) {
    error(`Error in setupDockerCompose:`, err);
    throw err;
  }
}

export const ServiceConfig = (httpPort: number, chromiumPort: number) => ({
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
    PORT: chromiumPort.toString(),
  },
  healthcheck: {
    test: ["CMD", "curl", "-f", `http://localhost:${chromiumPort}/health`],
    interval: "10s",
    timeout: "10s",
    retries: 5,
    start_period: "30s",
  },
  networks: ["default"],
  depends_on: {},
});

// Configuration for test services (without port mappings)
export const testServiceConfig = (httpPort: number) => ({
  restart: "unless-stopped",
  shm_size: "2g",
  environment: {
    CONNECTION_TIMEOUT: "60000",
    MAX_CONCURRENT_SESSIONS: "10",
    ENABLE_CORS: "true",
    REMOTE_DEBUGGING_PORT: "9222",
    REMOTE_DEBUGGING_ADDRESS: "0.0.0.0",
    WS_PORT: httpPort.toString(),
    WS_HOST: "host.docker.internal",
  },
  healthcheck: {
    test: ["CMD", "curl", "-f", `http://localhost:${httpPort}/health`],
    interval: "10s",
    timeout: "10s",
    retries: 5,
    start_period: "30s",
  },
  networks: ["default"],
  depends_on: {},
});

export async function generateServices(
  config: IBuiltConfig,
  runtimes: IRunTime[],
  webSocketPort: number | undefined,
  log: (...args: any[]) => void,
  error: (...args: any[]) => void
): Promise<Record<string, any>> {
  const services: any = {};

  // Add Aider Pool service
  services["aider-pool"] = {
    ...aiderPoolService,
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
  }

  return services;
}
