import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { IBuiltConfig } from "../../Types";
import { generateServices } from "./serviceGenerator";

export async function setupDockerCompose(
  config: IBuiltConfig,
  testsName: string
) {
  const services = generateServices(config, testsName);
  const serviceNames = Object.keys(services);
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
    networks: {
      default: {
        name: `${testsName}_network`,
      },
    },
  };

  const composeDir = path.join("testeranto", "bundles");

  try {
    fs.mkdirSync(composeDir, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${composeDir}:`, error);
    throw error;
  }

  const composeFilePath = path.join(
    composeDir,
    `${testsName}-docker-compose.yml`
  );

  try {
    fs.writeFileSync(composeFilePath, yaml.dump(dump));
  } catch (error) {
    console.error(`Error writing compose file:`, error);
    throw error;
  }
}
