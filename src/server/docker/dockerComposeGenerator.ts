/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";
import { setupDirectories } from "./directorySetup";
import { generateRuntimeDockerfiles } from "./runtimeDockerfileGenerator";
import { generateServices } from "./serviceGenerator";
import { writeComposeFile } from "./composeWriter";

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
  const dockerManPort = options?.dockerManPort;
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

  // First, ensure all necessary directories exist
  const composeDir = path.join(process.cwd(), "testeranto", "bundles");
  
  try {
    // Setup directories
    await setupDirectories(config, runtimes, composeDir, log, error);
    
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
    
  } catch (err) {
    error(`Error in setupDockerCompose:`, err);
    throw err;
  }
}
