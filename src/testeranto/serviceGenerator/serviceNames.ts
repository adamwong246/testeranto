import { IRunTime } from "../../Types";

export function generateServiceName(runtime: IRunTime, testName: string): string {
  let sanitizedTestName = testName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  sanitizedTestName = sanitizedTestName.replace(/-+/g, "-");
  sanitizedTestName = sanitizedTestName.replace(/^-+|-+$/g, "");
  return `${runtime}-${sanitizedTestName}`;
}

export function validateServiceNames(serviceNames: string[]): void {
  const invalidServiceNames = serviceNames.filter(
    (name) => !/^[a-z][a-z0-9_-]*$/.test(name)
  );
  if (invalidServiceNames.length > 0) {
    console.error("Invalid service names found:", invalidServiceNames);
    throw new Error(
      "Docker Compose service names must be lowercase and alphanumeric"
    );
  }
}
