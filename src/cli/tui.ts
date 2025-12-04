import { createSharedProgram } from "./shared-program";
import { adaptExistingProgramForTui } from "./commander-adapter.js";

export function launchTui(configFilepath?: string) {
  // Use the shared Commander program
  const program = createSharedProgram();

  // Create the TUI adapter with the existing shared program
  const adapter = adaptExistingProgramForTui(program);

  // Launch the TUI with the config file path
  const tui = adapter.launchTui("dark", configFilepath);

  // Handle cleanup
  process.on("SIGINT", () => {
    tui.destroy();
    process.exit(0);
  });

  process.on("exit", () => {
    tui.destroy();
  });
}

// Always launch the TUI with command line arguments
// Get config file from command line arguments
const configFilepath = process.argv[2];
if (!configFilepath) {
  console.error("Usage: npm run tui <config-file>");
  console.error("Example: npm run tui allTests.ts");
  process.exit(1);
}
launchTui(configFilepath);
