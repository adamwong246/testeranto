import compose from "docker-compose";
import path from "path";
import fs from "fs";
import blessed from "blessed";

/**
 * Handles execution of docker-compose commands
 */
export class DockerComposeExecutor {
  /**
   * Execute a docker-compose command and output to the given box
   */
  static async executeDockerComposeCommand(
    args: string[],
    outputBox: blessed.Widgets.Log
  ): Promise<void> {
    try {
      if (args.length === 0) {
        outputBox.add("docker-compose: missing command");
        outputBox.add("Try 'docker-compose --help' for more information.");
        return;
      }

      const command = args[0];
      const commandArgs = args.slice(1);

      // Look for generated docker-compose files in testeranto/bundles/
      const bundlesDir = path.join(process.cwd(), "testeranto", "bundles");
      let composeFile: string | null = null;

      if (fs.existsSync(bundlesDir)) {
        const files = fs.readdirSync(bundlesDir);
        const composeFiles = files.filter((f) =>
          f.endsWith("-docker-compose.yml")
        );
        if (composeFiles.length > 0) {
          // Use the first one found
          composeFile = path.join(bundlesDir, composeFiles[0]);
          outputBox.add(`Using docker-compose file: ${composeFile}`);
        }
      }

      if (!composeFile) {
        outputBox.add(
          `Warning: No generated docker-compose file found in ${bundlesDir}`
        );
        outputBox.add("Some commands may fail.");
        // Fall back to current directory
        composeFile = path.join(process.cwd(), "docker-compose.yml");
      }

      // The docker-compose npm package uses different options
      const options: any = {
        cwd: path.dirname(composeFile),
        log: false, // We'll handle logging ourselves
        composeOptions: [], // Global options like -f, -p
        commandOptions: commandArgs, // Command-specific options
      };

      // Add config file if it's not the default docker-compose.yml
      if (!composeFile.endsWith("docker-compose.yml")) {
        options.config = [composeFile];
      }

      // Check if the command is valid
      const validCommands = [
        "up",
        "down",
        "ps",
        "logs",
        "build",
        "start",
        "stop",
        "restart",
      ];
      if (!validCommands.includes(command)) {
        outputBox.add(`Unknown command: ${command}`);
        outputBox.add(`Valid commands are: ${validCommands.join(", ")}`);
        return;
      }

      let result;
      try {
        switch (command) {
          case "up":
            result = await compose.up(options);
            break;
          case "down":
            result = await compose.down(options);
            break;
          case "ps":
            result = await compose.ps(options);
            break;
          case "logs":
            // For logs, we need to handle service name
            if (commandArgs.length > 0) {
              result = await compose.logs(commandArgs[0], options);
            } else {
              result = await compose.logs(options);
            }
            break;
          case "build":
            result = await compose.build(options);
            break;
          case "start":
            result = await compose.start(options);
            break;
          case "stop":
            result = await compose.stop(options);
            break;
          case "restart":
            result = await compose.restart(options);
            break;
          default:
            outputBox.add(`Command not yet implemented: ${command}`);
            return;
        }
      } catch (execError: any) {
        let errorMessage: string;
        if (execError instanceof Error) {
          errorMessage = execError.message;
        } else if (typeof execError === 'object' && execError !== null) {
          try {
            errorMessage = JSON.stringify(execError);
          } catch {
            errorMessage = String(execError);
          }
        } else {
          errorMessage = String(execError);
        }
        outputBox.add(
          `Error executing docker-compose ${command}: ${errorMessage}`
        );
        return;
      }

      // Display the result
      if (result && typeof result === "object") {
        // Check for stdout
        if (result.stdout) {
          const stdoutStr =
            typeof result.stdout === "string"
              ? result.stdout
              : JSON.stringify(result.stdout, null, 2);
          outputBox.add(stdoutStr);
        }
        // Check for stderr
        if (result.stderr) {
          const stderrStr =
            typeof result.stderr === "string"
              ? result.stderr
              : JSON.stringify(result.stderr, null, 2);
          outputBox.add(`STDERR: ${stderrStr}`);
        }
        // Check for exitCode
        if (result.exitCode !== undefined) {
          outputBox.add(`Exit code: ${result.exitCode}`);
        }
        // Some versions may use out/err
        if (result.out && !result.stdout) {
          const outStr =
            typeof result.out === "string"
              ? result.out
              : JSON.stringify(result.out, null, 2);
          outputBox.add(outStr);
        }
        if (result.err && !result.stderr) {
          const errStr =
            typeof result.err === "string"
              ? result.err
              : JSON.stringify(result.err, null, 2);
          outputBox.add(`ERROR: ${errStr}`);
        }

        // If no output at all, show a message
        if (!result.stdout && !result.stderr && !result.out && !result.err) {
          outputBox.add(`Command executed successfully (no output)`);
        }
      } else {
        outputBox.add(`Command executed (result type: ${typeof result})`);
      }
    } catch (error: any) {
      let errorMessage: string;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        try {
          errorMessage = JSON.stringify(error);
        } catch {
          errorMessage = String(error);
        }
      } else {
        errorMessage = String(error);
      }
      outputBox.add(`Error executing docker-compose: ${errorMessage}`);
      if (error instanceof Error && error.stack) {
        outputBox.add(`Stack: ${error.stack}`);
      }
    }
  }
}
