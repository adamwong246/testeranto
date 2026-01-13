// This Server manages processes-as-docker-commands. Processes are scheduled in queue.
// It should also leverage Server_HTTP and SERVER_WS

import { default as ansiC } from "ansi-colors";
import Queue from "queue";
import fs from "fs";
import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";
import { IMode } from "../types";
import { Server_FS } from "./Server_FS";
import {
  createLogStreams,
  ProcessCategory,
  ProcessInfo,
} from "./utils/Server_ProcessManager";
import { IMetaFile } from "./utils/types";
// ProcessManagerReactApp is bundled separately and served via HTTP
// We don't need to import it here

export class Server_ProcessManager extends Server_FS {
  ports: Record<number, string> = {};
  logStreams: Record<string, ReturnType<typeof createLogStreams>> = {};
  allProcesses: Map<string, ProcessInfo> = new Map();
  processLogs: Map<string, string[]> = new Map();
  runningProcesses: Map<string, Promise<any>> = new Map();
  private jobQueue: any;
  private aiderProcesses: Map<string, any> = new Map(); // Store actual aider processes

  // Track queued items for monitoring
  private queuedItems: Array<{
    testName: string;
    runtime: IRunTime;
    addableFiles: string[];
    command?: string;
  }> = [];

  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);
    this.configs = configs;
    this.projectName = testName;

    // Initialize the queue with default options
    this.jobQueue = new Queue();
    this.jobQueue.autostart = true;
    this.jobQueue.concurrency = 1; // Process one job at a time by default

    // Initialize ports if configs.ports exists
    if (configs.ports && Array.isArray(configs.ports)) {
      configs.ports.forEach((port) => {
        this.ports[port] = ""; // set ports as open
      });
    }

    // Register the process manager route
    this.routes({});
  }

  routes(
    routes: Record<string, React.ComponentType<any> | React.ReactElement>
  ) {
    // Use a placeholder component object; the actual component is loaded via bundle
    super.routes({
      process_manager: {} as React.ComponentType<any>,
      ...routes,
    });
  }

  async stop() {
    // Stop all aider processes
    for (const [processId, aiderProcess] of this.aiderProcesses.entries()) {
      try {
        this.addLogEntry(processId, "stdout", `Stopping aider process ${processId}`, new Date(), "info");
        aiderProcess.kill('SIGTERM');
        // Wait a bit then force kill if needed
        setTimeout(() => {
          if (!aiderProcess.killed) {
            aiderProcess.kill('SIGKILL');
          }
        }, 2000);
      } catch (error: any) {
        console.error(`[ProcessManager] Failed to stop aider process ${processId}:`, error);
      }
    }
    this.aiderProcesses.clear();
    
    // Stop the queue and wait for current jobs to finish
    if (this.jobQueue) {
      this.jobQueue.end();
      this.jobQueue.stop();
    }

    Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());
    await super.stop();
  }

  // Get process summary for monitoring
  getProcessSummary = () => {
    const processes = [];

    // Debug: log all process IDs
    console.log(`[ProcessManager] All process IDs:`, Array.from(this.allProcesses.keys()));

    // Docker/process-based tests
    for (const [id, info] of this.allProcesses.entries()) {
      // Ensure id is valid
      if (!id) {
        console.warn(`[ProcessManager] Found process with undefined ID, info:`, info);
        continue;
      }
      processes.push({
        id,
        command: info.command,
        status: info.status,
        type: info.type,
        category: info.category,
        testName: info.testName,
        platform: info.platform,
        timestamp: info.timestamp,
        exitCode: info.exitCode,
        error: info.error,
        logs: this.getProcessLogs(id).slice(-10), // Last 10 logs
      });
    }

    return {
      totalProcesses: this.allProcesses.size,
      running: Array.from(this.allProcesses.values()).filter(
        (p) => p.status === "running"
      ).length,
      completed: Array.from(this.allProcesses.values()).filter(
        (p) => p.status === "completed"
      ).length,
      errors: Array.from(this.allProcesses.values()).filter(
        (p) => p.status === "error"
      ).length,
      processes,
      queueLength: this.jobQueue ? this.jobQueue.length : 0,
      queuedItems: this.queuedItems,
    };
  };

  // Get logs for a process
  getProcessLogs = (processId: string): string[] => {
    return this.processLogs.get(processId) || [];
  };

  // Add log entry from any source
  addLogEntry = (
    processId: string,
    source: "stdout" | "stderr" | "console" | "network" | "error",
    message: string,
    timestamp: Date = new Date(),
    level?: string
  ) => {
    if (!this.processLogs.has(processId)) {
      this.processLogs.set(processId, []);
    }

    // Determine level from source if not provided
    let logLevel = level;
    if (!logLevel) {
      switch (source) {
        case "stderr":
        case "error":
          logLevel = "error";
          break;
        case "stdout":
          logLevel = "info";
          break;
        default:
          logLevel = "info";
      }
    }

    const logEntry = `[${timestamp.toISOString()}] [${source}] ${message}`;
    this.processLogs.get(processId)!.push(logEntry);

    // Also write to a log file for docker processes
    this.writeToProcessLogFile(processId, source, message, timestamp);

    // Send to log subscribers if they exist
    if ((this as any).logSubscriptions) {
      const subscriptions = (this as any).logSubscriptions.get(processId);
      if (subscriptions) {
        const logMessage = {
          type: "logEntry",
          processId,
          source,
          level: logLevel,
          message,
          timestamp: timestamp.toISOString(),
        };
        subscriptions.forEach((client: any) => {
          if (client.readyState === 1) {
            client.send(JSON.stringify(logMessage));
          }
        });
      }
    }
  };

  private writeToProcessLogFile(
    processId: string,
    source: "stdout" | "stderr" | "console" | "network" | "error",
    message: string,
    timestamp: Date
  ) {
    const logDir = path.join(
      process.cwd(),
      "testeranto",
      "reports",
      this.projectName,
      "docker-process-logs"
    );
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Create or append to log file
    const logFile = path.join(logDir, `${processId}.log`);
    const logEntry = `[${timestamp.toISOString()}] [${source}] ${message}\n`;

    fs.appendFileSync(logFile, logEntry);
  }

  // Port management methods
  allocatePorts(numPorts: number, testName: string): number[] | null {
    const openPorts = Object.entries(this.ports)
      .filter(([, status]) => status === "")
      .map(([port]) => parseInt(port));

    if (openPorts.length >= numPorts) {
      const allocatedPorts = openPorts.slice(0, numPorts);
      allocatedPorts.forEach((port) => {
        this.ports[port] = testName;
      });
      return allocatedPorts;
    }
    return null;
  }

  releasePorts(ports: number[]) {
    ports.forEach((port) => {
      this.ports[port] = "";
    });
  }

  getPortStatus() {
    return { ...this.ports };
  }

  isPortAvailable(port: number): boolean {
    return this.ports[port] === "";
  }

  getPortOwner(port: number): string | null {
    return this.ports[port] || null;
  }

  // Execute a command and track it as a process
  executeCommand = async (
    processId: string,
    command: string,
    category: ProcessCategory,
    testName?: string,
    platform?: IRunTime,
    options?: any
  ) => {

    console.log(`[ProcessManager] ${processId} ${command}`);
    
    // Validate processId
    if (!processId || typeof processId !== 'string') {
      console.error(`[ProcessManager] Invalid processId: ${processId}. Generating fallback ID.`);
      processId = `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);

    this.addLogEntry(processId, "stdout", `Starting command: ${command}`, new Date(), "info");

    // Create the original promise
    const originalPromise = execAsync(command, {
      ...options,
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large outputs
    })
      .then(({ stdout, stderr }) => {
        // Return stdout and stderr for capture
        return { stdout, stderr };
      })
      .catch((error) => {
        // Ensure error has stdout and stderr
        error.stdout = error.stdout || "";
        error.stderr = error.stderr || "";
        throw error;
      });

    // Add as a promise process which will capture logs and handle errors safely
    const safePromise = this.addPromiseProcessAndGetSafePromise(
      processId,
      originalPromise,
      command,
      category,
      testName,
      platform
    );

    // Return the safe promise that never rejects
    return safePromise;
  };

  // Helper method to add promise process and get the safe promise
  addPromiseProcessAndGetSafePromise = (
    processId: string,
    promise: Promise<any>,
    command: string,
    category: ProcessCategory,
    testName?: string,
    platform?: IRunTime
  ): Promise<{ success: boolean; error?: any; stdout?: string; stderr?: string }> => {
    // Validate processId
    if (!processId || typeof processId !== 'string') {
      console.error(`[ProcessManager] Invalid processId in addPromiseProcessAndGetSafePromise: ${processId}`);
      processId = `invalid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Create a wrapper promise that never rejects to prevent system crashes
    const safePromise = new Promise<{
      success: boolean;
      error?: any;
      stdout?: string;
      stderr?: string;
    }>(async (resolve) => {
      try {
        // Wait for the actual promise to settle
        const result = await promise;
        // If it resolves, we're good
        resolve({
          success: true,
          stdout: result?.stdout,
          stderr: result?.stderr,
        });
      } catch (error: any) {
        // If it rejects, capture stdout and stderr from the error if available
        console.log(
          `[Process ${processId}] Non-critical error:`,
          error.message
        );
        // Try to extract stdout and stderr from the error object
        const stdout = error.stdout || error.output?.[1] || error.message;
        const stderr = error.stderr || error.output?.[2] || error.stack;
        resolve({ success: false, error, stdout, stderr });
      }
    });

    // Store the process info
    const processInfo: ProcessInfo = {
      promise: safePromise,
      status: "running",
      command,
      timestamp: new Date().toISOString(),
      type: "promise",
      category,
      testName,
      platform: platform || "node",
    };

    this.allProcesses.set(processId, processInfo);
    this.runningProcesses.set(processId, safePromise);

    // Set up promise completion handlers
    safePromise
      .then(({ success, error, stdout, stderr }) => {
        const info = this.allProcesses.get(processId);
        if (info) {
          info.status = "completed";
          info.exitCode = success ? 0 : 1;
          // Build a comprehensive error message
          let errorMessage = "";
          if (error) {
            errorMessage = error.message || String(error);
          }
          // Include stdout and stderr in the error field for better debugging
          const details = [];
          if (stdout) details.push(`stdout: ${stdout}`);
          if (stderr) details.push(`stderr: ${stderr}`);
          if (details.length > 0) {
            info.error = `${errorMessage}\n${details.join("\n")}`;
          } else if (errorMessage) {
            info.error = errorMessage;
          }
        }
        this.runningProcesses.delete(processId);

        // Log stdout and stderr separately
        if (stdout) {
          this.addLogEntry(processId, "stdout", stdout, new Date(), "info");
        }
        if (stderr) {
          this.addLogEntry(processId, "stderr", stderr, new Date(), "error");
        }

        const message = success
          ? `Process ${processId} completed successfully`
          : `Process ${processId} completed with non-critical error`;
        this.addLogEntry(processId, success ? "stdout" : "stderr", message, new Date(), success ? "info" : "warn");
      })
      .catch((error) => {
        // This should never happen since safePromise never rejects, but just in case
        const info = this.allProcesses.get(processId);
        if (info) {
          info.status = "completed";
          info.exitCode = 1;
          info.error = error?.message || String(error);
        }
        this.runningProcesses.delete(processId);
        this.addLogEntry(
          processId,
          "stderr",
          `Process ${processId} completed with unexpected error: ${
            error?.message || String(error)
          }`,
          new Date(),
          "error"
        );
      });

    return safePromise;
  };

  // Load aider API keys from .aider.conf.yml
  private loadAiderApiKeys(): Record<string, string> {
    try {
      const configPath = path.join(process.cwd(), '.aider.conf.yml');
      if (!fs.existsSync(configPath)) {
        console.log('[ProcessManager] No .aider.conf.yml file found');
        return {};
      }
      
      const yaml = require('js-yaml');
      const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
      
      const apiKeys: Record<string, string> = {};
      
      // Extract API keys from config
      if (config['openai-api-key']) {
        apiKeys['OPENAI_API_KEY'] = config['openai-api-key'];
      }
      if (config['anthropic-api-key']) {
        apiKeys['ANTHROPIC_API_KEY'] = config['anthropic-api-key'];
      }
      if (config['api-key']) {
        // Handle both string and array
        if (Array.isArray(config['api-key'])) {
          config['api-key'].forEach((key: string, index: number) => {
            apiKeys[`API_KEY_${index}`] = key;
          });
        } else {
          apiKeys['API_KEY'] = config['api-key'];
        }
      }
      
      console.log('[ProcessManager] Loaded API keys from .aider.conf.yml');
      return apiKeys;
    } catch (error) {
      console.error('[ProcessManager] Failed to load API keys from .aider.conf.yml:', error);
      return {};
    }
  }

  // Build the aider base image if not already built
  private async ensureAiderImage(): Promise<boolean> {
    const imageName = 'testeranto-aider:latest';
    const checkImageCmd = `docker images -q ${imageName}`;
    
    const checkResult = await this.executeCommand(
      'aider-image-check',
      checkImageCmd,
      'aider',
      'image-check',
      'node'
    );
    
    if (checkResult.success && checkResult.stdout && checkResult.stdout.trim() !== '') {
      console.log('[ProcessManager] Aider base image already exists');
      return true;
    }
    
    console.log('[ProcessManager] Building aider base image...');
    
    // Create a temporary Dockerfile
    const dockerfileContent = [
      'FROM python:3.11-slim',
      'WORKDIR /workspace',
      'RUN pip install --no-cache-dir aider-chat',
      '# Create a non-root user for security',
      'RUN useradd -m -u 1000 aider && chown -R aider:aider /workspace',
      'USER aider',
      '# Default command starts aider in interactive mode',
      'CMD ["aider", "--yes", "--dark-mode"]'
    ].join('\n');
    
    const tempDir = path.join(process.cwd(), 'testeranto', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const dockerfilePath = path.join(tempDir, 'Dockerfile.aider');
    fs.writeFileSync(dockerfilePath, dockerfileContent);
    
    const buildCmd = `docker build -t ${imageName} -f ${dockerfilePath} ${tempDir}`;
    const buildResult = await this.executeCommand(
      'aider-image-build',
      buildCmd,
      'aider',
      'image-build',
      'node'
    );
    
    // Clean up temp file
    // try {
    //   fs.unlinkSync(dockerfilePath);
    // } catch (e) {
    //   // Ignore cleanup errors
    // }
    
    if (buildResult.success) {
      console.log('[ProcessManager] Aider base image built successfully');
      return true;
    } else {
      console.error('[ProcessManager] Failed to build aider base image:', buildResult.error);
      return false;
    }
  }

  // Create aider process for a specific test as a background command
  createAiderProcess = async (
    runtime: IRunTime,
    testPath: string,
    metafile: IMetaFile
  ): Promise<void> => {
    const processId = `allTests-${runtime}-${testPath}-aider`;
    console.log(`[ProcessManager] Creating aider Docker container: ${processId}`);
    
    // Ensure aider base image exists
    const imageReady = await this.ensureAiderImage();
    if (!imageReady) {
      console.error('[ProcessManager] Cannot create aider container: base image not available');
      this.addLogEntry(processId, "error", "Failed to build aider base image", new Date(), "error");
      return;
    }
    
    // Extract relevant files from metafile for aider context
    const contextFiles: string[] = [];
    if (metafile.metafile && metafile.metafile.inputs) {
      const inputs = metafile.metafile.inputs;
      if (inputs instanceof Map) {
        contextFiles.push(...Array.from(inputs.keys()));
      } else if (typeof inputs === 'object') {
        contextFiles.push(...Object.keys(inputs));
      }
    }
    
    // Filter to relevant source files
    const sourceFiles = contextFiles.filter(file => 
      file.endsWith('.ts') || 
      file.endsWith('.js') || 
      file.endsWith('.py') || 
      file.endsWith('.go')
    ).slice(0, 10); // Limit to first 10 files
    
    // Create a Docker container for aider
    const containerName = `aider-${runtime}-${testPath.replace(/[^a-zA-Z0-9]/g, '-')}`;
    
    // First, check if container is already running
    const checkRunningCmd = `docker ps --filter "name=${containerName}" --filter "status=running" --format "{{.Names}}"`;
    const checkRunningResult = await this.executeCommand(
      `${processId}-check-running`,
      checkRunningCmd,
      "aider",
      testPath,
      runtime
    );
    
    // If container is already running, don't create a new one
    if (checkRunningResult.success && checkRunningResult.stdout && checkRunningResult.stdout.trim() === containerName) {
      console.log(`[ProcessManager] Aider container ${containerName} is already running, skipping creation`);
      this.addLogEntry(processId, "stdout", `Aider Docker container already running: ${containerName}`, new Date(), "info");
      
      // Store container info for tracking
      const processInfo: ProcessInfo = {
        promise: Promise.resolve({ stdout: '', stderr: '' }),
        status: "running",
        command: "docker container already running",
        timestamp: new Date().toISOString(),
        type: "docker",
        category: "aider",
        testName: testPath,
        platform: runtime,
        containerName: containerName,
      } as any;
      
      this.allProcesses.set(processId, processInfo);
      (this.aiderProcesses as any).set(processId, { containerName });
      return;
    }
    
    // Check if container exists but is not running (exited, stopped, etc.)
    const checkAllCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
    const checkAllResult = await this.executeCommand(
      `${processId}-check-all`,
      checkAllCmd,
      "aider",
      testPath,
      runtime
    );
    
    // If container exists but is not running, remove it so we can create a fresh one
    if (checkAllResult.success && checkAllResult.stdout && checkAllResult.stdout.trim() === containerName) {
      console.log(`[ProcessManager] Container ${containerName} exists but is not running, removing...`);
      const removeResult = await this.executeCommand(
        `${processId}-remove`,
        `docker rm -f ${containerName}`,
        "aider",
        testPath,
        runtime
      );
      if (!removeResult.success) {
        console.error(`[ProcessManager] Failed to remove existing container ${containerName}:`, removeResult.error);
      } else {
        console.log(`[ProcessManager] Removed existing container ${containerName}`);
      }
    }
    
    // Load API keys from .aider.conf.yml
    const apiKeys = this.loadAiderApiKeys();
    
    // Build environment variables for API keys
    const envVars = Object.entries(apiKeys).map(([key, value]) => `-e ${key}=${value}`);
    
    // Build the Docker run command using the pre-built aider image
    // Start aider with the relevant source files
    const dockerArgs = [
      'docker', 'run',
      '-d', // Run in detached mode
      '--name', containerName,
      '-v', `${process.cwd()}:/workspace`, // Mount the current directory
      '-w', '/workspace', // Set working directory
      '--network', 'allTests_network', // Use the same network as other services
      ...envVars, // Add API key environment variables
      'testeranto-aider:latest',
      // Pass source files to aider
      ...sourceFiles.slice(0, 5) // Limit to first 5 files to avoid command line being too long
    ];
    
    const command = dockerArgs.join(' ');
    
    // Execute the Docker command
    const result = await this.executeCommand(
      processId,
      command,
      "aider",
      testPath,
      runtime
    );
    
    // Store container info for later management
    const processInfo: ProcessInfo = {
      promise: Promise.resolve({ stdout: '', stderr: '' }),
      status: "running",
      command,
      timestamp: new Date().toISOString(),
      type: "docker",
      category: "aider",
      testName: testPath,
      platform: runtime,
      containerName: containerName,
    } as any;
    
    this.allProcesses.set(processId, processInfo);
    
    // Store container name for later reference
    (this.aiderProcesses as any).set(processId, { containerName });
    
    // Check if container started successfully
    if (result.success) {
      this.addLogEntry(processId, "stdout", `Aider Docker container started: ${containerName}`, new Date(), "info");
      console.log(`[ProcessManager] Aider Docker container ${containerName} started`);
      
      // Get container logs
      setTimeout(async () => {
        const logResult = await this.executeCommand(
          `${processId}-logs`,
          `docker logs ${containerName}`,
          "aider",
          testPath,
          runtime
        );
      }, 2000);
    } else {
      this.addLogEntry(processId, "error", `Failed to start aider Docker container: ${result.error}`, new Date(), "error");
      console.error(`[ProcessManager] Failed to start aider Docker container:`, result.error);
    }
    
    // Provide connection instructions
    const connectionInfo = `To connect to this aider session, use: docker exec -it ${containerName} /bin/bash`;
    this.addLogEntry(processId, "stdout", connectionInfo, new Date(), "info");
    
    // Also provide VS Code terminal command
    const vscodeCommand = `docker exec -it ${containerName} bash -c "aider --yes --dark-mode ${sourceFiles.join(' ')}"`;
    this.addLogEntry(processId, "stdout", `VS Code terminal command: ${vscodeCommand}`, new Date(), "info");
  };

  // Add promise process tracking
  addPromiseProcess = (
    processId: string,
    promise: Promise<any> | undefined,
    command: string,
    category: ProcessCategory,
    testName?: string,
    platform?: IRunTime
  ) => {
    // Handle undefined promise
    const actualPromise = promise || Promise.resolve({ stdout: '', stderr: '' });
    
    // Use the helper method to create a safe promise
    this.addPromiseProcessAndGetSafePromise(
      processId,
      actualPromise,
      command,
      category,
      testName,
      platform
    );
  };

  async scheduleBddTest(
    metafile: IMetaFile,
    runtime: IRunTime,
    entrypoint: string
  ): Promise<void> {
    console.log(
      `[ProcessManager] Scheduling BDD test for ${entrypoint} (${runtime})`
    );

    // Validate entrypoint
    if (!entrypoint || typeof entrypoint !== 'string') {
      console.error(`[ProcessManager] Invalid entrypoint: ${entrypoint}`);
      return;
    }

    // Extract test path from entrypoint
    const testPath = entrypoint.replace(/\.[^/.]+$/, "").replace(/^example\//, "");
    
    // Ensure testPath is valid
    if (!testPath || testPath.trim() === '') {
      console.error(`[ProcessManager] Invalid testPath derived from entrypoint: ${entrypoint}`);
      return;
    }
    
    // Create aider process first
    await this.createAiderProcess(runtime, testPath, metafile);
    
    // Enqueue BDD test with proper process ID pattern
    const processId = `allTests-${runtime}-${testPath}-bdd`;
    console.log(`[ProcessManager] BDD process ID: ${processId}`);
    
    const command = `yarn tsx ${entrypoint}`;
    
    // Instead of using enqueue, we'll execute directly with proper ID
    // The executeCommand now returns a safe promise that never rejects
    const result = await this.executeCommand(
      processId,
      command,
      "bdd-test",
      testPath,
      runtime
    );
    
    // Log the result for debugging
    if (!result.success) {
      console.log(`[ProcessManager] BDD test ${processId} failed:`, result.error?.message);
    }
  }

  async scheduleStaticTests(
    metafile: IMetaFile,
    runtime: IRunTime,
    entrypoint: string,
    addableFiles: string[]
  ): Promise<void> {
    console.log(
      `[ProcessManager] Scheduling Static test for ${entrypoint} (${runtime})`
    );

    // Validate entrypoint
    if (!entrypoint || typeof entrypoint !== 'string') {
      console.error(`[ProcessManager] Invalid entrypoint: ${entrypoint}`);
      return;
    }

    // Extract test path from entrypoint
    const testPath = entrypoint.replace(/\.[^/.]+$/, "").replace(/^example\//, "");
    
    // Ensure testPath is valid
    if (!testPath || testPath.trim() === '') {
      console.error(`[ProcessManager] Invalid testPath derived from entrypoint: ${entrypoint}`);
      return;
    }
    
    // Check if configs[runtime] exists
    if (!this.configs[runtime] || !Array.isArray(this.configs[runtime].checks)) {
      console.error(`[ProcessManager] No checks configured for runtime: ${runtime}`);
      return;
    }
    
    let checkIndex = 0;
    for (const check of this.configs[runtime].checks) {
      const processId = `allTests-${runtime}-${testPath}-${checkIndex}`;
      console.log(`[ProcessManager] Static process ID: ${processId}`);
      
      const command = `${check(addableFiles)}`;
      
      const result = await this.executeCommand(
        processId,
        command,
        "build-time",
        testPath,
        runtime
      );
      
      // Log the result for debugging
      if (!result.success) {
        console.log(`[ProcessManager] Static test ${processId} failed:`, result.error?.message);
      }
      
      checkIndex++;
    }
  }

  shouldShutdown(
    summary: Record<string, any>,
    queueLength: number,
    hasRunningProcesses: boolean,
    mode: string
  ): boolean {
    if (mode === "dev") return false;

    // Check for inflight operations
    const inflight = Object.keys(summary).some(
      (k) =>
        summary[k].prompt === "?" ||
        summary[k].runTimeErrors === "?" ||
        summary[k].staticErrors === "?" ||
        summary[k].typeErrors === "?"
    );

    return !inflight && !hasRunningProcesses && queueLength === 0;
  }

  checkForShutdown = async () => {
    console.log(
      ansiC.inverse(
        `The following jobs are awaiting resources: ${JSON.stringify(
          this.getAllQueueItems()
        )}`
      )
    );

    this.writeBigBoard();

    const summary = this.getSummary();
    const hasRunningProcesses = this.runningProcesses.size > 0;
    const queueLength = this.jobQueue ? this.jobQueue.length : 0;

    if (
      this.shouldShutdown(summary, queueLength, hasRunningProcesses, this.mode)
    ) {
      console.log(
        ansiC.inverse(`${this.projectName} has been tested. Goodbye.`)
      );
    }
  };

  async enqueue(
    runtime: IRunTime,
    command: string,
    addableFiles: string[] = []
  ): Promise<void> {
    // Extract test name from command if possible
    let testName = `test-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    
    // Try to extract a better test name from the command
    const match = command.match(/example\/([^.\s]+)/);
    if (match) {
      testName = match[1];
    }
    
    const testPath = testName;
    // Use a more descriptive process ID that follows the pattern
    // Since this is a queued job, we'll use 'job' as the type
    const processId = `allTests-${runtime}-${testPath}-job`;

    // Broadcast enqueue event
    this.broadcast({
      type: 'enqueue',
      processId,
      runtime,
      command,
      testName,
      testPath,
      addableFiles,
      timestamp: new Date().toISOString(),
      queueLength: this.jobQueue.length + 1, // +1 because we're about to add this job
    });

    // Create a job function for the queue
    const job = async () => {
      console.log(
        ansiC.blue(
          ansiC.inverse(`Processing ${processId} (${runtime}) from queue`)
        )
      );

      // Broadcast dequeue event when job starts processing
      this.broadcast({
        type: 'dequeue',
        processId,
        runtime,
        command,
        testName,
        testPath,
        timestamp: new Date().toISOString(),
        details: 'Started processing job from queue'
      });

      try {
        // Execute the command
        await this.executeCommand(
          processId,
          command,
          "bdd-test",
          testName,
          runtime
        );
      } catch (error) {
        console.error(
          ansiC.red(`Error executing test ${processId} (${runtime}): ${error}`)
        );
      }

      // Remove from queued items after processing
      this.queuedItems = this.queuedItems.filter(
        (item) => item.testName !== testName
      );

      // Update the board and check for shutdown
      this.writeBigBoard();
      this.checkForShutdown();
    };

    // Add the job to the queue
    this.jobQueue.push(job);

    // Track the queued item
    this.queuedItems.push({
      testName,
      runtime,
      addableFiles,
      command,
    });

    console.log(
      `[Queue] Added job ${processId} to queue. Queue length: ${this.jobQueue.length}`
    );
  }

  async checkQueue(
    processQueueItem: (
      testName: string,
      runtime: IRunTime,
      addableFiles: string[]
    ) => Promise<void>,
    writeBigBoard: () => void,
    checkForShutdown: () => void
  ) {
    // The queue library handles processing automatically when autostart is true
    // We just need to ensure it's running
    if (this.jobQueue && !this.jobQueue.running) {
      this.jobQueue.start();
    }

    // Update the board
    writeBigBoard();

    // Check for shutdown if queue is empty and no running processes
    if (
      this.jobQueue &&
      this.jobQueue.length === 0 &&
      this.runningProcesses.size === 0
    ) {
      checkForShutdown();
    }
  }

  // Remove and return the last item from the queue
  pop():
    | { testName: string; runtime: IRunTime; addableFiles?: string[] }
    | undefined {
    // Note: The queue library doesn't support popping specific items easily
    // We'll manage this through our queuedItems tracking
    const item = this.queuedItems.pop();
    if (item) {
      // We can't easily remove from jobQueue once added, but we can track it as removed
      console.warn(
        `[Queue] Item ${item.testName} marked as popped, but may still be in queue`
      );
    }
    return item;
  }

  // Check if a test is in the queue
  includes(testName: string, runtime?: IRunTime): boolean {
    if (runtime !== undefined) {
      return this.queuedItems.some(
        (item) => item.testName === testName && item.runtime === runtime
      );
    }
    return this.queuedItems.some((item) => item.testName === testName);
  }

  // Get the current queue length
  get queueLength(): number {
    return this.jobQueue ? this.jobQueue.length : 0;
  }

  // Clear the entire queue
  clearQueue(): void {
    if (this.jobQueue) {
      this.jobQueue.end();
      this.jobQueue.stop();
    }
    // Create a new queue instance
    this.jobQueue = new Queue();
    this.jobQueue.autostart = true;
    this.jobQueue.concurrency = 1;
    this.queuedItems = [];
  }

  // Get all items in the queue
  getAllQueueItems(): Array<{
    testName: string;
    runtime: IRunTime;
    addableFiles: string[];
  }> {
    return [...this.queuedItems];
  }
}

////////////////////////////////////////////////////////////////
// DEPRECATED
////////////////////////////////////////////////////////////////

// const bddCommands = this.getBddTestCommand(testName, runtime);
// console.log(`[BDD] Commands retrieved:`, bddCommands);
// if (!bddCommands || bddCommands.length === 0) {
//   console.log(
//     `[BDD] No BDD test commands found for ${testName} (${runtime})`
//   );
//   // Try to get default commands

//   console.log(`[BDD] Default commands:`, defaultCommands);
//   if (defaultCommands && defaultCommands.length > 0) {
//     console.log(`[BDD] Using default commands`);

//   }
//   return;
// }

// const defaultCommand = this.getDefaultBddTestCommand(testName, runtime);
// await this.runBddCommandsWithDefaults(
//   testId,
//   testName,
//   runtime,
//   this.getDefaultBddTestCommand(testName, runtime)
// );
// const processId = `bdd-${testId}`;
// console.log(`[BDD] Process ID: ${processId}`);
// await this.executeBddTestInDocker(processId, testName, runtime, command);

// DEPRECATED
// await this.runBddCommandsWithDefaults(
//   testId,
//   testName,
//   runtime,
//   this.getDefaultBddTestCommand(testName, runtime)
// );

// const processId = `bdd-${testId}`;
// console.log(`[BDD] Process ID: ${processId}`);

// await this.executeBddTestInDocker(processId, testName, runtime, command);
