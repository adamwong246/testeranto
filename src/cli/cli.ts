import { createSharedProgram } from "./shared-program.js";
import { launchTui } from "./tui.js";

const program = createSharedProgram();

// Add TUI command to launch the TUI interface
program
  .command("idk")
  .description("dummy command")
  .action(() => {
    // launchTui();
  });

// Parse arguments, excluding the node executable and script path
program.parse(process.argv.slice(2));
