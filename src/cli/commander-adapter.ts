import { Command } from "commander";
import readline from "readline";

/**
 * Adapter to create Commander programs that can be used in a TUI
 */
export class CommanderTuiAdapter {
  private program: Command;

  constructor(program: Command) {
    this.program = program;
  }

  /**
   * Launch the TUI interface with this program
   */
  launchTui(theme: "light" | "dark" = "dark", config?: any): any {
    console.log("\n=== Testeranto TUI ===\n");
    console.log("Available commands:");
    this.program.commands.forEach(cmd => {
      console.log(`  ${cmd.name().padEnd(10)} - ${cmd.description() || "No description"}`);
    });
    console.log("\nPress Enter to exit.\n");

    // Block synchronously until Enter is pressed
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("", () => {
      rl.close();
    });

    // Return a dummy object
    return {
      destroy: () => console.log("TUI destroyed")
    };
  }
}

export function adaptExistingProgramForTui(
  program: Command
): CommanderTuiAdapter {
  return new CommanderTuiAdapter(program);
}
