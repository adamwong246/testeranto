import ansiC from "ansi-colors";
import readline from "readline";
import { loadConfig } from "./configLoader";
import { setupDockerCompose } from "./dockerComposeGenerator";
import { handleRuntimeBuilds } from "./runtimeBuildHandler";
import { setupFileSystem } from "./fileSystemSetup";
import { setupKeypressHandling } from "./keypressHandler";

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

export async function main() {
  // Validate command line arguments
  if (!process.argv[2]) {
    console.error(`The 2nd argument should be a testeranto config file name.`);
    process.exit(-1);
  }

  const configFilepath = process.argv[2];
  const mode = process.argv[3] as "once" | "dev";

  if (mode !== "once" && mode !== "dev") {
    console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
    process.exit(-1);
  }

  // Load configuration
  const { config, testsName } = await loadConfig(configFilepath);

  console.log(ansiC.inverse("Press 'q' to initiate a graceful shutdown."));
  console.log(ansiC.inverse("Press 'x' to quit forcefully."));

  // Setup keypress handling
  setupKeypressHandling();

  // Setup file system
  setupFileSystem(config, testsName);

  // Generate Docker Compose
  await setupDockerCompose(config, testsName);

  // Handle runtime builds
  await handleRuntimeBuilds(config, testsName);

  console.log("Testeranto is running...");
}
