/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IBuiltConfig, IRunTime } from "../../Types";
import chromiumService from "./chromiumService";
import { createBuildService } from "./buildServiceGenerator";
import { generateTestServices } from "./testServiceGenerator";
import { generateStaticAnalysisServices } from "./staticAnalysisServiceGenerator";

export { createBuildService };

export async function generateServices(
  config: IBuiltConfig,
  runtimes: IRunTime[],
  webSocketPort: number | undefined,
  log: (...args: any[]) => void,
  error: (...args: any[]) => void
): Promise<Record<string, any>> {
  const services: any = {};

  // Add Chromium service for web tests using browserless/chrome
  const chromiumPort = config.chromiumPort || config.httpPort + 1;
  services["chromium"] = chromiumService(config.httpPort, chromiumPort);

  // Ensure all services use the same network configuration
  for (const serviceName in services) {
    services[serviceName].networks = ["default"];
  }

  // Add build services for each runtime
  for (const runtime of runtimes) {
    const buildServiceName = `${runtime}-build`;

    // Check if the runtime has tests in the config
    const hasTests =
      config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
    if (!hasTests) continue;

    // Get the base service configuration
    const buildService = await import("./buildService");
    const serviceConfig = buildService.default(runtime);

    // For web build, add dependency on chromium service
    if (runtime === "web") {
      if (!serviceConfig.depends_on) {
        serviceConfig.depends_on = {};
      }
      serviceConfig.depends_on.chromium = {
        condition: "service_started",
      };
    }

    services[buildServiceName] = serviceConfig;
  }

  // Generate test services
  const testServices = await generateTestServices(config, runtimes);
  Object.assign(services, testServices);

  // Generate static analysis services
  const staticAnalysisServices = await generateStaticAnalysisServices(config, runtimes);
  Object.assign(services, staticAnalysisServices);

  return services;
}
