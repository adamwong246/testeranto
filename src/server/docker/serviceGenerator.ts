/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IBuiltConfig, IRunTime } from "../../Types";
import {
  golangDockerComposeFile,
  golangDockerFile,
} from "../runtimes/golang/docker";
import { nodeDockerComposeFile } from "../runtimes/node/docker";
import {
  pythonDockerComposeFile,
  pythonDockerFile,
} from "../runtimes/python/docker";
import { webDockerCompose } from "../runtimes/web/docker";

import aiderPoolService from "./aiderPoolService";
// import chromiumService from "./chromiumService";

export async function generateServices(
  config: IBuiltConfig,
  runtimes: IRunTime[],
  webSocketPort: number | undefined,
  log: (...args: any[]) => void,
  error: (...args: any[]) => void
): Promise<Record<string, any>> {
  const services: any = {};

  // Add Chromium service for web tests using browserless/chrome
  // const chromiumPort = config.chromiumPort || config.httpPort + 1;
  // services["chromium"] = chromiumService(config.httpPort, chromiumPort);

  // Add Aider Pool service
  services["aider-pool"] = {
    ...aiderPoolService,
    // Note: .aider.conf.yml is mounted as a volume in aiderPoolService.ts
    // It's not an environment variable file, so we don't use env_file here
  };

  // Ensure all services use the same network configuration
  for (const serviceName in services) {
    services[serviceName].networks = ["default"];
  }

  for (const runtime of runtimes) {
    if (runtime === "node") {
      services[`${runtime}-builder`] = nodeDockerComposeFile(config);
    } else if (runtime === "web") {
      services[`${runtime}-builder`] = webDockerCompose(config);
    } else if (runtime === "golang") {
      services[`${runtime}-builder`] = golangDockerComposeFile(config);
    } else if (runtime === "python") {
      services[`${runtime}-builder`] = pythonDockerComposeFile(config);
    } else {
      throw `unknown runtime ${runtime}`;
    }
  }

  return services;
}
