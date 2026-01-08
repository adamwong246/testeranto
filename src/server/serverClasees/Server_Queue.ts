import { default as ansiC } from "ansi-colors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { IBuiltConfig, IRunTime } from "../../Types";
import { IMode } from "../types";
import { Server_Writer } from "./Server_Writer";
import { QueueManager } from "./utils/QueueManager";
import {
  formatStaticAnalysisOutput,
  generateDockerCommand,
  generateTestId,
  sanitizeCommandForFilename,
  shouldShutdown,
} from "./utils/QueueUtils";

export class Server_Queue extends Server_Writer {
  private queueManager: QueueManager;

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
    this.queueManager = new QueueManager();
  }

  public addTestToSchedulingQueue(
    testId: string,
    testName: string,
    runtime: IRunTime,
    ws: any
  ): void {
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
      this.processSchedulingQueue();
    }
  }

  private async processSchedulingQueue(): Promise<void> {
    if (
      this.processingSchedulingQueue ||
      this.testSchedulingQueue.length === 0
    ) {
      return;
    }

    this.processingSchedulingQueue = true;

    try {
      while (this.testSchedulingQueue.length > 0) {
        const item = this.testSchedulingQueue.shift();
        if (!item) continue;

        const { testId, testName, runtime, ws } = item;

        let allocatedPorts: number[] | null = null;
        const testResourceConfiguration: any = {
          name: testName,
          fs: process.cwd(),
          ports: [],
          timeout: 30000,
          retries: 3,
          environment: {},
        };

        switch (runtime) {
          case "web":
            allocatedPorts = this.allocatePorts(2, testName);
            testResourceConfiguration.ports = allocatedPorts || [3000, 3001];
            testResourceConfiguration.browserWSEndpoint =
              process.env.BROWSER_WS_ENDPOINT || "";
            break;
          default:
            allocatedPorts = this.allocatePorts(1, testName);
            testResourceConfiguration.ports = allocatedPorts || [3000];
        }

        // if (ws.readyState === WebSocket.OPEN) {
        //   const testResourceConfig: ITestResourceConfiguration = {
        //     name: testName,
        //     fs: process.cwd(),
        //     ports: testResourceConfiguration.ports,
        //     timeout: testResourceConfiguration.timeout,
        //     retries: testResourceConfiguration.retries,
        //     environment: testResourceConfiguration.environment,
        //   };
        //   if (
        //     runtime === "web" &&
        //     testResourceConfiguration.browserWSEndpoint
        //   ) {
        //     testResourceConfig.browserWSEndpoint =
        //       testResourceConfiguration.browserWSEndpoint;
        //   }

        //   const message = {
        //     type: "testResource",
        //     data: {
        //       testId,
        //       testName,
        //       runtime,
        //       allocatedAt: new Date().toISOString(),
        //       testResourceConfiguration: testResourceConfig,
        //     },
        //     timestamp: new Date().toISOString(),
        //   };

        //   try {
        //     ws.send(JSON.stringify(message));
        //   } catch (error) {
        //     this.testSchedulingQueue.unshift(item);
        //   }
        // } else {
        //   this.testSchedulingQueue.unshift(item);
        // }
      }
    } finally {
      this.processingSchedulingQueue = false;
    }
  }

  getSchedulingQueueMethod() {
    return this.addTestToSchedulingQueue.bind(this);
  }

  protected scheduleTestForExecution(
    testId: string,
    testName: string,
    runtime: any,
    ws: any
  ): void {
    if (!(this as any).testInfoMap) {
      (this as any).testInfoMap = new Map();
    }
    (this as any).testInfoMap.set(testId, { testName, runtime });

    this.addTestToSchedulingQueue(testId, testName, runtime, ws);
  }

  protected async processQueueItem(
    testName: string,
    runtime: IRunTime,
    addableFiles?: string[]
  ): Promise<void> {
    const testId = generateTestId("queue");
    await this.runStaticAnalysis(testId, testName, runtime);
    await this.scheduleBddTest(testId, testName, runtime);
  }

  private async runStaticAnalysis(
    testId: string,
    testName: string,
    runtime: IRunTime
  ): Promise<void> {
    const staticAnalysisCommands = this.getStaticAnalysisCommands(
      testName,
      runtime
    );
    if (!staticAnalysisCommands || staticAnalysisCommands.length === 0) {
      return;
    }

    const processId = `static-${testId}`;

    for (const command of staticAnalysisCommands) {
      try {
        await this.executeStaticAnalysisInDocker(
          processId,
          testName,
          runtime,
          command
        );
      } catch (error) {
        // Continue with other commands
      }
    }
  }

  private async executeStaticAnalysisInDocker(
    processId: string,
    testName: string,
    runtime: IRunTime,
    command: string
  ): Promise<void> {
    const promise = new Promise<void>(async (resolve, reject) => {
      const execAsync = promisify(exec);
      const cwd = process.cwd();
      const dockerCommand = generateDockerCommand(
        runtime,
        processId,
        command,
        cwd
      );

      try {
        const { stdout, stderr } = await execAsync(dockerCommand, {
          maxBuffer: 10 * 1024 * 1024,
        });

        await this.writeStaticAnalysisOutput(
          processId,
          testName,
          runtime,
          command,
          stdout,
          stderr
        );
        resolve();
      } catch (error: any) {
        if (error.stdout || error.stderr) {
          await this.writeStaticAnalysisOutput(
            processId,
            testName,
            runtime,
            command,
            error.stdout || "",
            error.stderr || error.message
          );
        }
        reject(error);
      }
    });

    if ((this as any).addPromiseProcess) {
      (this as any).addPromiseProcess(
        `${processId}-${command.substring(0, 20)}`,
        promise,
        `Static analysis for ${testName}: ${command}`,
        "build-time",
        testName,
        runtime
      );
    }

    try {
      await promise;
    } catch (error) {
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
    const reportDest = `testeranto/reports/${
      this.projectName || "default"
    }/${testName}/${runtime}/static-analysis`;

    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }

    const sanitizedCommand = sanitizeCommandForFilename(command, 50);
    const timestamp = Date.now();
    const outputFile = path.join(
      reportDest,
      `${sanitizedCommand}_${timestamp}.log`
    );

    const outputContent = formatStaticAnalysisOutput(
      command,
      processId,
      testName,
      runtime,
      stdout,
      stderr
    );

    fs.writeFileSync(outputFile, outputContent);

    this.addLogEntry(
      processId,
      "stdout",
      `Static analysis completed: ${command}. Output written to ${outputFile}`
    );
  }

  private getStaticAnalysisCommands(
    testName: string,
    runtime: IRunTime
  ): string[] | null {
    const config = (this as any).configs;
    if (!config) {
      return null;
    }

    let checkItem: any;

    switch (runtime) {
      case "node":
        checkItem = config.node?.check;
        break;
      case "web":
        checkItem = config.web?.check;
        break;
      case "python":
        checkItem = config.python?.check;
        break;
      case "golang":
        checkItem = config.golang?.check;
        break;
      default:
        return null;
    }

    const commands: string[] = [];

    if (Array.isArray(checkItem)) {
      for (const item of checkItem) {
        if (typeof item === "function") {
          try {
            const command = item(testName);
            if (command && typeof command === "string") {
              commands.push(command);
            }
          } catch (error) {
            // Ignore error
          }
        }
      }
    } else if (typeof checkItem === "string") {
      commands.push(
        checkItem.replace("${x}", testName).replace("$x", testName)
      );
    } else if (typeof checkItem === "function") {
      try {
        const command = checkItem(testName);
        if (command && typeof command === "string") {
          commands.push(command);
        }
      } catch (error) {
        // Ignore error
      }
    }

    return commands.length > 0 ? commands : null;
  }

  private async scheduleBddTest(
    testId: string,
    testName: string,
    runtime: IRunTime
  ): Promise<void> {
    const processId = `bdd-${testId}`;

    const promise = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });

    if ((this as any).addPromiseProcess) {
      (this as any).addPromiseProcess(
        processId,
        promise,
        `BDD test for ${testName}`,
        "bdd-test",
        testName,
        runtime
      );
    }

    try {
      await promise;
    } catch (error) {
      // Ignore error
    }
  }

  checkQueue = async () => {
    await this.queueManager.checkQueue(
      this.processQueueItem.bind(this),
      this.writeBigBoard.bind(this),
      this.checkForShutdown.bind(this)
    );
  };

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
    const hasRunningProcesses = Array.from(this.allProcesses.values()).some(
      (process) => process.status === "running"
    );
    const isQueueEmpty = this.queueManager.queueLength === 0;

    if (
      shouldShutdown(
        summary,
        isQueueEmpty ? 0 : this.queueManager.queueLength,
        hasRunningProcesses,
        this.mode
      )
    ) {
      console.log(
        ansiC.inverse(`${this.projectName} has been tested. Goodbye.`)
      );
    }
  };

  addLogEntry(
    processId: string,
    source: "stdout" | "stderr" | "console" | "network" | "error",
    message: string
  ): void {
    if ((this as any).addLogEntry) {
      (this as any).addLogEntry(processId, source, message);
    } else {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${source}] ${message}`);
    }
  }

  addToQueue(
    src: string,
    runtime: IRunTime,
    configs: any,
    projectName: string,
    cleanupTestProcesses: (testName: string) => void,
    checkQueue: () => void,
    addableFiles?: string[]
  ) {
    this.queueManager.addToQueue(
      src,
      runtime,
      configs,
      projectName,
      cleanupTestProcesses,
      checkQueue,
      addableFiles
    );
  }

  pop():
    | { testName: string; runtime: IRunTime; addableFiles?: string[] }
    | undefined {
    return this.queueManager.pop();
  }

  includes(testName: string, runtime?: IRunTime): boolean {
    return this.queueManager.includes(testName, runtime);
  }

  get queueLength(): number {
    return this.queueManager.queueLength;
  }

  clearQueue(): void {
    this.queueManager.clearQueue();
  }

  getAllQueueItems(): Array<{
    testName: string;
    runtime: IRunTime;
    addableFiles?: string[];
  }> {
    return this.queueManager.getAllQueueItems();
  }
}
