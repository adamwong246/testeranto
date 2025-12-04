import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { IBuiltConfig } from "../../Types";
import { generateServices } from "./serviceGenerator";

export async function setupDockerCompose(
  config: IBuiltConfig,
  testsName: string,
  logger?: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
  }
) {
  const log = logger?.log || console.log;
  const error = logger?.error || console.error;

  // First, ensure all necessary directories exist
  const composeDir = path.join(process.cwd(), "testeranto", "bundles");
  const testBundleDir = path.join(composeDir, testsName);
  
  try {
    fs.mkdirSync(composeDir, { recursive: true });
    log(`Created directory: ${composeDir}`);
    
    // Also create the test-specific bundle directory
    fs.mkdirSync(testBundleDir, { recursive: true });
    log(`Created directory: ${testBundleDir}`);
  } catch (err) {
    error(`Error creating directories:`, err);
    throw err;
  }

  const services = generateServices(config, testsName, logger);
  const serviceNames = Object.keys(services);
  const invalidServiceNames = serviceNames.filter(
    (name) => !/^[a-z][a-z0-9_-]*$/.test(name)
  );
  if (invalidServiceNames.length > 0) {
    error("Invalid service names found:", invalidServiceNames);
    throw new Error(
      "Docker Compose service names must be lowercase and alphanumeric"
    );
  }

  const dump = {
    version: "3.8",
    services,
    networks: {
      default: {
        name: `${testsName}_network`,
      },
    },
  };

  const composeFilePath = path.join(
    composeDir,
    `${testsName}-docker-compose.yml`
  );

  try {
    fs.writeFileSync(composeFilePath, yaml.dump(dump));
    log(`Generated docker-compose file: ${composeFilePath}`);
  } catch (err) {
    error(`Error writing compose file:`, err);
    throw err;
  }
}
