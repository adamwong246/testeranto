/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { IBuiltConfig, IRunTime } from "../../Types";
import { golangDockerFile } from "../runtimes/golang/golangDocker";
import { nodeDockerFile } from "../runtimes/node/nodeDocker";
import { pythonDockerFile } from "../runtimes/python/pythonDocker";
import { webDockerFile } from "../runtimes/web/webDocker";
import { writeComposeFile } from "./composeWriter";
import { generateServices } from "./serviceGenerator";

const runtimes: IRunTime[] = ["node", "web", "golang", "python"];

const dockerfiles: Record<IRunTime, (runtime: IRunTime) => object> = {
  node: nodeDockerFile,
  web: webDockerFile,
  golang: golangDockerFile,
  python: pythonDockerFile,
};

async function generateRuntimeDockerfiles(
  config: IBuiltConfig,
  runtimes: IRunTime[],
  composeDir: string,
  log: (...args: any[]) => void,
  error: (...args: any[]) => void
) {
  for (const runtime of runtimes) {
    const runtimeDockerfilePath = path.join(
      composeDir,
      "allTests",
      runtime,
      `${runtime}.Dockerfile`
    );

    fs.mkdirSync(path.dirname(runtimeDockerfilePath), { recursive: true });

    fs.writeFileSync(
      runtimeDockerfilePath,
      yaml.dump(dockerfiles[runtime](runtime), {
        lineWidth: -1,
        noRefs: true,
      })
    );
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

  // Define runtimes once at the beginning

  // Log strategy information for each runtime
  // log("Generating docker-compose with strategies:");
  // for (const runtime of runtimes) {
  //   const strategy = getStrategyForRuntime(runtime);
  //   const category = getCategoryForRuntime(runtime);
  //   log(`  ${runtime}: ${category} -> ${strategy}`);

  //   // Log whether tests run in build container or separate containers
  //   if (strategy === "separate-build-combined-test") {
  //     log(`    -> Separate test containers for compiled language`);
  //   } else {
  //     log(`    -> Tests run within build container`);
  //   }
  // }

  // First, ensure all necessary directories exist
  const composeDir = path.join(process.cwd(), "testeranto", "bundles");

  try {
    // Setup directories

    fs.mkdirSync(composeDir, { recursive: true });

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
