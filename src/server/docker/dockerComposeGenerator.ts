import fs from "fs";
import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";
import { golangDockerFile } from "../runtimes/golang/docker";
import { nodeDockerFile } from "../runtimes/node/docker";
import { pythonDockerFile } from "../runtimes/python/docker";
import { webDockerFile } from "../runtimes/web/docker";
import { writeComposeFile } from "./composeWriter";
import { generateServices } from "./serviceGenerator";

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
