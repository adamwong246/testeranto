import ansiColors from "ansi-colors";
import { exec, execSync, spawn } from "child_process";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { promisify } from "util";
import { IBuiltConfig, IRunTime } from "../../Types";
import { DockerManager, IDockerComposeResult, IService } from "../serverManagers/DockerManager";
import { IMode } from "../types";
import { Server_WS } from "./Server_WS";
import { RUN_TIMES } from "../../runtimes";

export class Server_Docker extends Server_WS {

  dockerManager: DockerManager;
  private logProcesses: Map<string, { process: any; serviceName: string }> = new Map();

  constructor(configs: IBuiltConfig, projectName: string, mode: IMode) {
    super(configs, projectName, mode);

    this.dockerManager = new DockerManager(path.join(
      process.cwd(),
      "testeranto",
      "bundles",
      `${this.projectName}-docker-compose.yml`
    ), projectName);
  }

  private async waitForContainerExists(serviceName: string, maxAttempts: number = 30, delayMs: number = 1000): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const cmd = `docker compose -f "${this.dockerManager.composeFile}" ps -q ${serviceName}`;
        const { execSync } = require('child_process');
        const containerId = execSync(cmd, { cwd: this.dockerManager.cwd }).toString().trim();
        
        if (containerId && containerId.length > 0) {
          console.log(`[Server_Docker] Container for ${serviceName} exists with ID: ${containerId.substring(0, 12)}`);
          return true;
        }
      } catch (error) {
        // Container doesn't exist yet or command failed
      }
      
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    console.warn(`[Server_Docker] Container for ${serviceName} did not appear after ${maxAttempts} attempts`);
    return false;
  }

  private async startServiceLogging(serviceName: string, containerName: string, runtime: string, testName: string): Promise<void> {
    // Create report directory first
    const reportDir = path.join(
      process.cwd(),
      "testeranto",
      "reports",
      this.projectName,
      testName,
      runtime
    );
    
    try {
      fs.mkdirSync(reportDir, { recursive: true });
    } catch (error: any) {
      console.error(`[Server_Docker] Failed to create report directory ${reportDir}: ${error.message}`);
      return;
    }
    
    const logFilePath = path.join(reportDir, `${serviceName}.log`);
    const exitCodeFilePath = path.join(reportDir, `${serviceName}.exitcode`);
    
    // Start a process to capture logs - use a more robust approach
    // We'll use a shell script that handles waiting for the container
    const logScript = `
      # Wait for container to exist
      for i in {1..30}; do
        if docker compose -f "${this.dockerManager.composeFile}" ps -q ${serviceName} > /dev/null 2>&1; then
          break
        fi
        sleep 1
      done
      # Capture logs from the beginning
      docker compose -f "${this.dockerManager.composeFile}" logs --no-color -f ${serviceName}
    `;
    
    console.log(`[Server_Docker] Starting log capture for ${serviceName} to ${logFilePath}`);
    
    const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
    const timestamp = new Date().toISOString();
    logStream.write(`=== Log started at ${timestamp} for service ${serviceName} ===\n\n`);
    
    const child = spawn('bash', ['-c', logScript], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: this.dockerManager.cwd
    });
    
    // Get container ID for tracking
    let containerId: string | null = null;
    try {
      // Try to get container ID, but don't fail if we can't
      const containerIdCmd = `docker compose -f "${this.dockerManager.composeFile}" ps -q ${serviceName}`;
      containerId = execSync(containerIdCmd, { cwd: this.dockerManager.cwd }).toString().trim();
    } catch (error) {
      console.warn(`[Server_Docker] Could not get container ID for ${serviceName}, will track by service name`);
    }
    
    child.stdout?.on('data', (data) => {
      logStream.write(data);
    });
    
    child.stderr?.on('data', (data) => {
      logStream.write(data);
    });
    
    child.on('error', (error) => {
      console.error(`[Server_Docker] Log process error for ${serviceName}:`, error);
      logStream.write(`\n=== Log process error: ${error.message} ===\n`);
      logStream.end();
      // Write error exit code
      fs.writeFileSync(exitCodeFilePath, '-1');
    });
    
    child.on('close', (code) => {
      const endTimestamp = new Date().toISOString();
      logStream.write(`\n=== Log ended at ${endTimestamp}, process exited with code ${code} ===\n`);
      logStream.end();
      console.log(`[Server_Docker] Log process for ${serviceName} exited with code ${code}`);
      
      // Write exit code to file
      fs.writeFileSync(exitCodeFilePath, code?.toString() || '0');
      
      // Also capture the actual container exit code
      this.captureContainerExitCode(serviceName, reportDir);
      
      if (containerId) {
        this.logProcesses.delete(containerId);
      } else {
        // Remove by service name if we couldn't get container ID
        for (const [id, proc] of this.logProcesses.entries()) {
          if (proc.serviceName === serviceName) {
            this.logProcesses.delete(id);
            break;
          }
        }
      }
    });
    
    // Track the process
    const trackingKey = containerId || serviceName;
    this.logProcesses.set(trackingKey, { process: child, serviceName });
  }

  private async captureContainerExitCode(serviceName: string, reportDir: string): Promise<void> {
    try {
      // Get container ID including stopped containers
      const containerIdCmd = `docker compose -f "${this.dockerManager.composeFile}" ps -a -q ${serviceName}`;
      const containerId = execSync(containerIdCmd, { cwd: this.dockerManager.cwd }).toString().trim();
      
      if (containerId) {
        // Check if container exists and get its exit code
        const inspectCmd = `docker inspect --format='{{.State.ExitCode}}' ${containerId}`;
        const exitCode = execSync(inspectCmd, { cwd: this.dockerManager.cwd }).toString().trim();
        
        // Write container exit code to a separate file
        const containerExitCodeFilePath = path.join(reportDir, `${serviceName}.container.exitcode`);
        fs.writeFileSync(containerExitCodeFilePath, exitCode);
        
        console.log(`[Server_Docker] Container ${serviceName} (${containerId.substring(0, 12)}) exited with code ${exitCode}`);
        
        // Also capture the container's status
        const statusCmd = `docker inspect --format='{{.State.Status}}' ${containerId}`;
        const status = execSync(statusCmd, { cwd: this.dockerManager.cwd }).toString().trim();
        const statusFilePath = path.join(reportDir, `${serviceName}.container.status`);
        fs.writeFileSync(statusFilePath, status);
      } else {
        console.debug(`[Server_Docker] No container found for service ${serviceName}`);
      }
    } catch (error: any) {
      // Container might not exist anymore, which is fine
      console.debug(`[Server_Docker] Could not capture container exit code for ${serviceName}: ${error.message}`);
    }
  }

  async start() {
    console.log(`[Server_Docker] start()`)
    super.start();
    await this.setupDockerCompose(this.configs, this.projectName);

    // Ensure base reports directory exists
    const baseReportsDir = path.join(process.cwd(), "testeranto", "reports");
    try {
      fs.mkdirSync(baseReportsDir, { recursive: true });
      console.log(`[Server_Docker] Created base reports directory: ${baseReportsDir}`);
    } catch (error: any) {
      console.error(`[Server_Docker] Failed to create base reports directory ${baseReportsDir}: ${error.message}`);
    }


    console.log(`[Server_Docker] Dropping everything...`);
    try {
      const downCmd = `docker compose -f "${this.dockerManager.composeFile}" down -v --remove-orphans`;
      console.log(`[Server_Docker] Running: ${downCmd}`);
      await this.spawnPromise(downCmd);
      console.log(`[Server_Docker] Docker compose down completed`);
    } catch (error: any) {
      console.log(`[Server_Docker] Docker compose down noted: ${error.message}`);
    }
    // Start builder services
    for (const runtime of RUN_TIMES) {
      const serviceName = `${runtime}-builder`;
      console.log(`[Server_Docker] Starting builder service: ${serviceName}`);
      try {
        await this.spawnPromise(`docker compose -f "${this.dockerManager.composeFile}" up -d ${serviceName}`);
      } catch (error: any) {
        console.error(`[Server_Docker] Failed to start ${serviceName}: ${error.message}`);
      }
    }

    // Start browser service
    console.log(`[Server_Docker] Starting browser service...`);
    try {
      await this.spawnPromise(`docker compose -f "${this.dockerManager.composeFile}" up -d browser`);
    } catch (error: any) {
      console.error(`[Server_Docker] Failed to start browser service: ${error.message}`);
    }

    // Wait for browser service to be healthy before starting web BDD services
    console.log(`[Server_Docker] Waiting for browser container to be healthy...`);
    await this.waitForContainerHealthy('browser-allTests', 60000); // 60 seconds max

    // Start aider services
    for (const runtime of RUN_TIMES) {
      const tests = this.configs[runtime]?.tests;
      if (!tests) continue;

      console.log(`[Server_Docker] Found tests for ${runtime}:`, Object.keys(tests));
      
      for (const testName in tests) {
        // Generate the UID exactly as DockerManager does
        const uid = `${runtime}-${testName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
        const aiderServiceName = `${uid}-aider`;

        console.log(`[Server_Docker] Starting aider service: ${aiderServiceName} for test ${testName}`);
        try {
          await this.spawnPromise(`docker compose -f "${this.dockerManager.composeFile}" up -d ${aiderServiceName}`);
          // Start logging for aider services
          this.startServiceLogging(aiderServiceName, aiderServiceName, runtime, testName)
            .catch(error => console.error(`[Server_Docker] Failed to start logging for ${aiderServiceName}:`, error));
        } catch (error: any) {
          console.error(`[Server_Docker] Failed to start ${aiderServiceName}: ${error.message}`);
        }
      }
    }

    // Start BDD test services
    // TODO these logs  from these services should be saved into reports
    for (const runtime of RUN_TIMES) {
      const tests = this.configs[runtime]?.tests;
      if (!tests) continue;

      for (const testName in tests) {
        const uid = `${runtime}-${testName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
        const bddServiceName = `${uid}-bdd`;

        const reportDir = "testeranto/reports/allTests/example/"

        try {
          fs.mkdirSync(reportDir, { recursive: true });
          console.log(`[Server_Docker] Created report directory: ${reportDir} for test ${testName} and runtime ${runtime}`);
        } catch (error: any) {
          console.error(`[Server_Docker] Failed to create report directory ${reportDir}: ${error.message}`);
        }

        console.log(`[Server_Docker] Starting BDD service: ${bddServiceName}`);
        try {
          // Start the service
          await this.spawnPromise(`docker compose -f "${this.dockerManager.composeFile}" up -d ${bddServiceName}`);
          
          // Immediately start logging in the background
          // Don't wait for it to complete
          this.startServiceLogging(bddServiceName, bddServiceName, runtime, testName)
            .catch(error => console.error(`[Server_Docker] Failed to start logging for ${bddServiceName}:`, error));
          
          // Also capture any existing logs from the container (in case it already produced output)
          this.captureExistingLogs(bddServiceName, runtime, testName)
            .catch(error => console.error(`[Server_Docker] Failed to capture existing logs for ${bddServiceName}:`, error));
        } catch (error: any) {
          console.error(`[Server_Docker] Failed to start ${bddServiceName}: ${error.message}`);
          // Even if starting failed, try to capture any logs that might exist
          this.captureExistingLogs(bddServiceName, runtime, testName)
            .catch(err => console.error(`[Server_Docker] Also failed to capture logs:`, err));
        }
      }
    }

    // Start static test services
    // TODO these logs  from these services should be saved into reports
    for (const runtime of RUN_TIMES) {
      const tests = this.configs[runtime]?.tests;
      if (!tests) continue;

      for (const testName in tests) {
        const uid = `${runtime}-${testName.toLowerCase().replaceAll("/", "_").replaceAll(".", "-")}`;
        const checks = this.configs[runtime]?.checks || [];
        for (let i = 0; i < checks.length; i++) {
          const staticServiceName = `${uid}-static-${i}`;
          console.log(`[Server_Docker] Starting static test service: ${staticServiceName}`);
          try {
            await this.spawnPromise(`docker compose -f "${this.dockerManager.composeFile}" up -d ${staticServiceName}`);
            // Start logging for this service
            this.startServiceLogging(staticServiceName, staticServiceName, runtime, testName)
              .catch(error => console.error(`[Server_Docker] Failed to start logging for ${staticServiceName}:`, error));
            
            // Also capture any existing logs
            this.captureExistingLogs(staticServiceName, runtime, testName)
              .catch(error => console.error(`[Server_Docker] Failed to capture existing logs for ${staticServiceName}:`, error));
          } catch (error: any) {
            console.error(`[Server_Docker] Failed to start ${staticServiceName}: ${error.message}`);
            // Try to capture logs even if starting failed
            this.captureExistingLogs(staticServiceName, runtime, testName)
              .catch(err => console.error(`[Server_Docker] Also failed to capture logs:`, err));
          }
        }
      }
    }
  }

  private async captureExistingLogs(serviceName: string, runtime: string, testName: string): Promise<void> {
    // Create report directory
    const reportDir = path.join(
      process.cwd(),
      "testeranto",
      "reports",
      this.projectName,
      testName,
      runtime
    );
    
    try {
      fs.mkdirSync(reportDir, { recursive: true });
    } catch (error: any) {
      console.error(`[Server_Docker] Failed to create report directory ${reportDir}: ${error.message}`);
      return;
    }
    
    const logFilePath = path.join(reportDir, `${serviceName}.log`);
    
    try {
      // First, check if the container exists (including stopped ones)
      const checkCmd = `docker compose -f "${this.dockerManager.composeFile}" ps -a -q ${serviceName}`;
      const containerId = execSync(checkCmd, { 
        cwd: this.dockerManager.cwd,
        encoding: 'utf-8'
      }).toString().trim();
      
      if (!containerId) {
        console.debug(`[Server_Docker] No container found for service ${serviceName}`);
        return;
      }
      
      // Get existing logs from the container
      const cmd = `docker compose -f "${this.dockerManager.composeFile}" logs --no-color ${serviceName} 2>/dev/null || true`;
      const existingLogs = execSync(cmd, { 
        cwd: this.dockerManager.cwd,
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024 // 10MB
      });
      
      if (existingLogs && existingLogs.trim().length > 0) {
        // Append to the log file
        fs.appendFileSync(logFilePath, existingLogs);
        console.log(`[Server_Docker] Captured ${existingLogs.length} bytes of existing logs for ${serviceName}`);
      }
      
      // Also try to capture the container exit code if it has exited
      this.captureContainerExitCode(serviceName, reportDir);
    } catch (error: any) {
      // It's okay if this fails - the container might not exist yet
      console.debug(`[Server_Docker] No existing logs for ${serviceName}: ${error.message}`);
    }
  }

  private async waitForContainerHealthy(containerName: string, timeoutMs: number): Promise<void> {
    const startTime = Date.now();
    const checkInterval = 2000; // Check every 2 seconds

    // while (Date.now() - startTime < timeoutMs) {
    //   try {
    //     // Use docker inspect to check container health status
    //     const cmd = `docker inspect --format="{{.State.Health.Status}}" ${containerName}`;
    //     const { exec } = require('child_process');
    //     const { promisify } = require('util');
    //     const execAsync = promisify(exec);

    //     const { stdout, stderr } = await execAsync(cmd);
    //     const healthStatus = stdout.trim();

    //     if (healthStatus === 'healthy') {
    //       console.log(`[Server_Docker] Container ${containerName} is healthy`);
    //       return;
    //     } else if (healthStatus === 'unhealthy') {
    //       throw new Error(`Container ${containerName} is unhealthy`);
    //     } else {
    //       console.log(`[Server_Docker] Container ${containerName} health status: ${healthStatus}`);
    //     }
    //   } catch (error: any) {
    //     // Container might not exist yet or command failed
    //     console.log(`[Server_Docker] Waiting for container ${containerName} to be healthy...`);
    //   }

    //   // Wait before checking again
    //   await new Promise(resolve => setTimeout(resolve, checkInterval));
    // }

    // throw new Error(`Timeout waiting for container ${containerName} to become healthy`);
  }


  public async stop(): Promise<void> {
    console.log(`[Server_Docker] stop()`)
    
    // Stop all log processes first
    for (const [containerId, logProcess] of this.logProcesses.entries()) {
      try {
        logProcess.process.kill('SIGTERM');
        console.log(`[Server_Docker] Stopped log process for container ${containerId} (${logProcess.serviceName})`);
      } catch (error) {
        console.error(`[Server_Docker] Error stopping log process for ${containerId}:`, error);
      }
    }
    this.logProcesses.clear();
    
    const result = await this.DC_down();
    if (result.exitCode !== 0) {
      console.error(`Docker Compose down failed: ${result.err}`);
    }
    super.stop();
  }

  async setupDockerCompose(
    config: IBuiltConfig,
    testsName: string,

  ) {
    // First, ensure all necessary directories exist
    const composeDir = path.join(process.cwd(), "testeranto", "bundles");

    try {
      // Setup directories
      fs.mkdirSync(composeDir, { recursive: true });

      // Generate Dockerfiles for each runtime
      // Note: runtimes needs to be defined - we'll get it from config
      // const runtimes: IRunTime[] = ["node", "web", "golang", "python", "ruby"];
      // deprecated 
      // this.generateRuntimeDockerfiles(config, runtimes, composeDir, log, error);

      const services = this.dockerManager.generateServices(
        config,
      );

      this.writeComposeFile(services, testsName, composeDir);
    } catch (err) {
      console.error(`Error in setupDockerCompose:`, err);
      throw err;
    }
  }

  writeComposeFile(
    services: Record<string, IService>,
    testsName: string,
    composeDir: string,
  ) {

    const composeFilePath = path.join(
      composeDir,
      `${testsName}-docker-compose.yml`
    );

    const dockerComposeFileContents = this.dockerManager.BaseCompose(services);

    try {
      fs.writeFileSync(
        composeFilePath,
        yaml.dump(dockerComposeFileContents, {
          lineWidth: -1,
          noRefs: true,
        })
      );
    } catch (err) {
      console.error(JSON.stringify(dockerComposeFileContents))
      throw err;
    }
  }

  private async exec(cmd: string, options: { cwd: string }): Promise<{ stdout: string; stderr: string }> {
    const execAsync = promisify(exec);
    return execAsync(cmd, { cwd: options.cwd });
  }

  spawnPromise(command: string) {
    return new Promise<number>((resolve, reject) => {
      console.log(`[spawnPromise] Executing: ${command}`);

      // Use shell: true to let the shell handle command parsing (including quotes)
      const child = spawn(command, {
        stdio: 'inherit',
        shell: true,
        cwd: this.dockerManager.cwd
      });

      child.on('error', (error) => {
        console.error(`[spawnPromise] Failed to start process: ${error.message}`);
        reject(error);
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(`[spawnPromise] Process completed successfully`);
          resolve(code);
        } else {
          console.error(`[spawnPromise] Process exited with code ${code}`);
          reject(new Error(`Process exited with code ${code}`));
        }
      });
    });
  }

  public async DC_upAll(): Promise<IDockerComposeResult> {
    try {
      const cmd = this.dockerManager.getUpCommand();
      await this.spawnPromise(cmd);

      return {
        exitCode: 0,
        out: '',
        err: '',
        data: null,
      };
    } catch (error: any) {
      console.error(
        `[Docker] docker compose up ❌ ${ansiColors.bgBlue(error.message.replaceAll('\\n', '\n'))}`
      );
      return {
        exitCode: 1,
        out: '',
        err: `Error starting services: ${error.message}`,
        data: null,
      };
    }
  }

  public async DC_down(): Promise<IDockerComposeResult> {

    try {
      const cmd = this.dockerManager.getDownCommand();

      await this.spawnPromise(cmd);
      return {
        exitCode: 0,
        out: "",
        err: "",
        data: null,
      };
    } catch (error: any) {
      console.log(`[DC_down] Error during down: ${error.message}`);
      return {
        exitCode: 1,
        out: "",
        err: `Error stopping services: ${error.message}`,
        data: null,
      };
    }
  }

  public async DC_ps(): Promise<IDockerComposeResult> {
    try {
      const cmd = this.dockerManager.getPsCommand();
      const { stdout, stderr } = await this.exec(cmd, { cwd: this.dockerManager.cwd });

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
    options?: { follow?: boolean; tail?: number }
  ): Promise<IDockerComposeResult> {
    const tail = options?.tail ?? 100;
    try {
      const cmd = this.dockerManager.getLogsCommand(serviceName, tail);
      const { stdout, stderr } = await this.exec(cmd, { cwd: this.dockerManager.cwd });

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

  public async DC_configServices(): Promise<IDockerComposeResult> {
    try {
      const cmd = this.dockerManager.getConfigServicesCommand();
      const { stdout, stderr } = await this.exec(cmd, { cwd: this.dockerManager.cwd });

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
        err: `Error getting services from config: ${error.message}`,
        data: null,
      };
    }
  }

  public async DC_start(): Promise<any> {
    try {
      const startCommand = this.dockerManager.getStartCommand();
      await this.spawnPromise(startCommand);

      return {
        exitCode: 0,
        data: null,
      };
    } catch (error: any) {
      console.error(
        `[Docker] docker compose start ❌ ${ansiColors.bgBlue(error.message.replaceAll('\\n', '\n'))}`
      );
      return {
        exitCode: 1,
        data: null,
      };
    }
  }

  public async DC_build(): Promise<any> {
    try {
      const buildCommand = this.dockerManager.getBuildCommand();
      await this.spawnPromise(buildCommand);

      console.log(`[DC_build] Build completed successfully`);
      return {
        exitCode: 0,
        out: '',
        err: '',
        data: null,
      };
    } catch (error: any) {
      console.error(
        `[Docker] docker-compose build ❌ ${ansiColors.bgBlue(error.message.replaceAll('\\n', '\n'))}`
      );

      return {
        exitCode: 1,
        out: '',
        err: `Error building services: ${error.message}`,
        data: null,
      };
    }
  }

  public getProcessSummary(): any {
    console.log(`[Server_Docker] getProcessSummary called`);

    try {
      // Get running containers
      const output = execSync('docker ps --format "{{.Names}}|{{.Image}}|{{.Status}}|{{.Ports}}|{{.State}}|{{.Command}}"').toString();

      const processes = output.trim().split('\n').filter(line => line.trim()).map(line => {
        const parts = line.split('|');
        const [name, image, status, ports, state, command] = parts;
        
        // Try to get exit code for stopped containers
        let exitCode = null;
        try {
          // Check if container exists (including stopped ones)
          const inspectCmd = `docker inspect --format='{{.State.ExitCode}}' ${name} 2>/dev/null || echo ""`;
          const exitCodeStr = execSync(inspectCmd).toString().trim();
          if (exitCodeStr !== '') {
            exitCode = parseInt(exitCodeStr, 10);
            // Only include exit code if container is not running
            if (state === 'running') {
              exitCode = null;
            }
          }
        } catch (error) {
          // Container might not exist, which is fine
        }
        
        return {
          processId: name,
          command: command || image,
          image: image,
          timestamp: new Date().toISOString(),
          status: status,
          state: state,
          ports: ports,
          exitCode: exitCode,
          // Add additional fields that might be useful for the frontend
          runtime: this.getRuntimeFromName(name),
          health: 'unknown' // We could add health check status here
        };
      });

      return {
        processes: processes,
        total: processes.length,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error(`[Server_Docker] Error getting docker processes: ${error.message}`);
      return {
        processes: [],
        total: 0,
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  private getRuntimeFromName(name: string): string {
    if (name.includes('node')) return 'node';
    if (name.includes('web')) return 'web';
    if (name.includes('golang')) return 'golang';
    if (name.includes('python')) return 'python';
    if (name.includes('ruby')) return 'ruby';
    if (name.includes('browser')) return 'browser';
    return 'unknown';
  }

}
