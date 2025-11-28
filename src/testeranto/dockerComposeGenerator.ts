import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { IBuiltConfig } from "../Types";
import { generateServices } from "./serviceGenerator";

export async function setupDockerCompose(
  config: IBuiltConfig,
  testsName: string
) {
  const services = generateServices(config, testsName);

  // Log the generated service names for debugging
  const serviceNames = Object.keys(services);
  console.log("Generated service names:", serviceNames);

  // Validate service names
  const invalidServiceNames = serviceNames.filter(
    (name) => !/^[a-z][a-z0-9_-]*$/.test(name)
  );
  if (invalidServiceNames.length > 0) {
    console.error("Invalid service names found:", invalidServiceNames);
    throw new Error(
      "Docker Compose service names must be lowercase and alphanumeric"
    );
  }

  const dump = {
    version: "3.8",
    services,
    // volumes: {
    //   metafiles: {
    //     driver: "local"
    //   }
    // },
    networks: {
      default: {
        name: `${testsName}_network`,
      },
    },
  };

  const composeDir = path.join("testeranto", "bundles");

  try {
    fs.mkdirSync(composeDir, { recursive: true });
    console.log(`Directory created or already exists: ${composeDir}`);
  } catch (error) {
    console.error(`Error creating directory ${composeDir}:`, error);
    throw error;
  }

  const composeFilePath = path.join(
    composeDir,
    `${testsName}-docker-compose.yml`
  );
  console.log(`Compose file path: ${composeFilePath}`);

  try {
    fs.writeFileSync(composeFilePath, yaml.dump(dump));
    console.log(`Docker Compose file written to: ${composeFilePath}`);
    console.log("Full path:", path.resolve(composeFilePath));
  } catch (error) {
    console.error(`Error writing compose file:`, error);
    throw error;
  }
}
