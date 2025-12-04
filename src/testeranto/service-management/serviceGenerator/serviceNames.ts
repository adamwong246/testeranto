import { IRunTime } from "../../../Types";
import { TestServiceManager } from "../docker/TestServiceManager";

export function generateServiceName(runtime: IRunTime, testName: string): string {
  // Use the same logic as TestServiceManager for consistency
  return TestServiceManager.generateTestServiceName(testName, runtime);
}

export function validateServiceNames(serviceNames: string[]): void {
  const invalidServiceNames = serviceNames.filter(
    (name) => !/^[a-z][a-z0-9_-]*$/.test(name)
  );
  if (invalidServiceNames.length > 0) {
    console.error("Invalid service names found:", invalidServiceNames);
    throw new Error(
      "Docker Compose service names must start with a lowercase letter and can only contain lowercase letters, numbers, underscores, and hyphens"
    );
  }
}

// Helper function to parse service names consistently
export function parseServiceName(serviceName: string): { runtime: IRunTime | null, entryPoint: string | null } {
  return TestServiceManager.parseTestServiceName(serviceName);
}
