/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";
import { writeComposeFile } from "./composeWriter";
import { generateRuntimeDockerfiles } from "./runtimeDockerfileGenerator";
import { generateServices } from "./serviceGenerator";
// import { getStrategyForRuntime, getCategoryForRuntime } from "../strategies";

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
  const runtimes: IRunTime[] = ["node", "web", "golang", "python"];

  // Log strategy information for each runtime
  log("Generating docker-compose with strategies:");
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
    // await setupDirectories(config, runtimes, composeDir, log, error);

    fs.mkdirSync(composeDir, { recursive: true });

    // Generate runtime-specific Dockerfiles
    await generateRuntimeDockerfiles(config, runtimes, composeDir, log, error);

    // Generate services
    const services = await generateServices(
      config,
      runtimes,
      webSocketPort,
      log,
      error
    );

    // Write the compose file
    await writeComposeFile(services, testsName, composeDir, error);

    log(
      "Docker-compose generation complete with strategy-aware configurations"
    );
  } catch (err) {
    error(`Error in setupDockerCompose:`, err);
    throw err;
  }
}
