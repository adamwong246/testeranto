import blessed from "blessed";
import compose from "docker-compose";
import fs from "fs";
import path from "path";
import { loadConfig } from "../testeranto/core/configLoader";
import { setupDockerCompose } from "../testeranto/service-management/dockerComposeGenerator";

/**
 * Utilities for starting docker-compose services
 */
export class DockerComposeStarter {
  /**
   * Start docker-compose services with the given configuration file
   */
  static async startDockerCompose(
    configFilepath: string,
    dockerComposeOutputBox: blessed.Widgets.Log | null,
    screen: blessed.Widgets.Screen | null,
    switchTab: (tabName: string) => void,
    tabs: blessed.Widgets.ListElement | null,
    createTesterantoDockerInstance: (testsName: string, composeFile: string) => Promise<void>,
    updateTabsWithTests?: (tests: {name: string, runtime: string}[]) => void
  ): Promise<void> {
    if (!dockerComposeOutputBox || !screen) return;

    // Switch to docker-compose tab
    switchTab("docker-compose");
    if (tabs) {
      tabs.select(1);
      screen.render();
    }

    try {
      // Check if the config file exists
      if (!fs.existsSync(configFilepath)) {
        dockerComposeOutputBox.add(
          `Config file not found: ${configFilepath}`
        );
        return;
      }

      dockerComposeOutputBox.add(`Using config file: ${configFilepath}`);
      screen.render();

      // Load the config - this works because tsx handles TypeScript imports
      const { config, testsName } = await loadConfig(configFilepath);

      // Collect all tests from the config
      const allTests: {name: string, runtime: string}[] = [];
      
      // Node tests
      if (config.node?.tests) {
        Object.keys(config.node.tests).forEach(testPath => {
          allTests.push({name: testPath, runtime: 'node'});
        });
      }
      
      // Web tests
      if (config.web?.tests) {
        Object.keys(config.web.tests).forEach(testPath => {
          allTests.push({name: testPath, runtime: 'web'});
        });
      }
      
      // Golang tests
      if (config.golang?.tests) {
        Object.keys(config.golang.tests).forEach(testPath => {
          allTests.push({name: testPath, runtime: 'golang'});
        });
      }
      
      // Python tests
      if (config.python?.tests) {
        Object.keys(config.python.tests).forEach(testPath => {
          allTests.push({name: testPath, runtime: 'python'});
        });
      }
      
      // Update tabs with test information if callback is provided
      if (updateTabsWithTests) {
        updateTabsWithTests(allTests);
      }

      dockerComposeOutputBox.add(
        `Generating docker-compose for ${testsName}...`
      );
      screen.render();

      // Temporarily override console.log and console.error to prevent output to terminal
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;

      console.log = (...args: any[]) => {
        // Only write to docker-compose output box
        dockerComposeOutputBox.add(args.join(" "));
      };

      console.error = (...args: any[]) => {
        dockerComposeOutputBox.add(`ERROR: ${args.join(" ")}`);
      };

      try {
        // Generate docker-compose file with a logger that writes to the docker-compose output box
        const logger = {
          log: (...args: any[]) => {
            dockerComposeOutputBox.add(args.join(" "));
          },
          error: (...args: any[]) => {
            dockerComposeOutputBox.add(`ERROR: ${args.join(" ")}`);
          },
        };
        await setupDockerCompose(config, testsName, logger);
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

      dockerComposeOutputBox.add(
        `Starting docker-compose services from ${composeFile}...`
      );
      screen.render();

      const result = await compose.upAll({
        cwd: path.dirname(composeFile),
        log: false,
        commandOptions: [
          "--build",
          "--force-recreate",
          "--remove-orphans",
          "-d",
        ],
        config: [composeFile],
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
          const logsResult = await compose.logs({
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
          dockerComposeOutputBox.add(
            `Error getting logs: ${logErr.message}`
          );
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
}
