/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBuiltConfig, IRunTime } from "../../Types";

// Placeholder implementations to avoid import errors
function setupDockerfileForBuild(runtime: IRunTime, testsName: string): string {
  console.log(`Setting up Dockerfile for ${runtime} build`);
  return `/tmp/dockerfile-${runtime}-${testsName}`;
}

function setupDockerfileForTest(
  c: IBuiltConfig,
  runtime: IRunTime,
  testName: string,
  testsName: string
): string {
  console.log(`Setting up Dockerfile for ${runtime} test ${testName}`);
  return `/tmp/dockerfile-${runtime}-${testName}-${testsName}`;
}

function generateServiceName(runtime: IRunTime, testName: string): string {
  return `${runtime}-${testName}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

function validateServiceNames(serviceNames: string[]): void {
  const invalid = serviceNames.filter(name => !/^[a-z][a-z0-9-]*$/.test(name));
  if (invalid.length > 0) {
    throw new Error(`Invalid service names: ${invalid.join(', ')}`);
  }
}

function createTestService(
  runtime: IRunTime,
  testName: string,
  dockerfileDir: string,
  testsName: string
): Record<string, any> {
  return {
    [`${generateServiceName(runtime, testName)}`]: {
      build: {
        context: ".",
        dockerfile: dockerfileDir,
      },
    },
  };
}

function createBuildService(
  runtime: IRunTime,
  dockerfileDir: string,
  testsName: string
): Record<string, any> {
  return {
    [`${runtime}-build`]: {
      build: {
        context: ".",
        dockerfile: dockerfileDir,
      },
    },
  };
}

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
