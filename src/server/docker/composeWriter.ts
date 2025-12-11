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
  console.log("mark8", services);
  const composeFilePath = path.join(
    composeDir,
    `${testsName}-docker-compose.yml`
  );

  // Ensure all test services have restart: "no" explicitly
  // for (const [serviceName, serviceConfig] of Object.entries(services)) {
  //   console.log("mark1", serviceName);
  //   // if (serviceName.includes("-example-") || serviceName.includes("-test-")) {
  //   //   // This is a test service
  //   //   serviceConfig.restart = "no";
  //   //   // Also ensure no health check
  //   //   delete serviceConfig.healthcheck;
  //   // }
  //   services[serviceName] = "";
  // }

  console.log("docker-compose writting to: ", services);
  try {
    fs.writeFileSync(
      composeFilePath,
      yaml.dump(baseCompose(services), {
        lineWidth: -1,
        noRefs: true,
      })
    );
  } catch (err) {
    error(`Error writing compose file:`, err);
    throw err;
  }
}
