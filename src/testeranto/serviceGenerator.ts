/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBuiltConfig, IRunTime } from "../Types";
import { setupDockerfileForBuild } from "./serviceGenerator/buildDockerfiles";
import { setupDockerfileForTest } from "./serviceGenerator/testDockerfiles";
import { generateServiceName, validateServiceNames } from "./serviceGenerator/serviceNames";
import { createTestService, createBuildService } from "./serviceGenerator/serviceObjects";

export function generateServices(
  c: IBuiltConfig,
  testsName: string
): Record<string, any> {
  const services: Record<string, any> = {};
  const runtimes: IRunTime[] = ["node", "web", "golang", "python"];

  // First, always generate build services for all runtimes that have tests defined
  runtimes.forEach((runtime) => {
    if (
      c[runtime] &&
      c[runtime].tests &&
      Object.keys(c[runtime].tests).length > 0
    ) {
      const buildService = generateBuildServiceForRuntime(
        c,
        runtime,
        testsName
      );
      Object.assign(services, buildService);
    }
  });

  // Then generate test services
  runtimes.forEach((runtime) => {
    if (
      c[runtime] &&
      c[runtime].tests &&
      Object.keys(c[runtime].tests).length > 0
    ) {
      const runtimeServices = generateServicesForRuntime(c, runtime, testsName);
      Object.assign(services, runtimeServices);
    } else {
      console.log(`Skipping ${runtime} - no tests found`);
    }
  });

  // Validate all service names
  validateServiceNames(Object.keys(services));

  return services;
}

function generateServicesForRuntime(
  c: IBuiltConfig,
  runtime: IRunTime,
  testsName: string
): Record<string, any> {
  const services: Record<string, any> = {};

  Object.keys(c[runtime].tests).forEach((testName) => {
    const dockerfileDir = setupDockerfileForTest(
      c,
      runtime,
      testName,
      testsName
    );
    const service = createTestService(runtime, testName, dockerfileDir, testsName);
    Object.assign(services, service);
  });

  return services;
}

function generateBuildServiceForRuntime(
  c: IBuiltConfig,
  runtime: IRunTime,
  testsName: string
): Record<string, any> {
  const buildDockerfileDir = setupDockerfileForBuild(runtime, testsName);
  return createBuildService(runtime, buildDockerfileDir, testsName);
}
