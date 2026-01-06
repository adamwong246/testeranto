import { default as ansiC } from "ansi-colors";
import { WebSocket } from "ws";
import { IBuiltConfig, IRunTime } from "../../Types";
import { ITestResourceConfiguration } from "../../lib/tiposkripto";
import { IMode } from "../types";
import { getRunnables } from "../utils";
import { ServerWriter } from "./ServerWriter";

export class Server_Queue extends ServerWriter {
  queue: Array<{
    testName: string;
    runtime: IRunTime;
    addableFiles?: string[];
  }> = [];
  private processingQueue: boolean = false;

  private testSchedulingQueue: Array<{
    testId: string;
    testName: string;
    runtime: IRunTime;
    ws: any;
    timestamp: Date;
  }> = [];
  private processingSchedulingQueue: boolean = false;

  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);
  }

  // Method to add test to scheduling queue (called from WebSocket handler)
  public addTestToSchedulingQueue(
    testId: string,
    testName: string,
    runtime: IRunTime,
    ws: any
  ): void {
    console.log(
      `[SCHEDULING] addTestToSchedulingQueue called for test ${testId} (${testName})`
    );
    // Check if test is already in queue
    const alreadyInQueue = this.testSchedulingQueue.some(
      (item) => item.testId === testId
    );
    if (!alreadyInQueue) {
      this.testSchedulingQueue.push({
        testId,
        testName,
        runtime,
        ws,
        timestamp: new Date(),
      });
      console.log(
        `[SCHEDULING] Added test ${testName} (${testId}) to scheduling queue. Queue length: ${this.testSchedulingQueue.length}`
      );
      // Try to process the scheduling queue
      this.processSchedulingQueue();
    } else {
      console.log(
        `[SCHEDULING] Test ${testName} (${testId}) is already in scheduling queue`
      );
    }
  }

  // Process the scheduling queue to allocate test resources
  private async processSchedulingQueue(): Promise<void> {
    console.log(
      `[SCHEDULING] processSchedulingQueue called. Queue length: ${this.testSchedulingQueue.length}, processing: ${this.processingSchedulingQueue}`
    );
    if (
      this.processingSchedulingQueue ||
      this.testSchedulingQueue.length === 0
    ) {
      console.log(
        `[SCHEDULING] Skipping processing: processing=${
          this.processingSchedulingQueue
        }, empty=${this.testSchedulingQueue.length === 0}`
      );
      return;
    }

    this.processingSchedulingQueue = true;
    console.log(`[SCHEDULING] Started processing scheduling queue`);

    try {
      while (this.testSchedulingQueue.length > 0) {
        const item = this.testSchedulingQueue.shift();
        if (!item) continue;

        const { testId, testName, runtime, ws } = item;

        console.log(
          `[SCHEDULING] Processing test ${testName} (${testId}) from scheduling queue`
        );

        // Allocate test resources based on runtime
        let allocatedPorts: number[] | null = null;
        const testResourceConfiguration: any = {
          name: testName,
          fs: process.cwd(),
          ports: [],
          timeout: 30000,
          retries: 3,
          environment: {},
        };

        // Allocate ports based on runtime requirements
        switch (runtime) {
          case "web":
            allocatedPorts = this.allocatePorts(2, testName); // Web tests often need multiple ports
            testResourceConfiguration.ports = allocatedPorts || [3000, 3001];
            testResourceConfiguration.browserWSEndpoint =
              process.env.BROWSER_WS_ENDPOINT || "";
            break;
          case "node":
            allocatedPorts = this.allocatePorts(1, testName);
            testResourceConfiguration.ports = allocatedPorts || [3000];
            break;
          case "python":
            allocatedPorts = this.allocatePorts(1, testName);
            testResourceConfiguration.ports = allocatedPorts || [3000];
            break;
          case "golang":
            allocatedPorts = this.allocatePorts(1, testName);
            testResourceConfiguration.ports = allocatedPorts || [3000];
            break;
          default:
            allocatedPorts = this.allocatePorts(1, testName);
            testResourceConfiguration.ports = allocatedPorts || [3000];
        }

        console.log(
          `[SCHEDULING] Allocated ports for test ${testId}:`,
          allocatedPorts
        );

        const testResource = {
          testId,
          testName,
          runtime,
          allocatedAt: new Date().toISOString(),
          testResourceConfiguration,
          // Add the test to the main processing queue
          shouldExecute: true,
        };

        if (ws.readyState === WebSocket.OPEN) {
          const testResourceConfig: ITestResourceConfiguration = {
            name: testName,
            fs: process.cwd(),
            ports: testResourceConfiguration.ports,
            timeout: testResourceConfiguration.timeout,
            retries: testResourceConfiguration.retries,
            environment: testResourceConfiguration.environment,
          };
          // Add browserWSEndpoint for web runtime
          if (
            runtime === "web" &&
            testResourceConfiguration.browserWSEndpoint
          ) {
            testResourceConfig.browserWSEndpoint =
              testResourceConfiguration.browserWSEndpoint;
          }

          const message = {
            type: "testResource",
            data: {
              testId,
              testName,
              runtime,
              allocatedAt: new Date().toISOString(),
              testResourceConfiguration: testResourceConfig,
            },
            timestamp: new Date().toISOString(),
          };

          try {
            ws.send(JSON.stringify(message));

            // Do NOT add to the main processing queue - the client will handle execution
          } catch (error) {
            console.error(`[SCHEDULING] Error sending test resource:`, error);
            // Put back in queue or handle error
            console.log(
              `[SCHEDULING] Putting test ${testId} back to the front of the queue due to send error`
            );
            this.testSchedulingQueue.unshift(item);
          }
        } else {
          console.warn(
            `[SCHEDULING] WebSocket for test ${testName} (${testId}) is not open (readyState: ${ws.readyState}), cannot send resource`
          );
          // Put back in queue or handle error
          console.log(
            `[SCHEDULING] Putting test ${testId} back to the front of the queue`
          );
          this.testSchedulingQueue.unshift(item);
        }
      }
    } finally {
      this.processingSchedulingQueue = false;
    }
  }

  // Override to ensure we have access to the method from WebSocket handler
  // We'll add a getter to access addTestToSchedulingQueue
  getSchedulingQueueMethod() {
    return this.addTestToSchedulingQueue.bind(this);
  }

  // Override scheduleTestForExecution to use the scheduling queue
  protected scheduleTestForExecution(
    testId: string,
    testName: string,
    runtime: any,
    ws: any
  ): void {
    console.log(
      `[ServerTaskCoordinator] scheduleTestForExecution called for test ${testId}`
    );
    // Store test information for later use in result handling
    // First, ensure testInfoMap exists (it's in the parent class)
    if (!(this as any).testInfoMap) {
      (this as any).testInfoMap = new Map();
    }
    (this as any).testInfoMap.set(testId, { testName, runtime });
    console.log(`[ServerTaskCoordinator] Stored test info for ${testId}:`, {
      testName,
      runtime,
    });

    this.addTestToSchedulingQueue(testId, testName, runtime, ws);
  }

  // addToQueue(src: string, runtime: IRunTime, addableFiles?: string[]) {
  //   this.addToQueue(
  //     src,
  //     runtime,
  //     this.configs,
  //     this.projectName,
  //     this.cleanupTestProcesses.bind(this),
  //     this.checkQueue.bind(this),
  //     addableFiles
  //   );
  // }

  private cleanupTestProcessesInternal(testName: string) {
    // Use the integrated process management to clean up processes
    // const cleanedProcessIds = this.cleanupTestProcesses(testName);
    // if (cleanedProcessIds.length > 0) {
    //   console.log(
    //     `Cleaned up ${cleanedProcessIds.length} processes for test: ${testName}`
    //   );
    // }
  }

  protected async processQueueItem(
    testName: string,
    runtime: IRunTime,
    addableFiles?: string[]
  ): Promise<void> {
    console.log(
      `[Queue] Processing test ${testName} (${runtime}) from main queue`
    );

    // Generate a unique test ID
    const testId = `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Run static analysis first
    await this.runStaticAnalysis(testId, testName, runtime);
    
    // Schedule BDD test execution
    await this.scheduleBddTest(testId, testName, runtime);
  }

  private async runStaticAnalysis(
    testId: string,
    testName: string,
    runtime: IRunTime
  ): Promise<void> {
    console.log(`[Queue] Starting static analysis for ${testId} (${testName}, ${runtime})`);
    
    // Get the static analysis commands from config
    const staticAnalysisCommands = this.getStaticAnalysisCommands(testName, runtime);
    if (!staticAnalysisCommands || staticAnalysisCommands.length === 0) {
      console.log(`[Queue] No static analysis commands for ${runtime}, skipping`);
      return;
    }
    
    const processId = `static-${testId}`;
    
    // For each static analysis command, run it in a Docker container
    for (const command of staticAnalysisCommands) {
      try {
        await this.executeStaticAnalysisInDocker(
          processId,
          testName,
          runtime,
          command
        );
      } catch (error) {
        console.error(`[Queue] Static analysis command failed: ${command}`, error);
        // Continue with other commands even if one fails
      }
    }
  }

  private async executeStaticAnalysisInDocker(
    processId: string,
    testName: string,
    runtime: IRunTime,
    command: string
  ): Promise<void> {
    console.log(`[Queue] Executing static analysis in Docker: ${command}`);
    
    // Create a promise that runs the command in a Docker container
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        // Import child_process to execute docker commands
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);
        
        // Determine the Docker image based on runtime - use the corresponding build image
        let dockerImage: string;
        switch (runtime) {
          case 'node':
            dockerImage = 'bundles-node-build:latest';
            break;
          case 'web':
            dockerImage = 'bundles-web-build:latest';
            break;
          case 'python':
            dockerImage = 'bundles-python-build:latest';
            break;
          case 'golang':
            dockerImage = 'bundles-golang-build:latest';
            break;
          default:
            dockerImage = 'bundles-node-build:latest';
        }
        
        // Create a temporary container to run the command
        // Mount the current directory to access source files
        const cwd = process.cwd();
        const containerName = `static-${processId}-${Date.now()}`;
        
        // Prepare the command to run in the container
        // The build images already have all necessary dependencies installed
        let dockerCommand = `docker run --rm --name ${containerName} `;
        dockerCommand += `-v "${cwd}:/workspace" `;
        dockerCommand += `-w /workspace `;
        // Use the same network as the docker-compose services for consistency
        dockerCommand += `--network allTests_network `;
        dockerCommand += `${dockerImage} `;
        
        // The build images should have all necessary tools installed
        // We can run the command directly
        dockerCommand += `sh -c "${command}"`;
        
        console.log(`[Queue] Running Docker command: ${dockerCommand.substring(0, 200)}...`);
        
        // Execute the command
        const { stdout, stderr } = await execAsync(dockerCommand, {
          maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        });
        
        // Write output to log files
        await this.writeStaticAnalysisOutput(
          processId,
          testName,
          runtime,
          command,
          stdout,
          stderr
        );
        
        console.log(`[Queue] Static analysis command completed: ${command}`);
        resolve();
      } catch (error: any) {
        console.error(`[Queue] Docker command failed:`, error);
        
        // Still write any output that might have been captured
        if (error.stdout || error.stderr) {
          await this.writeStaticAnalysisOutput(
            processId,
            testName,
            runtime,
            command,
            error.stdout || '',
            error.stderr || error.message
          );
        }
        reject(error);
      }
    });
    
    // Add to process tracking
    if ((this as any).addPromiseProcess) {
      (this as any).addPromiseProcess(
        `${processId}-${command.substring(0, 20)}`,
        promise,
        `Static analysis for ${testName}: ${command}`,
        'build-time',
        testName,
        runtime
      );
    }
    
    try {
      await promise;
    } catch (error) {
      console.error(`[Queue] Static analysis failed for ${processId}:`, error);
      throw error;
    }
  }

  private async writeStaticAnalysisOutput(
    processId: string,
    testName: string,
    runtime: IRunTime,
    command: string,
    stdout: string,
    stderr: string
  ): Promise<void> {
    // Determine the report directory
    const reportDest = `testeranto/reports/${this.projectName || 'default'}/${testName}/${runtime}/static-analysis`;
    
    // Ensure the directory exists
    const fs = await import('fs');
    const path = await import('path');
    
    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }
    
    // Create a sanitized filename from the command
    const sanitizedCommand = command.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
    const timestamp = Date.now();
    const outputFile = path.join(reportDest, `${sanitizedCommand}_${timestamp}.log`);
    
    // Write the output
    const outputContent = [
      `Command: ${command}`,
      `Timestamp: ${new Date().toISOString()}`,
      `Process ID: ${processId}`,
      `Test: ${testName}`,
      `Runtime: ${runtime}`,
      '\n=== STDOUT ===\n',
      stdout,
      '\n=== STDERR ===\n',
      stderr,
      '\n=== END ===\n'
    ].join('\n');
    
    fs.writeFileSync(outputFile, outputContent);
    
    console.log(`[Queue] Static analysis output written to: ${outputFile}`);
    
    // Also add to process logs for monitoring
    this.addLogEntry(
      processId,
      'stdout',
      `Static analysis completed: ${command}. Output written to ${outputFile}`
    );
  }

  private getStaticAnalysisCommands(testName: string, runtime: IRunTime): string[] | null {
    // Get static analysis commands from config
    const config = (this as any).configs;
    if (!config) {
      return null;
    }
    
    // Based on runtime, get the appropriate static analysis commands
    // The config has check functions that take a filename and return a command
    let checkItem: any;
    
    switch (runtime) {
      case 'node':
        checkItem = config.node?.check;
        break;
      case 'web':
        checkItem = config.web?.check;
        break;
      case 'python':
        checkItem = config.python?.check;
        break;
      case 'golang':
        checkItem = config.golang?.check;
        break;
      default:
        return null;
    }
    
    // Handle different types of check items
    const commands: string[] = [];
    
    if (Array.isArray(checkItem)) {
      // It's an array of functions
      for (const item of checkItem) {
        if (typeof item === 'function') {
          try {
            const command = item(testName);
            if (command && typeof command === 'string') {
              commands.push(command);
            }
          } catch (error) {
            console.error(`[Queue] Error generating command from check function:`, error);
          }
        }
      }
    } else if (typeof checkItem === 'string') {
      // It's a single command string
      commands.push(checkItem.replace('${x}', testName).replace('$x', testName));
    } else if (typeof checkItem === 'function') {
      // It's a single function
      try {
        const command = checkItem(testName);
        if (command && typeof command === 'string') {
          commands.push(command);
        }
      } catch (error) {
        console.error(`[Queue] Error generating command from check function:`, error);
      }
    }
    
    return commands.length > 0 ? commands : null;
  }

  private async scheduleBddTest(
    testId: string,
    testName: string,
    runtime: IRunTime
  ): Promise<void> {
    console.log(`[Queue] Scheduling BDD test for ${testId} (${testName}, ${runtime})`);
    
    // For BDD tests, we need to allocate resources and start a test container
    // This should be done through the scheduling queue with a real WebSocket
    // However, since we're in the main queue processing, we need a different approach
    
    // Create a real WebSocket connection to the test service
    // For now, we'll create a promise that simulates starting a BDD test container
    const processId = `bdd-${testId}`;
    
    const promise = new Promise<void>((resolve, reject) => {
      console.log(`[Queue] Starting BDD test container for ${testId}`);
      
      // In a real implementation, this would:
      // 1. Start a Docker container for the BDD test
      // 2. Connect to it via WebSocket
      // 3. Wait for test completion
      
      // Simulate the process
      setTimeout(() => {
        console.log(`[Queue] BDD test completed for ${testId}`);
        resolve();
      }, 5000);
    });
    
    // Add to process tracking
    if ((this as any).addPromiseProcess) {
      (this as any).addPromiseProcess(
        processId,
        promise,
        `BDD test for ${testName}`,
        'bdd-test',
        testName,
        runtime
      );
    }
    
    try {
      await promise;
    } catch (error) {
      console.error(`[Queue] BDD test failed for ${testId}:`, error);
    }
  }

  private getStaticAnalysisCommand(testName: string, runtime: IRunTime): string | null {
    // Get static analysis commands from config
    // This is a simplified implementation
    const config = (this as any).configs;
    if (!config) {
      return null;
    }
    
    // Based on runtime, get the appropriate static analysis command
    switch (runtime) {
      case 'node':
        // Use eslint and tsc from config
        return `eslint ${testName} && tsc --noEmit ${testName}`;
      case 'web':
        return `eslint ${testName} && tsc --noEmit ${testName}`;
      case 'python':
        return `pylint ${testName}`;
      case 'golang':
        return `golangci-lint run ${testName}`;
      default:
        return null;
    }
  }

  checkQueue = async () => {
    // Don't start processing if we're already processing
    if (this.processingQueue) {
      return;
    }

    this.processingQueue = true;

    try {
      while (this.queue.length > 0) {
        // Get the next test from the queue (FIFO)
        const item = this.queue.shift();
        if (!item) {
          continue;
        }

        const { testName, runtime, addableFiles } = item;

        console.log(
          ansiC.blue(
            ansiC.inverse(`Processing ${testName} (${runtime}) from queue`)
          )
        );

        try {
          await this.processQueueItem(testName, runtime, addableFiles);
        } catch (error) {
          console.error(
            ansiC.red(`Error executing test ${testName} (${runtime}): ${error}`)
          );
        }

        // Update the queue after processing
        this.writeBigBoard();
      }
    } finally {
      this.processingQueue = false;
    }

    // Check if we should shut down after processing all tests
    this.checkForShutdown();
  };

  checkForShutdown = async () => {
    // Don't check the queue here to avoid recursion
    // The queue is already checked by checkQueue before calling this method

    console.log(
      ansiC.inverse(
        `The following jobs are awaiting resources: ${JSON.stringify(
          this.getAllQueueItems()
        )}`
      )
    );

    this.writeBigBoard();

    if (this.mode === "dev") return;

    let inflight = false;
    const summary = this.getSummary();

    Object.keys(summary).forEach((k) => {
      if (summary[k].prompt === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 prompt ${k}`)));
        inflight = true;
      }
    });

    Object.keys(summary).forEach((k) => {
      if (summary[k].runTimeErrors === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 runTimeError ${k}`)));
        inflight = true;
      }
    });

    Object.keys(summary).forEach((k) => {
      if (summary[k].staticErrors === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 staticErrors ${k}`)));
        inflight = true;
      }
    });

    Object.keys(summary).forEach((k) => {
      if (summary[k].typeErrors === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 typeErrors ${k}`)));
        inflight = true;
      }
    });

    this.writeBigBoard();

    // Check if we should shut down
    if (!inflight) {
      // Check if there are any processes still running
      const hasRunningProcesses = Array.from(this.allProcesses.values()).some(
        (process) => process.status === "running"
      );

      // Check if the queue is empty
      const isQueueEmpty = this.queueLength === 0;

      if (!hasRunningProcesses && isQueueEmpty) {
        console.log(
          ansiC.inverse(`${this.projectName} has been tested. Goodbye.`)
        );
        // Optionally, we could exit the process
        // process.exit();
      }
    }
  };

  // Add log entry for monitoring
  private addLogEntry(
    processId: string,
    source: "stdout" | "stderr" | "console" | "network" | "error",
    message: string
  ): void {
    // Try to use parent's addLogEntry if available
    if ((this as any).addLogEntry) {
      (this as any).addLogEntry(processId, source, message);
    } else {
      // Fallback to console
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${source}] ${message}`);
    }
  }

  // QueueManager methods
  addToQueue(
    src: string,
    runtime: IRunTime,
    configs: any,
    projectName: string,
    cleanupTestProcesses: (testName: string) => void,
    checkQueue: () => void,
    addableFiles?: string[]
  ) {
    // Store the original src for logging
    const originalSrc = src;

    // Ensure we're using the original test source path, not a bundle path
    // The src parameter might be a bundle path from metafile changes
    // We need to find the corresponding test source path

    // First, check if this looks like a bundle path (contains 'testeranto/bundles')
    if (src.includes("testeranto/bundles")) {
      // Try to find the original test name that corresponds to this bundle
      const runnables = getRunnables(configs, projectName);
      const allEntryPoints = [
        ...Object.entries(runnables.nodeEntryPoints),
        ...Object.entries(runnables.webEntryPoints),
        ...Object.entries(runnables.pythonEntryPoints),
        ...Object.entries(runnables.golangEntryPoints),
      ];

      // Normalize the source path for comparison
      const normalizedSrc = src.replace(/\\/g, "/");

      // First, try to match by extracting the test name from the bundle path
      // Pattern: .../testeranto/bundles/{runtime}/{projectName}/{testPath}.mjs
      const bundlePattern = new RegExp(
        `testeranto/bundles/${runtime}/${projectName}/(.+\\.)mjs$`
      );
      const match = normalizedSrc.match(bundlePattern);
      if (match) {
        // Reconstruct the test name by replacing .mjs with .ts
        const testNameWithoutExt = match[1].slice(0, -1); // Remove trailing dot
        const potentialTestName = testNameWithoutExt + ".ts";

        // Verify this test name exists in the entry points
        for (const [testName, bundlePath] of allEntryPoints) {
          if (testName === potentialTestName) {
            src = testName;
            console.log(
              "Mapped bundle path to test name:",
              originalSrc,
              "->",
              src
            );
            break;
          }
        }
      }

      // If we still haven't found a match, try the original approach
      if (src === originalSrc) {
        for (const [testName, bundlePath] of allEntryPoints) {
          const normalizedBundlePath = (bundlePath as string).replace(
            /\\/g,
            "/"
          );
          // Check if the source path ends with the bundle path
          if (normalizedSrc.endsWith(normalizedBundlePath)) {
            src = testName;
            console.log("Fallback mapping:", originalSrc, "->", src);
            break;
          }
        }
      }
    }

    // First, clean up any existing processes for this test
    this.cleanupTestProcessesInternal(src);

    // Add the test to the queue (using the original test source path and runtime)
    // Make sure we don't add duplicates (consider both name and runtime)
    const alreadyInQueue = this.queue.some(
      (item) => item.testName === src && item.runtime === runtime
    );

    if (!alreadyInQueue) {
      this.queue.push({ testName: src, runtime, addableFiles });
      console.log(
        ansiC.green(
          ansiC.inverse(`Added ${src} (${runtime}) to the processing queue`)
        )
      );
      // Try to process the queue
      checkQueue();
    } else {
      console.log(
        ansiC.yellow(
          ansiC.inverse(
            `Test ${src} (${runtime}) is already in the queue, skipping`
          )
        )
      );
    }
  }

  pop():
    | { testName: string; runtime: IRunTime; addableFiles?: string[] }
    | undefined {
    return this.queue.pop();
  }

  includes(testName: string, runtime?: IRunTime): boolean {
    if (runtime !== undefined) {
      return this.queue.some(
        (item) => item.testName === testName && item.runtime === runtime
      );
    }
    return this.queue.some((item) => item.testName === testName);
  }

  get queueLength(): number {
    return this.queue.length;
  }

  clearQueue(): void {
    this.queue = [];
  }

  getAllQueueItems(): Array<{
    testName: string;
    runtime: IRunTime;
    addableFiles?: string[];
  }> {
    return [...this.queue];
  }
}
