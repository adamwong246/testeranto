import blessed from "blessed";
import { createSharedProgram } from "./shared-program";

/**
 * Utilities for executing testeranto commands
 */
export class CommandExecutor {
  /**
   * Execute a testeranto command and output to the given box
   */
  static async executeCommand(
    commandString: string,
    outputBox: blessed.Widgets.Log
  ): Promise<void> {
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
        outputBox.add(args.join(" "));
      };

      console.error = (...args: any[]) => {
        outputBox.add(`ERROR: ${args.join(" ")}`);
      };

      console.warn = (...args: any[]) => {
        outputBox.add(`WARN: ${args.join(" ")}`);
      };

      console.info = (...args: any[]) => {
        outputBox.add(`INFO: ${args.join(" ")}`);
      };

      // Create a fresh program instance by importing the shared program function
      const tempProgram = createSharedProgram();

      // Add the program name as the first argument
      const argsToParse = ["node", "testeranto-tui", ...userArgs];

      // Parse the arguments
      await tempProgram.parseAsync(argsToParse);

      // Restore console
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    } catch (error: any) {
      outputBox.add(`Error: ${error.message}`);
    }
  }

  /**
   * Determine if a command is a docker-compose command
   */
  static isDockerComposeCommand(commandString: string): boolean {
    const userArgs = commandString.trim().split(/\s+/);
    return userArgs[0] === "docker-compose" || userArgs[0] === "docker";
  }

  /**
   * Get the appropriate tab for a command
   */
  static getTabForCommand(commandString: string): string {
    if (this.isDockerComposeCommand(commandString)) {
      return "docker-compose";
    }
    return "testeranto";
  }

  /**
   * Process a command and return the appropriate output box and history
   */
  static processCommand(
    commandString: string,
    testerantoOutputBox: blessed.Widgets.Log | null,
    dockerComposeOutputBox: blessed.Widgets.Log | null,
    testerantoCommandHistory: string[],
    dockerComposeCommandHistory: string[]
  ): {
    targetOutputBox: blessed.Widgets.Log | null;
    targetHistory: string[];
    isDockerCompose: boolean;
  } {
    const isDockerCompose = this.isDockerComposeCommand(commandString);

    if (isDockerCompose) {
      return {
        targetOutputBox: dockerComposeOutputBox,
        targetHistory: dockerComposeCommandHistory,
        isDockerCompose: true,
      };
    } else {
      return {
        targetOutputBox: testerantoOutputBox,
        targetHistory: testerantoCommandHistory,
        isDockerCompose: false,
      };
    }
  }
}
