/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import baseCompose from "./baseCompose";

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

  // Ensure all test services have restart: "no" explicitly
  for (const [serviceName, serviceConfig] of Object.entries(services)) {
    if (serviceName.includes("-example-") || serviceName.includes("-test-")) {
      // This is a test service
      serviceConfig.restart = "no";
      // Also ensure no health check
      delete serviceConfig.healthcheck;
    }
  }

  try {
    fs.writeFileSync(
      composeFilePath,
      yaml.dump(baseCompose(services, testsName), {
        lineWidth: -1,
        noRefs: true,
      })
    );
  } catch (err) {
    error(`Error writing compose file:`, err);
    throw err;
  }
}
