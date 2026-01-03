/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { IBuiltConfig, IRunTime } from "../../Types";
import { golangDockerFile } from "../runtimes/golang/golangDocker";
import nodeDockerFile from "../runtimes/node/dockerfile";
import { pythonDockerFile } from "../runtimes/python/pythonDocker";
import webDockerFile from "../runtimes/web/dockerfile";
import { writeComposeFile } from "./composeWriter";
import { generateServices } from "./serviceGenerator";

const runtimes: IRunTime[] = ["node", "web", "golang", "python"];

// // Keep this for service generation in serviceGenerator.ts
// const dockerfiles: Record<IRunTime, (config: IBuiltConfig) => object> = {
//   node: nodeDockerFile,
//   web: webDockerFile,
//   golang: golangDockerFile,
//   python: pythonDockerFile,
// };

// Function to generate actual Dockerfile content for each runtime
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
      return `FROM golang:1.21-alpine
WORKDIR /workspace
COPY . .
RUN mkdir -p /workspace/testeranto/bundles/allTests/golang
RUN mkdir -p /workspace/testeranto/metafiles/golang
EXPOSE 3456
ENV BUNDLES_DIR=/workspace/testeranto/bundles/allTests/golang
ENV METAFILES_DIR=/workspace/testeranto/metafiles/golang
ENV IN_DOCKER=true
CMD ["sh", "-c", "echo 'Go build container ready'; \\
                    mkdir -p /workspace/testeranto/bundles/allTests/golang; \\
                    mkdir -p /workspace/testeranto/metafiles/golang; \\
                    tail -f /dev/null"]`;

    case "python":
      return `FROM python:3.11-alpine
WORKDIR /workspace
COPY . .
RUN pip install --no-cache-dir pytest
RUN mkdir -p /workspace/testeranto/bundles/allTests/python
RUN mkdir -p /workspace/testeranto/metafiles/python
EXPOSE 3456
ENV BUNDLES_DIR=/workspace/testeranto/bundles/allTests/python
ENV METAFILES_DIR=/workspace/testeranto/metafiles/python
ENV IN_DOCKER=true
CMD ["sh", "-c", "echo 'Python build container ready'; \\
                    mkdir -p /workspace/testeranto/bundles/allTests/python; \\
                    mkdir -p /workspace/testeranto/metafiles/python; \\
                    tail -f /dev/null"]`;

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
