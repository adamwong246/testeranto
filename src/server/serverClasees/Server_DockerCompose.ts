import fs from "fs";
import path from "path";
import { IBuiltConfig } from "../../Types";
import { DockerComposeOptions, IMode } from "../types";
import { Server_WS_Process } from "./Server_WS_Process";

interface IDockerComposeResult {
  exitCode: number;
  out: string;
  err: string;
  data: any;
}

export class Server_DockerCompose extends Server_WS_Process {
  private cwd: string;
  private config: string;
  private composeDir: string;
  private composeFile: string;
  private serviceLogStreams: Map<string, fs.WriteStream> = new Map();
  private logCaptureInterval: NodeJS.Timeout | null = null;

  constructor(cwd: string, configs: IBuiltConfig, name: string, mode: IMode) {
    super(configs, name, mode);
    this.cwd = cwd;
    this.config = path.join(
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    );
    this.composeDir = process.cwd();
    this.composeFile = path.join(
      this.composeDir,
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    );

    // Ensure the compose file is created before starting services
    this.initializeAndStart().catch((error) => {
      console.error("Failed to initialize docker-compose:", error);
    });
  }

  private async initializeAndStart(): Promise<void> {
    // Import setupDockerCompose here to avoid circular dependencies
    const { setupDockerCompose } = await import(
      "../docker/dockerComposeGenerator"
    );

    // Wait for docker-compose file to be generated
    await setupDockerCompose(this.configs, this.projectName, {
      logger: {
        log: (...args) => console.log(...args),
        error: (...args) => console.error(...args),
      },
    });

    await this.startServices();
  }

  private async startServices(): Promise<void> {
    // Check if compose file exists
    if (!fs.existsSync(this.composeFile)) {
      console.error(`Docker-compose file not found: ${this.composeFile}`);
      console.error(`Current directory: ${process.cwd()}`);
      // List directory contents
      const bundlesDir = path.join(process.cwd(), "testeranto", "bundles");
      if (fs.existsSync(bundlesDir)) {
        console.error(`Contents of ${bundlesDir}:`);
        try {
          const files = fs.readdirSync(bundlesDir);
          console.error(files);
        } catch (e) {
          console.error(`Error reading directory: ${e}`);
        }
      }
      return;
    }

    // First, capture build logs
    await this.captureBuildLogs();

    // Set up log files before starting services to capture startup logs
    await this.setupServiceLogFiles();
    // Start capturing logs immediately
    this.startLogCapture();

    try {
      const result = await this.DC_upAll();
      console.log(
        `docker-compose up completed with exit code: ${result.exitCode}`
      );

      // Capture the up command output immediately
      await this.captureServiceLogs();

      if (result.exitCode !== 0) {
        console.error(
          `docker-compose up failed with exit code ${result.exitCode}:`
        );
        console.error(`Error: ${result.err}`);
        console.error(`Output: ${result.out}`);

        // Write the error to all service logs
        for (const [
          serviceName,
          writeStream,
        ] of this.serviceLogStreams.entries()) {
          const errorHeader = `\n=== docker-compose up failed with exit code ${result.exitCode} ===\n`;
          writeStream.write(errorHeader);
          if (result.err) {
            writeStream.write(`Error: ${result.err}\n`);
          }
          if (result.out) {
            writeStream.write(`Output: ${result.out}\n`);
          }
        }
      } else {
        console.log(`Waiting for services to become healthy (15 seconds)...`);
        await new Promise((resolve) => setTimeout(resolve, 15000));

        const psResult2 = await this.DC_ps();
        console.log(`Service status after startup:`, psResult2.out);

        // Capture service status
        await this.captureServiceLogs();
      }
    } catch (error) {
      console.error(
        `Error starting docker-compose services:`,
        error,
        this.composeFile
      );
      console.error(`Full error:`, error);

      // Write the error to all service logs
      for (const [
        serviceName,
        writeStream,
      ] of this.serviceLogStreams.entries()) {
        const errorHeader = `\n=== Error starting docker-compose services ===\n`;
        writeStream.write(errorHeader);
        writeStream.write(`Error: ${error}\n`);
      }
    }
  }

