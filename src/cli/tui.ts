import { createSharedProgram } from "./shared-program.js";
import { adaptExistingProgramForTui } from "./commander-adapter.js";

export function launchTui() {
  // Use the shared Commander program
  const program = createSharedProgram();

  // Create the TUI adapter with the existing shared program
  const adapter = adaptExistingProgramForTui(program);

  // Launch the TUI
  const tui = adapter.launchTui("dark");

  // Handle cleanup
  process.on("SIGINT", () => {
    tui.destroy();
    process.exit(0);
  });

  process.on("exit", () => {
    tui.destroy();
  });
}

// If this file is run directly, launch the TUI
if (import.meta.url === `file://${process.argv[1]}`) {
  launchTui();
}
