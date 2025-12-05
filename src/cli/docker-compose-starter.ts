/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import blessed from "blessed";
import fs from "fs";
import path from "path";
import { DockerMangerPM } from "../PM/PM_DockerManager";
import { loadConfig } from "../testeranto/core/configLoader";
import { DockerCompose } from "../testeranto/infrastructure/docker/DockerCompose";
import { DockerValidator } from "../testeranto/infrastructure/docker/DockerValidator";
import { TcpServer } from "../testeranto/infrastructure/docker/TcpServer";
import { setupDockerCompose } from "../testeranto/service-management/dockerComposeGenerator";

/**
 * Utilities for starting docker-compose services
 */
export class DockerComposeStarter {
  private static tcpServer: TcpServer | null = null;
  /**
   * Start docker-compose services with the given configuration file
   */
  static async startDockerCompose(
    configFilepath: string,
    dockerComposeOutputBox: blessed.Widgets.Log | null,
    screen: blessed.Widgets.Screen | null,
    switchTab: (tabName: string) => void,
    tabs: blessed.Widgets.ListElement | null,
    createTesterantoDockerInstance: (
      testsName: string,
      composeFile: string
    ) => Promise<void>,
    updateTabsWithTests?: (tests: { name: string; runtime: string }[]) => void,
    // Add a separate output box for DockerManager logs - REQUIRED
    dockerManagerOutputBox: blessed.Widgets.Log | null
  ): Promise<void> {
    if (!dockerComposeOutputBox || !screen || !dockerManagerOutputBox) return;

    // Don't switch tabs automatically. DockerManager logs go to testeranto tab,
    // and docker-compose logs go to docker-compose tab which user can switch to manually.
    // This way, both sets of logs are visible in their respective tabs.

    try {
      // Check if the config file exists
      if (!fs.existsSync(configFilepath)) {
        dockerComposeOutputBox.add(`Config file not found: ${configFilepath}`);
        return;
      }

      // Add initial messages to testeranto tab only
      dockerManagerOutputBox.add(
        `Starting DockerManager with config: ${configFilepath}`
      );
      dockerManagerOutputBox.add(`Using config file: ${configFilepath}`);
      screen.render();

      // Load the config - this works because tsx handles TypeScript imports
      const { config, testsName } = await loadConfig(configFilepath);

      // Collect all tests from the config
      const allTests: { name: string; runtime: string }[] = [];

      // Node tests
      if (config.node?.tests) {
        Object.keys(config.node.tests).forEach((testPath) => {
          allTests.push({ name: testPath, runtime: "node" });
        });
      }

      // Web tests
      if (config.web?.tests) {
        Object.keys(config.web.tests).forEach((testPath) => {
          allTests.push({ name: testPath, runtime: "web" });
        });
      }

      // Golang tests
      if (config.golang?.tests) {
        Object.keys(config.golang.tests).forEach((testPath) => {
          allTests.push({ name: testPath, runtime: "golang" });
        });
      }

      // Python tests
      if (config.python?.tests) {
        Object.keys(config.python.tests).forEach((testPath) => {
          allTests.push({ name: testPath, runtime: "python" });
        });
      }

      // Update tabs with test information if callback is provided
      if (updateTabsWithTests) {
        updateTabsWithTests(allTests);
      }

      // Start TCP server for DockerMan communication
      // DockerManager logs go to testeranto tab
      dockerManagerOutputBox.add("Starting DockerMan TCP server...");
      dockerManagerOutputBox.add(
        "Switch to 'docker-compose' tab to see docker-compose logs"
      );
      screen.render();

      // Create a DockerMangerPM instance to handle commands
      const dockerManager = new DockerMangerPM(
        config,
        testsName,
        "docker" as any,
        null as any
      );

      DockerComposeStarter.tcpServer = new TcpServer({
        log: (...args: any[]) => {
          dockerManagerOutputBox.add(`[TCP] ${args.join(" ")}`);
        },
        error: (...args: any[]) => {
          dockerManagerOutputBox.add(`[TCP ERROR] ${args.join(" ")}`);
        },
      });

      // Handle commandReceived events from TcpServer
      DockerComposeStarter.tcpServer.on("commandReceived", (event: any) => {
        const { clientId, command, args, callbackId } = event;

        dockerManager
          .handleCommand(command, args)
          .then((result) => {
            DockerComposeStarter.tcpServer?.sendToClient(clientId, {
              result,
              callbackId,
            });
          })
          .catch((error) => {
            DockerComposeStarter.tcpServer?.sendToClient(clientId, {
              error: error.message || "Unknown error",
              callbackId,
            });
          });
      });

      // Add more event listeners for TCP server activity
      DockerComposeStarter.tcpServer.on(
        "clientConnected",
        (clientId: string) => {
          dockerManagerOutputBox.add(`[TCP] Client connected: ${clientId}`);
        }
      );

      DockerComposeStarter.tcpServer.on(
        "clientDisconnected",
        (clientId: string) => {
          dockerManagerOutputBox.add(`[TCP] Client disconnected: ${clientId}`);
        }
      );

      DockerComposeStarter.tcpServer.on(
        "messageReceived",
        (clientId: string, message: string) => {
          dockerManagerOutputBox.add(
            `[TCP] Raw message from ${clientId}: ${message.substring(0, 200)}${
              message.length > 200 ? "..." : ""
            }`
          );
        }
      );

      DockerComposeStarter.tcpServer.on(
        "messageSent",
        (clientId: string, message: string) => {
          dockerManagerOutputBox.add(
            `[TCP] Raw message to ${clientId}: ${message.substring(0, 200)}${
              message.length > 200 ? "..." : ""
            }`
          );
        }
      );

      let dockerManPort: number;
      try {
        dockerManPort = await DockerComposeStarter.tcpServer.start();
        dockerManagerOutputBox.add(
          `✅ DockerMan TCP server started on port ${dockerManPort}`
        );
        if (!dockerManPort || dockerManPort <= 0) {
          throw new Error(`Invalid TCP server port: ${dockerManPort}`);
        }
      } catch (err: any) {
        dockerManagerOutputBox.add(
          `❌ Failed to start TCP server: ${err.message}`
        );
        throw err;
      }

      dockerManagerOutputBox.add(
        `Generating docker-compose for ${testsName}...`
      );
      dockerManagerOutputBox.add(
        `Docker-compose generation started. Switch to 'docker-compose' tab to see details.`
      );
      screen.render();

      // Temporarily override console.log and console.error to prevent output to terminal
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;

      console.log = (...args: any[]) => {
        // Write to testeranto output box
        dockerManagerOutputBox.add(args.join(" "));
      };

      console.error = (...args: any[]) => {
        dockerManagerOutputBox.add(`ERROR: ${args.join(" ")}`);
      };

      try {
        // Generate docker-compose file with a logger that writes to the testeranto output box
        const logger = {
          log: (...args: any[]) => {
            dockerManagerOutputBox.add(args.join(" "));
          },
          error: (...args: any[]) => {
            dockerManagerOutputBox.add(`ERROR: ${args.join(" ")}`);
          },
        };
        await setupDockerCompose(config, testsName, { logger, dockerManPort });
      } finally {
        // Restore original console functions
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
      }

      // Path to the generated docker-compose file
      const composeFile = path.join(
        process.cwd(),
        "testeranto",
        "bundles",
        `${testsName}-docker-compose.yml`
      );

      if (!fs.existsSync(composeFile)) {
        dockerComposeOutputBox.add(
          `Generated docker-compose file not found at ${composeFile}`
        );
        return;
      }

      // Validate Docker environment and compose file
      try {
        const logger = {
          log: (...args: any[]) => dockerComposeOutputBox.add(args.join(" ")),
          error: (...args: any[]) =>
            dockerComposeOutputBox.add(`ERROR: ${args.join(" ")}`),
          warn: (...args: any[]) =>
            dockerComposeOutputBox.add(`WARN: ${args.join(" ")}`),
          info: (...args: any[]) =>
            dockerComposeOutputBox.add(`INFO: ${args.join(" ")}`),
        };

        const { composeCommand } =
          await DockerValidator.validateDockerEnvironment(logger);
        await DockerValidator.validateComposeFile(
          composeFile,
          path.dirname(composeFile),
          composeCommand,
          logger
        );
      } catch (error: any) {
        dockerComposeOutputBox.add(`Validation failed: ${error.message}`);
        return;
      }

      // Ensure the output directory exists on the host
      const bundlesDir = path.join(process.cwd(), "testeranto", "bundles");
      const buildOutputDir = path.join(bundlesDir, "build-output");

      if (!fs.existsSync(buildOutputDir)) {
        dockerComposeOutputBox.add(
          `Creating build output directory: ${buildOutputDir}`
        );
        fs.mkdirSync(buildOutputDir, { recursive: true });
      }

      // First, stop any existing services to ensure a fresh start
      dockerComposeOutputBox.add(
        `Stopping any existing docker-compose services from ${composeFile}...`
      );
      screen.render();

      try {
        await DockerCompose.down({
          cwd: path.dirname(composeFile),
          log: false,
          commandOptions: ["--remove-orphans"],
          config: [composeFile],
        });
        dockerComposeOutputBox.add("✅ Existing services stopped");
      } catch (downError: any) {
        // It's okay if down fails (e.g., no services running)
        dockerComposeOutputBox.add(
          `Note: Could not stop existing services (may not exist): ${downError.message}`
        );
      }

      dockerManagerOutputBox.add(
        `Starting fresh docker-compose services from ${composeFile} with DOCKERMAN_PORT=${dockerManPort}...`
      );
      dockerManagerOutputBox.add(
        `Docker-compose services starting. Switch to 'docker-compose' tab to see progress.`
      );
      screen.render();

      // Set DOCKERMAN_PORT environment variable for docker-compose
      process.env.DOCKERMAN_PORT = dockerManPort.toString();

      const result = await DockerCompose.upAll({
        cwd: path.dirname(composeFile),
        log: false,
        commandOptions: [
          "--build",
          "--force-recreate",
          "--remove-orphans",
          "-d",
        ],
        config: [composeFile],
        env: {
          ...process.env,
          DOCKERMAN_PORT: dockerManPort.toString(),
        },
      });

      // Show any output from starting docker-compose
      if (result.stdout) {
        const stdoutStr =
          typeof result.stdout === "string"
            ? result.stdout
            : JSON.stringify(result.stdout, null, 2);
        dockerComposeOutputBox.add(stdoutStr);
      }
      if (result.stderr) {
        const stderrStr =
          typeof result.stderr === "string"
            ? result.stderr
            : JSON.stringify(result.stderr, null, 2);
        dockerComposeOutputBox.add(`STDERR: ${stderrStr}`);
      }

      // Create TesterantoDocker instance for managing services
      await createTesterantoDockerInstance(testsName, composeFile);

      // Get logs after a delay
      setTimeout(async () => {
        try {
          const logsResult = await DockerCompose.logs("", {
            cwd: path.dirname(composeFile),
            log: false,
            config: [composeFile],
          });

          if (logsResult.stdout) {
            const logsStr =
              typeof logsResult.stdout === "string"
                ? logsResult.stdout
                : JSON.stringify(logsResult.stdout, null, 2);
            dockerComposeOutputBox.add(logsStr);
          }
        } catch (logErr: any) {
          dockerComposeOutputBox.add(`Error getting logs: ${logErr.message}`);
        }
      }, 3000);
    } catch (error: any) {
      if (dockerComposeOutputBox) {
        let errorMessage: string;
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "object" && error !== null) {
          // Try to get a useful string representation
          try {
            errorMessage = JSON.stringify(error);
          } catch {
            errorMessage = String(error);
          }
        } else {
          errorMessage = String(error);
        }
        dockerComposeOutputBox.add(
          `Error starting docker-compose: ${errorMessage}`
        );
        if (error instanceof Error && error.stack) {
          dockerComposeOutputBox.add(`Stack: ${error.stack}`);
        }
      }
    }
  }
  /**
   * Stop docker-compose services with the given configuration file
   */
  static async stopDockerCompose(
    configFilepath: string,
    dockerComposeOutputBox: blessed.Widgets.Log | null,
    screen: blessed.Widgets.Screen | null,
    switchTab: (tabName: string) => void,
    tabs: blessed.Widgets.ListElement | null,
    // Add required parameter for DockerManager logs
    dockerManagerOutputBox: blessed.Widgets.Log | null
  ): Promise<void> {
    if (!dockerComposeOutputBox || !screen || !dockerManagerOutputBox) return;

    // Don't switch tabs automatically. Let the user see logs in their respective tabs.

    try {
      // Check if the config file exists
      if (!fs.existsSync(configFilepath)) {
        dockerComposeOutputBox.add(`Config file not found: ${configFilepath}`);
        return;
      }

      dockerComposeOutputBox.add(`Using config file: ${configFilepath}`);
      screen.render();

      // Load the config
      const { config, testsName } = await loadConfig(configFilepath);

      // Path to the generated docker-compose file
      const composeFile = path.join(
        process.cwd(),
        "testeranto",
        "bundles",
        `${testsName}-docker-compose.yml`
      );

      if (!fs.existsSync(composeFile)) {
        dockerComposeOutputBox.add(
          `Generated docker-compose file not found at ${composeFile}`
        );
        return;
      }

      dockerComposeOutputBox.add(
        `Stopping docker-compose services from ${composeFile}...`
      );
      screen.render();

      const result = await DockerCompose.down({
        cwd: path.dirname(composeFile),
        log: false,
        commandOptions: ["--remove-orphans"],
        config: [composeFile],
      });

      // Show any output from stopping docker-compose
      if (result.stdout) {
        const stdoutStr =
          typeof result.stdout === "string"
            ? result.stdout
            : JSON.stringify(result.stdout, null, 2);
        dockerComposeOutputBox.add(stdoutStr);
      }
      if (result.stderr) {
        const stderrStr =
          typeof result.stderr === "string"
            ? result.stderr
            : JSON.stringify(result.stderr, null, 2);
        dockerComposeOutputBox.add(`STDERR: ${stderrStr}`);
      }

      dockerComposeOutputBox.add("✅ Docker-compose services stopped");

      // Close TCP server if it's running
      if (DockerComposeStarter.tcpServer) {
        dockerManagerOutputBox.add("Closing DockerMan TCP server...");
        DockerComposeStarter.tcpServer.close();
        DockerComposeStarter.tcpServer = null;
        dockerManagerOutputBox.add("✅ DockerMan TCP server closed");
      }
    } catch (error: any) {
      if (dockerComposeOutputBox) {
        let errorMessage: string;
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "object" && error !== null) {
          try {
            errorMessage = JSON.stringify(error);
          } catch {
            errorMessage = String(error);
          }
        } else {
          errorMessage = String(error);
        }
        dockerComposeOutputBox.add(
          `Error stopping docker-compose: ${errorMessage}`
        );
        if (error instanceof Error && error.stack) {
          dockerComposeOutputBox.add(`Stack: ${error.stack}`);
        }
      }
    }
  }
}