  private async captureBuildLogs(): Promise<void> {
    // Create a build log file
    const buildLogPath = path.join(
      process.cwd(),
      "testeranto",
      "reports",
      this.projectName,
      "docker-logs",
      "docker-compose-build.log"
    );

    // Ensure directory exists
    const buildLogDir = path.dirname(buildLogPath);
    if (!fs.existsSync(buildLogDir)) {
      fs.mkdirSync(buildLogDir, { recursive: true });
    }

    const buildLogStream = fs.createWriteStream(buildLogPath, { flags: "a" });

    let header = `=== Docker Compose Build Logs ===\n`;
    header += `Started at: ${new Date().toISOString()}\n`;
    header += `Project: ${this.projectName}\n`;
    header += `Compose file: ${this.composeFile}\n`;
    header += "=".repeat(50) + "\n\n";
    buildLogStream.write(header);

    console.log(`Starting docker-compose build to capture build logs...`);

    try {
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);

      // First, check if docker is available
      let dockerComposeCmd = "docker compose";
      // try {
      //   // Try docker compose v2 first
      //   await execAsync("docker compose version");
      //   dockerComposeCmd = "docker compose";
      //   console.log("Using docker compose v2");
      // } catch (v2Error) {
      //   try {
      //     // Fall back to docker-compose v1
      //     await execAsync("docker-compose --version");
      //     console.log("Using docker-compose v1");
      //   } catch (v1Error) {
      //     buildLogStream.write("\nERROR: Neither 'docker compose' nor 'docker-compose' command is available\n");
      //     buildLogStream.write("Please ensure Docker is installed and in your PATH\n");
      //     console.error("ERROR: Docker Compose is not available");
      //     buildLogStream.end();
      //     return;
      //   }
      // }

      // Run docker compose build directly
      const cmd = `docker compose -f "${this.composeFile}" build`;
      console.log(`Running: ${cmd}`);

      try {
        const { stdout, stderr } = await execAsync(cmd, {
          cwd: this.composeDir,
          maxBuffer: 10 * 1024 * 1024, // 10MB buffer for build output
        });

        // Write the output to the log file
        if (stdout) {
          buildLogStream.write(stdout + "\n");
        }
        if (stderr) {
          buildLogStream.write(`[STDERR] ${stderr}\n`);
        }

        buildLogStream.write("\nBuild process completed successfully\n");
        console.log(`docker-compose build completed successfully`);
      } catch (execError: any) {
        // exec throws an error if exit code is non-zero, but we still want to capture output
        if (execError.stdout) {
          buildLogStream.write(execError.stdout + "\n");
        }
        if (execError.stderr) {
          buildLogStream.write(`[STDERR] ${execError.stderr}\n`);
        }

        buildLogStream.write(
          `\nBuild process failed with exit code: ${execError.code || 1}\n`
        );
        console.error(
          `docker-compose build failed with exit code ${execError.code || 1}`
        );

        if (execError.message) {
          buildLogStream.write(`Error: ${execError.message}\n`);
        }
      }
    } catch (error: any) {
      buildLogStream.write(
        `\nUnexpected error during build: ${error.message}\n`
      );
      console.error(`docker-compose build process error:`, error);
    } finally {
      if (!buildLogStream.closed) {
        buildLogStream.end();
      }
    }
  }

  private async setupServiceLogFiles(): Promise<void> {
    try {
      // Use docker-compose ps to get the actual service names
      // This ensures we only get services that are defined in the docker-compose.yml
      try {
        const psResult = await this.DC_ps();
        if (psResult.out) {
          // Parse the output to get service names
          const lines = psResult.out.split("\n").filter((line) => line.trim());

          for (const line of lines) {
            // Skip lines that look like headers
            if (
              line.includes("NAME") &&
              line.includes("COMMAND") &&
              line.includes("STATUS")
            ) {
              continue;
            }

            const parts = line.split(/\s+/);
            if (parts.length > 0) {
              const serviceName = parts[0];
              if (
                serviceName &&
                !serviceName.startsWith("-") &&
                serviceName !== "NAME"
              ) {
                // Check if we already created a log file for this service
                if (!this.serviceLogStreams.has(serviceName)) {
                  await this.createLogFileForService(serviceName);
                }
              }
            }
          }
        }
      } catch (psError) {
        // If docker-compose ps fails, services may not be running yet
        // In this case, we can try to get service names from docker-compose config
        console.log(
          "docker-compose ps failed, trying docker-compose config:",
          psError.message
        );
        try {
          // Use docker-compose config --services to get all service names
          const { exec } = await import("child_process");
          const { promisify } = await import("util");
          const execAsync = promisify(exec);

          const { stdout } = await execAsync(
            `docker compose -f "${this.composeFile}" config --services`,
            { cwd: this.composeDir }
          );

          const serviceNames = stdout
            .trim()
            .split("\n")
            .filter((name) => name.trim());
          for (const serviceName of serviceNames) {
            if (!this.serviceLogStreams.has(serviceName)) {
              await this.createLogFileForService(serviceName);
            }
          }
        } catch (configError) {
          console.log(
            "docker-compose config also failed:",
            configError.message
          );
          // Create at least one generic log file
          await this.createLogFileForService("docker-compose");
        }
      }
    } catch (error) {
      console.error("Error setting up service log files:", error);
      // Create at least one generic log file
      await this.createLogFileForService("docker-compose");
    }
  }

  private async createLogFileForService(serviceName: string): Promise<void> {
    const reportsDir = path.join(
      process.cwd(),
      "testeranto",
      "reports",
      this.projectName,
      "docker-logs"
    );

    // Ensure the directory exists
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const logFilePath = path.join(reportsDir, `${serviceName}.log`);
    const writeStream = fs.createWriteStream(logFilePath, { flags: "a" });

    // Write header
    let header = `=== Docker Logs for service: ${serviceName} ===\n`;
    header += `Started at: ${new Date().toISOString()}\n`;
    header += `Project: ${this.projectName}\n`;
    header += "=".repeat(50) + "\n\n";
    writeStream.write(header);

    this.serviceLogStreams.set(serviceName, writeStream);

    console.log(`Created log file for service ${serviceName}: ${logFilePath}`);
  }

  private startLogCapture(): void {
    // Capture logs more frequently at first (every 2 seconds for the first 30 seconds)
    // Then switch to every 5 seconds
    let captureCount = 0;

    const captureInterval = () => {
      this.logCaptureInterval = setInterval(async () => {
        await this.captureServiceLogs();
        captureCount++;

        // After 15 captures (30 seconds at 2-second intervals), switch to 5-second intervals
        if (captureCount >= 15 && this.logCaptureInterval) {
          clearInterval(this.logCaptureInterval);
          // Switch to 5-second intervals
          this.logCaptureInterval = setInterval(async () => {
            await this.captureServiceLogs();
          }, 5000);
        }
      }, 2000);
    };

    captureInterval();

    // Also capture logs immediately
    setTimeout(async () => {
      await this.captureServiceLogs();
    }, 1000);
  }

  private async captureServiceLogs(): Promise<void> {
    // If no services are known yet, try to discover them
    if (this.serviceLogStreams.size === 0) {
      await this.setupServiceLogFiles();
    }

    // Get a list of service names to avoid modifying the map while iterating
    const serviceNames = Array.from(this.serviceLogStreams.keys());

    for (const serviceName of serviceNames) {
      const writeStream = this.serviceLogStreams.get(serviceName);
      if (!writeStream) {
        continue;
      }

      try {
        const logResult = await this.DC_logs(serviceName, {
          follow: false,
          tail: 100, // Get last 100 lines
        });

        if (logResult.out) {
          const timestamp = new Date().toISOString();
          const logEntry = `[${timestamp}] ${logResult.out}\n`;
          writeStream.write(logEntry);
        }

        // Also capture stderr if available
        if (logResult.err) {
          const timestamp = new Date().toISOString();
          const errorEntry = `[${timestamp}] [ERROR] ${logResult.err}\n`;
          writeStream.write(errorEntry);
        }
      } catch (error) {
        // If we can't get logs for a service, it might not exist or not be running
        // Check if the service still exists in docker-compose
        try {
          // Try to get service status to see if it exists
          const psResult = await this.DC_ps();
          const serviceExists =
            psResult.out && psResult.out.includes(serviceName);

          if (!serviceExists) {
            // Service doesn't exist, remove it from our tracking
            this.serviceLogStreams.delete(serviceName);
            const timestamp = new Date().toISOString();
            const removalMessage = `[${timestamp}] [INFO] Service ${serviceName} no longer exists, stopping log capture\n`;
            writeStream.write(removalMessage);
            writeStream.end();
            console.log(
              `Stopped log capture for non-existent service: ${serviceName}`
            );
          } else {
            // Service exists but we can't get logs (might be starting/stopping)
            const timestamp = new Date().toISOString();
            const errorMessage = `[${timestamp}] [LOG CAPTURE ERROR] Failed to get logs: ${error.message}\n`;
            writeStream.write(errorMessage);
          }
        } catch (psError) {
          // If we can't check service status, just write the error
          const timestamp = new Date().toISOString();
          const errorMessage = `[${timestamp}] [LOG CAPTURE ERROR] Failed to get logs: ${error.message}\n`;
          writeStream.write(errorMessage);
        }
      }
    }

    // Also capture general docker-compose logs
    try {
      const allLogsResult = await this.DC_logs("", {
        follow: false,
        tail: 50,
      });

      if (allLogsResult.out || allLogsResult.err) {
        const timestamp = new Date().toISOString();
        const generalLogFile = path.join(
          process.cwd(),
          "testeranto",
          "reports",
          this.projectName,
          "docker-logs",
          "docker-compose-general.log"
        );

        // Ensure directory exists
        const reportsDir = path.dirname(generalLogFile);
        if (!fs.existsSync(reportsDir)) {
          fs.mkdirSync(reportsDir, { recursive: true });
        }

        const writeStream = fs.createWriteStream(generalLogFile, {
          flags: "a",
        });
        if (allLogsResult.out) {
          writeStream.write(`[${timestamp}] ${allLogsResult.out}\n`);
        }
        if (allLogsResult.err) {
          writeStream.write(`[${timestamp}] [ERROR] ${allLogsResult.err}\n`);
        }
        writeStream.end();
      }
    } catch (error) {
      // Ignore errors for general logs
    }
  }

  private async stopLogCapture(): Promise<void> {
    if (this.logCaptureInterval) {
      clearInterval(this.logCaptureInterval);
      this.logCaptureInterval = null;
    }

    // Capture one final set of logs before closing
    await this.captureServiceLogs();

    // Close all log streams
    for (const [serviceName, writeStream] of this.serviceLogStreams.entries()) {
      try {
        const footer = `\n\n=== Log capture stopped at: ${new Date().toISOString()} ===\n`;
        writeStream.write(footer);
        writeStream.end();
        console.log(`Closed log stream for service ${serviceName}`);
      } catch (error) {
        console.error(`Error closing log stream for ${serviceName}:`, error);
      }
    }
    this.serviceLogStreams.clear();
  }

  public async DC_upAll(
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    try {
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);

      const cmd = `docker compose -f "${this.composeFile}" up -d`;
      const { stdout, stderr } = await execAsync(cmd, {
        cwd: this.composeDir,
      });

      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null,
      };
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error starting services: ${error.message}`,
        data: null,
      };
    }
  }

  public async DC_down(
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    // Stop log capture before shutting down
    await this.stopLogCapture();

    try {
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);

      const cmd = `docker compose -f "${this.composeFile}" down`;
      const { stdout, stderr } = await execAsync(cmd, {
        cwd: this.composeDir,
      });

      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null,
      };
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error stopping services: ${error.message}`,
        data: null,
      };
    }
  }

  public async DC_upOne(
    serviceName: string,
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    try {
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);

      const cmd = `docker compose -f "${this.composeFile}" up -d ${serviceName}`;
      const { stdout, stderr } = await execAsync(cmd, {
        cwd: this.composeDir,
      });

      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null,
      };
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error starting service ${serviceName}: ${error.message}`,
        data: null,
      };
    }
  }

  public async DC_ps(
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    try {
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);

      const cmd = `docker compose -f "${this.composeFile}" ps`;
      const { stdout, stderr } = await execAsync(cmd, {
        cwd: this.composeDir,
      });

      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null,
      };
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error getting service status: ${error.message}`,
        data: null,
      };
    }
  }

  public async DC_logs(
    serviceName: string,
    options?: Partial<DockerComposeOptions>
  ): Promise<IDockerComposeResult> {
    const opts = this.mergeOptions(options);
    try {
      // Use child_process directly for more reliable log capture
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);

      // Build the docker compose command
      const composeCmd = `docker compose -f "${this.composeFile}" logs --no-color --tail=100`;
      const fullCmd = serviceName ? `${composeCmd} ${serviceName}` : composeCmd;

      try {
        const { stdout, stderr } = await execAsync(fullCmd, {
          cwd: this.composeDir,
          maxBuffer: 10 * 1024 * 1024, // 10MB buffer for logs
        });

        return {
          exitCode: 0,
          out: stdout,
          err: stderr,
          data: null,
        };
      } catch (execError: any) {
        // exec throws an error if exit code is non-zero, but we still want to capture output
        if (execError.stdout || execError.stderr) {
          return {
            exitCode: execError.code || 1,
            out: execError.stdout || "",
            err: execError.stderr || execError.message,
            data: null,
          };
        }
        throw execError;
      }
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error getting logs for ${serviceName}: ${error.message}`,
        data: null,
      };
    }
  }

  private mergeOptions(
    options?: Partial<DockerComposeOptions>
  ): DockerComposeOptions {
    const base = {
      cwd: this.composeDir, // Use composeDir which is process.cwd()
      config: this.config, // Path to the docker-compose.yml file
      log: true,
    };
    // Merge options
    const merged = { ...base, ...options };
    return merged;
  }

  public getCwd(): string {
    return this.cwd;
  }

  public getConfig(): string {
    return this.config;
  }

  // Static methods for direct usage without creating an instance
  static async upAll(
    options: DockerComposeOptions
  ): Promise<IDockerComposeResult> {
    try {
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);

      const cmd = `docker compose -f "${options.config}" up -d`;
      const { stdout, stderr } = await execAsync(cmd, {
        cwd: options.cwd,
      });

      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null,
      };
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error starting services: ${error.message}`,
        data: null,
      };
    }
  }

  static async down(
    options: DockerComposeOptions
  ): Promise<IDockerComposeResult> {
    try {
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);

      const cmd = `docker compose -f "${options.config}" down`;
      const { stdout, stderr } = await execAsync(cmd, {
        cwd: options.cwd,
      });

      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null,
      };
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error stopping services: ${error.message}`,
        data: null,
      };
    }
  }

  static async logs(
    serviceName: string,
    options: DockerComposeOptions
  ): Promise<IDockerComposeResult> {
    try {
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);

      const composeCmd = `docker compose -f "${options.config}" logs --no-color --tail=100`;
      const fullCmd = serviceName ? `${composeCmd} ${serviceName}` : composeCmd;

      const { stdout, stderr } = await execAsync(fullCmd, {
        cwd: options.cwd,
        maxBuffer: 10 * 1024 * 1024,
      });

      return {
        exitCode: 0,
        out: stdout,
        err: stderr,
        data: null,
      };
    } catch (error: any) {
      return {
        exitCode: 1,
        out: "",
        err: `Error getting logs for ${serviceName}: ${error.message}`,
        data: null,
      };
    }
  }

  // Override stop method to clean up log capture
  public async stop(): Promise<void> {
    await this.stopLogCapture();
    await super.stop();
  }
}
