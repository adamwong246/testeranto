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

  const { config, testsName } = await loadConfig(configFilepath);

  console.log(ansiC.inverse("Press 'q' to initiate a graceful shutdown."));
  console.log(ansiC.inverse("Press 'x' to quit forcefully."));

  setupKeypressHandling();
  setupFileSystem(config, testsName);
  await setupDockerCompose(config, testsName);
  try {
    await handleRuntimeBuilds(config, testsName);
  } catch (error) {
    console.error("Error during runtime builds:", error);
    process.exit(1);
  }

  console.log("Testeranto is running...");
}
