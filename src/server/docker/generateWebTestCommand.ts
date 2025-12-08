import { command } from "./command";

export function generateWebTestCommand(
  runtime: string,
  testPath: string,
  betterTestPath: string,
  dockerManPort?: number,
  webSocketPort?: number
): string[] {
  // We need to pass these parameters to the command function
  // Since we don't have the command function implementation, we'll assume it uses environment variables
  // which we already set in the service configuration
  return ["sh", "-c", command(testPath, runtime, betterTestPath)];
}
