/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { IBuiltConfig, IRunTime } from "../Types";

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
  };

  const composeDir = path.join("testeranto", "bundles");
  console.log(`Compose directory: ${composeDir}`);
  console.log(`Current working directory: ${process.cwd()}`);

  // Ensure the directory exists
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

function generateDockerfile(
  c: IBuiltConfig,
  runtime: IRunTime,
  testName: string
): string {
  // Implementation from original file
  if (!c[runtime]?.dockerfile || !Array.isArray(c[runtime].dockerfile)) {
    console.error(`No valid dockerfile configuration found for ${runtime}`);
    return `# No dockerfile configuration for ${runtime}`;
  }

  console.log(
    `Dockerfile config for ${runtime}:`,
    JSON.stringify(c[runtime].dockerfile, null, 2)
  );

  let dockerfileInstructions: any[] = [];

  if (
    Array.isArray(c[runtime].dockerfile[0]) &&
    Array.isArray(c[runtime].dockerfile[0][0])
  ) {
    dockerfileInstructions = c[runtime].dockerfile[0];
  } else if (
    Array.isArray(c[runtime].dockerfile[0]) &&
    typeof c[runtime].dockerfile[0][0] === "string"
  ) {
    dockerfileInstructions = c[runtime].dockerfile;
  } else {
    console.error(`Unsupported dockerfile structure for ${runtime}`);
    return `# Unsupported dockerfile structure for ${runtime}`;
  }

  const dockerfileLines = dockerfileInstructions
    .map((line) => {
      if (Array.isArray(line)) {
        if (line[0] === "STATIC_ANALYSIS") {
          console.warn(
            `STATIC_ANALYSIS found but not implemented for ${runtime}-${testName}`
          );
          return "# STATIC_ANALYSIS - not implemented";
        } else {
          return `${line[0]} ${line[1]}`;
        }
      } else {
        console.warn(
          `Invalid dockerfile line format for ${runtime}-${testName}:`,
          line
        );
        return `# Invalid line: ${JSON.stringify(line)}`;
      }
    })
    .filter(
      (line) => line && !line.startsWith("# STATIC_ANALYSIS - not implemented")
    )
    .join("\n");

  console.log(`Generated Dockerfile for ${runtime}-${testName}:`);
  console.log(dockerfileLines);
  console.log("---");

  if (!dockerfileLines || dockerfileLines.trim().length === 0) {
    console.warn(
      `Generated empty Dockerfile for ${runtime}-${testName}, using fallback`
    );
    return `FROM ${
      runtime === "node"
        ? "node:latest"
        : runtime === "python"
        ? "python:latest"
        : runtime === "golang"
        ? "golang:latest"
        : "alpine:latest"
    }\nWORKDIR /app\nCOPY . .\n`;
  }

  return dockerfileLines;
}

function getCommandForRuntime(runtime: IRunTime, testName: string): string {
  switch (runtime) {
    case "node":
      return "echo 'Node test would run here'";
    case "web":
      return "echo 'Web test would run here'";
    case "python":
      return "echo 'Python test would run here'";
    case "golang":
      return "echo 'Golang test would run here'";
    default:
      return "echo 'Unknown runtime'";
  }
}

function generateServices(
  c: IBuiltConfig,
  testsName: string
): Record<string, any> {
  const services: Record<string, any> = {};
  const runtimes: IRunTime[] = ["node", "web", "golang", "python"];

  runtimes.forEach((runtime) => {
    if (c[runtime] && c[runtime].tests) {
      Object.keys(c[runtime].tests).forEach((testName) => {
        let sanitizedTestName = testName
          .replace(/[^a-zA-Z0-9]/g, "-")
          .toLowerCase();
        sanitizedTestName = sanitizedTestName.replace(/-+/g, "-");
        sanitizedTestName = sanitizedTestName.replace(/^-+|-+$/g, "");
        const serviceName = `${runtime}-${sanitizedTestName}`;

        const dockerfileContent = generateDockerfile(c, runtime, testName);
        const dockerfileName = "Dockerfile";
        const dockerfileDir = path.join(
          "testeranto",
          "bundles",
          testsName,
          runtime,
          testName
        );
        const dockerfilePath = path.join(dockerfileDir, dockerfileName);
        fs.mkdirSync(dockerfileDir, { recursive: true });
        fs.writeFileSync(dockerfilePath, dockerfileContent);

        console.log(`Service: ${serviceName}`);
        console.log(`  Dockerfile path: ${dockerfilePath}`);

        services[serviceName] = {
          build: {
            context: ".",
            dockerfile: path.join(dockerfileDir, dockerfileName),
          },
          command: getCommandForRuntime(runtime, testName),
        };
      });
    }
  });

  return services;
}
