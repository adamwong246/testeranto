import { Command } from "commander";
import blessed from "blessed";

/**
 * Adapter to create Commander programs that can be used in a TUI
 */
export class CommanderTuiAdapter {
  private program: Command;
  private screen: blessed.Widgets.Screen | null = null;
  private outputBox: blessed.Widgets.Log | null = null;
  private inputBox: blessed.Widgets.TextboxElement | null = null;
  private commandHistory: string[] = [];
  private historyIndex: number = -1;

  constructor(program: Command) {
    this.program = program;
  }

  /**
   * Launch the TUI interface with this program
   */
  launchTui(theme: "light" | "dark" = "dark", config?: any): any {
    // Create screen
    this.screen = blessed.screen({
      smartCSR: true,
      title: "Testeranto TUI",
      cursor: {
        artificial: true,
        shape: "line",
        blink: true,
      },
    });

    // Create output area (80% of screen)
    this.outputBox = blessed.log({
      parent: this.screen,
      top: 0,
      left: 0,
      width: "100%",
      height: "80%",
      label: " Output ",
      keys: true,
      vi: true,
      mouse: true,
      scrollable: true,
      scrollbar: {
        ch: " ",
        track: {
          bg: "cyan",
        },
        style: {
          inverse: true,
        },
      },
      border: { type: "line" },
      style: {
        fg: "white",
        bg: "black",
        border: { fg: theme === "dark" ? "white" : "black" },
      },
    });

    // Create input area (20% of screen)
    this.inputBox = blessed.textbox({
      parent: this.screen,
      top: "80%",
      left: 0,
      width: "100%",
      height: "20%",
      label: " Command Input (Ctrl+C to exit, ↑/↓ for history) ",
      keys: true,
      vi: true,
      mouse: true,
      inputOnFocus: true,
      border: { type: "line" },
      style: {
        fg: "white",
        bg: "black",
        border: { fg: theme === "dark" ? "white" : "black" },
        focus: { border: { fg: "blue" } },
      },
    });

    // Welcome message
    this.outputBox!.add("=== Testeranto TUI ===");
    this.outputBox!.add("Type any CLI command and press Enter to execute.");
    this.outputBox!.add("Commands will execute exactly as in the CLI.");
    this.outputBox!.add("Output will appear here in real-time.");
    this.outputBox!.add("Use ↑/↓ arrow keys to navigate command history.");
    this.outputBox!.add("Press Ctrl+C to exit.\n");

    // Input handler for command execution
    this.inputBox!.on("submit", async (value: string) => {
      if (value.trim() === "") return;

      // Add to history
      this.commandHistory.push(value);
      this.historyIndex = this.commandHistory.length;

      // Display the command
      this.outputBox!.add(`$ testeranto ${value}`);

      try {
        // Execute the command
        await this.executeCommand(value);
      } catch (error: any) {
        this.outputBox!.add(`Error: ${error.message}`);
      }

      this.inputBox!.clearValue();
      this.inputBox!.focus();
      this.screen!.render();
    });

    // Command history navigation
    this.inputBox!.key(["up"], () => {
      if (this.commandHistory.length > 0) {
        if (this.historyIndex > 0) {
          this.historyIndex--;
        }
        if (
          this.historyIndex >= 0 &&
          this.historyIndex < this.commandHistory.length
        ) {
          this.inputBox!.setValue(this.commandHistory[this.historyIndex]);
          this.screen!.render();
        }
      }
    });

    this.inputBox!.key(["down"], () => {
      if (this.commandHistory.length > 0) {
        if (this.historyIndex < this.commandHistory.length - 1) {
          this.historyIndex++;
          this.inputBox!.setValue(this.commandHistory[this.historyIndex]);
        } else {
          this.historyIndex = this.commandHistory.length;
          this.inputBox!.clearValue();
        }
        this.screen!.render();
      }
    });

    // Key bindings
    this.screen!.key(["C-c"], () => {
      this.destroy();
      process.exit(0);
    });

    // Initial focus
    this.inputBox!.focus();
    this.screen!.render();

    return {
      destroy: () => this.destroy(),
    };
  }

  private async executeCommand(commandString: string): Promise<void> {
    // Parse the command string
    const userArgs = commandString.trim().split(/\s+/);

    // Remove 'testeranto' if the user included it
    if (userArgs[0] === "testeranto") {
      userArgs.shift();
    }

    try {
      // Capture console output
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      const originalInfo = console.info;

      console.log = (...args: any[]) => {
        this.outputBox!.add(args.join(" "));
      };

      console.error = (...args: any[]) => {
        this.outputBox!.add(`ERROR: ${args.join(" ")}`);
      };

      console.warn = (...args: any[]) => {
        this.outputBox!.add(`WARN: ${args.join(" ")}`);
      };

      console.info = (...args: any[]) => {
        this.outputBox!.add(`INFO: ${args.join(" ")}`);
      };

      // Create a fresh program instance by importing the shared program function
      // We need to import it dynamically to avoid circular dependencies
      const { createSharedProgram } = await import('./shared-program.js');
      const tempProgram = createSharedProgram();
      
      // Add the program name as the first argument
      const argsToParse = ['node', 'testeranto-tui', ...userArgs];
      
      // Parse the arguments
      await tempProgram.parseAsync(argsToParse);

      // Restore console
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    } catch (error: any) {
      this.outputBox!.add(`Error: ${error.message}`);
    }
  }

  destroy(): void {
    if (this.screen) {
      this.screen.destroy();
    }
  }
}

export function adaptExistingProgramForTui(
  program: Command
): CommanderTuiAdapter {
  return new CommanderTuiAdapter(program);
}
