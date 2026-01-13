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

export class Server_ProcessManager extends Server_FS {
  private processExecution: any;
  ports: Record<number, string> = {};
  logStreams: Record<string, ReturnType<typeof createLogStreams>> = {};
  allProcesses: Map<string, ProcessInfo> = new Map();
  processLogs: Map<string, string[]> = new Map();
  runningProcesses: Map<string, Promise<any>> = new Map();
  private jobQueue: any;

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

    this.jobQueue = new Queue();
    this.jobQueue.autostart = true;
    this.jobQueue.concurrency = 1; // Process one job at a time by default

    configs.ports.forEach((port) => {
      this.ports[port] = ""; // set ports as open
    });

    // Initialize processExecution lazily when needed
    this.processExecution = null;

    this.routes({});
  }

  routes(
    routes: Record<string, React.ComponentType<any> | React.ReactElement>
  ) {
    super.routes({
      process_manager: {} as React.ComponentType<any>,
      ...routes,
    });
  }

  async stop() {


    // Stop the queue and wait for current jobs to finish
    if (this.jobQueue) {
      this.jobQueue.end();
      this.jobQueue.stop();
    }

    Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());
    await super.stop();
  }

  getProcessSummary = () => {
    const processes = [];

    for (const [id, info] of this.allProcesses.entries()) {

      if (!id) {
        throw `[ProcessManager] Found process with undefined ID, info: ${info}`;
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


  getProcessLogs = (processId: string): string[] => {
    return this.processLogs.get(processId) || [];
  };

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
    // Parse runtime from processId
    // Process IDs follow pattern: allTests-{runtime}-{testName}-{index}
    // Example: allTests-node-Calculator.test-0
    let runtime = "unknown";
    if (processId.startsWith('allTests-')) {
      const parts = processId.split('-');
      if (parts.length >= 2) {
        runtime = parts[1];
      }
    }

    const logDir = path.join(
      process.cwd(),
      "testeranto",
      "reports",
      this.projectName,
      runtime,
      "example"
    );

    // Extract the filename from processId
    // allTests-node-Calculator.test-0 -> Calculator.test-0.log
    let logFileName = processId;
    if (processId.startsWith('allTests-')) {
      // Remove 'allTests-'
      const withoutPrefix = processId.substring('allTests-'.length);
      // Find the first dash after runtime
      const firstDashIndex = withoutPrefix.indexOf('-');
      if (firstDashIndex !== -1) {
        // Take everything after 'allTests-{runtime}-'
        logFileName = withoutPrefix.substring(firstDashIndex + 1);
      }
    }

    const logFile = path.join(logDir, `${logFileName}.log`);
    const logEntry = `[${timestamp.toISOString()}] [${source}] ${message}\n`;

    fs.appendFileSync(logFile, logEntry);
  }

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

  executeCommand = async (
    processId: string,
    command: string,
    category: ProcessCategory,
    testName?: string,
    platform?: IRunTime,
    options?: any
  ) => {
    // Initialize processExecution if not already done
    if (!this.processExecution) {
      const { ProcessExecution } = await import("./utils/ProcessExecution");
      this.processExecution = new ProcessExecution(
        this.addLogEntry,
        this.allProcesses,
        this.runningProcesses
      );
    }

    return this.processExecution.executeCommand(
      processId,
      command,
      category,
      testName,
      platform,
      options
    );
  };

  addPromiseProcessAndGetSafePromise = async (
    processId: string,
    promise: Promise<any>,
    command: string,
    category: ProcessCategory,
    testName?: string,
    platform?: IRunTime
  ): Promise<{ success: boolean; error?: any; stdout?: string; stderr?: string }> => {
    // Initialize processExecution if not already done
    if (!this.processExecution) {
      const { ProcessExecution } = await import("./utils/ProcessExecution");
      this.processExecution = new ProcessExecution(
        this.addLogEntry,
        this.allProcesses,
        this.runningProcesses
      );
    }

    return this.processExecution.addPromiseProcessAndGetSafePromise(
      processId,
      promise,
      command,
      category,
      testName,
      platform
    );
  };


  addPromiseProcess = async (
    processId: string,
    promise: Promise<any> | undefined,
    command: string,
    category: ProcessCategory,
    testName?: string,
    platform?: IRunTime
  ) => {
    // Handle undefined promise
    const actualPromise = promise || Promise.resolve({ stdout: '', stderr: '' });

    await this.addPromiseProcessAndGetSafePromise(
      processId,
      actualPromise,
      command,
      category,
      testName,
      platform
    );
  };

  async runBddTestInDocker(
    processId: string,
    testPath: string,
    runtime: IRunTime,
    bddCommand: string
  ): Promise<void> {
    const containerName = `bdd-${runtime}-${testPath.replace(/[^a-zA-Z0-9]/g, '-')}`;

    // First, check if container is already running and remove it
    const checkCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
    const checkResult = await this.executeCommand(
      `${processId}-check`,
      checkCmd,
      "bdd-test",
      testPath,
      runtime
    );

    if (checkResult.success && checkResult.stdout && checkResult.stdout.trim() === containerName) {
      // Container exists, remove it
      await this.executeCommand(
        `${processId}-remove`,
        `docker rm -f ${containerName}`,
        "bdd-test",
        testPath,
        runtime
      );
    }

    const baseImage = this.getRuntimeImage(runtime);

    const dockerRunCmd = `docker run --rm \
      --name ${containerName} \
      --network allTests_network \
      -v ${process.cwd()}:/workspace \
      -w /workspace \
      ${baseImage} \
      sh -c "${bddCommand}"`;

    const result = await this.executeCommand(
      processId,
      dockerRunCmd,
      "bdd-test",
      testPath,
      runtime
    );

    if (!result.success) {
      console.log(`[ProcessManager] BDD test ${processId} failed:`, result.error?.message);
    } else {
      console.log(`[ProcessManager] BDD test ${processId} completed successfully`);
    }
  }

  getRuntimeImage(runtime: IRunTime): string {
    switch (runtime) {
      case "node":
        return "bundles-node-build:latest";
      case "web":
        return "bundles-web-build:latest";
      case "python":
        return "bundles-python-build:latest";
      case "golang":
        return "bundles-golang-build:latest";
      default:
        return "alpine:latest";
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
        // Run in a Docker container
        const containerName = `queue-${runtime}-${testPath.replace(/[^a-zA-Z0-9]/g, '-')}`;

        // First, check if container is already running and remove it
        const checkCmd = `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
        const checkResult = await this.executeCommand(
          `${processId}-check`,
          checkCmd,
          "bdd-test",
          testName,
          runtime
        );

        if (checkResult.success && checkResult.stdout && checkResult.stdout.trim() === containerName) {
          await this.executeCommand(
            `${processId}-remove`,
            `docker rm -f ${containerName}`,
            "bdd-test",
            testName,
            runtime
          );
        }

        const baseImage = this.getRuntimeImage(runtime);

        const dockerRunCmd = `docker run --rm \
          --name ${containerName} \
          --network allTests_network \
          -v ${process.cwd()}:/workspace \
          -w /workspace \
          ${baseImage} \
          sh -c "${command}"`;

        await this.executeCommand(
          processId,
          dockerRunCmd,
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

  includes(testName: string, runtime?: IRunTime): boolean {
    if (runtime !== undefined) {
      return this.queuedItems.some(
        (item) => item.testName === testName && item.runtime === runtime
      );
    }
    return this.queuedItems.some((item) => item.testName === testName);
  }

  get queueLength(): number {
    return this.jobQueue ? this.jobQueue.length : 0;
  }

  clearQueue(): void {
    if (this.jobQueue) {
      this.jobQueue.end();
      this.jobQueue.stop();
    }
    this.jobQueue = new Queue();
    this.jobQueue.autostart = true;
    this.jobQueue.concurrency = 1;
    this.queuedItems = [];
  }

  getAllQueueItems(): Array<{
    testName: string;
    runtime: IRunTime;
    addableFiles: string[];
  }> {
    return [...this.queuedItems];
  }
}
