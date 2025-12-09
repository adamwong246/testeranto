import { ChildProcess, spawn } from "child_process";
import fs from "fs";
import { createLogStreams, LogStreams } from "../../clients/utils";
import { generatePromptFiles } from "../aider/generatePromptFiles";
import { IRunTime } from "../../Types";

export class PythonLauncher {
  constructor(
    private projectName: string,
    private httpPort: number,
    private setupTestEnvironment: (
      src: string,
      runtime: IRunTime
    ) => Promise<{
      reportDest: string;
      testResources: string;
      portsToUse: string[];
    }>,
    private handleChildProcess: (
      child: ChildProcess,
      logs: LogStreams,
      reportDest: string,
      src: string,
      runtime: IRunTime
    ) => Promise<void>,
    private cleanupPorts: (portsToUse: string[]) => void,
    private bddTestIsRunning: (src: string) => void,
    private bddTestIsNowDone: (src: string, failures: number) => void,
    private addPromiseProcess: (
      processId: string,
      promise: Promise<any>,
      command: string,
      category: "aider" | "bdd-test" | "build-time" | "other",
      src: string,
      runtime: IRunTime,
      onStart?: () => void,
      onFinish?: () => void
    ) => void,
    private checkQueue: () => void
  ) {}

  async launchPython(src: string, dest: string) {
    console.log(`python < ${src}`);

    const processId = `python-${src}-${Date.now()}`;
    const command = `python test: ${src}`;

    const pythonPromise = (async () => {
      try {
        const { reportDest, testResources, portsToUse } =
          await this.setupTestEnvironment(src, "python");

        const logs = createLogStreams(reportDest, "python");
        if (!logs || typeof logs.writeExitCode !== 'function') {
          console.error('PythonLauncher: logs object is invalid or missing writeExitCode method');
          throw new Error(`Failed to create logs for ${src}`);
        }

        console.log("mark12", src, testResources);

        // Prepare test resources as a JSON string using shared utility
        const { prepareTestResources, escapeForShell } = await import(
          "./TestResourceUtils"
        );
        const testResourcesJson = prepareTestResources(
          testResources,
          portsToUse,
          src,
          reportDest
        );
        console.log("PythonLauncher: testResourcesJson:", testResourcesJson);

        // Escape the JSON for shell command
        const escapedTestResources = escapeForShell(testResourcesJson);

        // Run Python test inside Docker container to ensure consistent environment
        const dockerImage = "python:3.11-alpine";
        const dockerCommand = [
          "docker",
          "run",
          "--rm",
          "-v",
          `${process.cwd()}:/workspace`,
          "-w",
          "/workspace",
          "--network",
          "host", // Use host network to access WebSocket on localhost
          "-e",
          `WS_PORT=${this.httpPort}`,
          dockerImage,
          "sh",
          "-c",
          `pip install websockets>=12.0 > /dev/null 2>&1 && python3 ${escapeForShell(
            src
          )} ${escapedTestResources} "${this.httpPort}"`,
        ];

        console.log("PythonLauncher: dockerCommand:", dockerCommand);
        let child;
        try {
          child = spawn(dockerCommand[0], dockerCommand.slice(1), {
            stdio: ["pipe", "pipe", "pipe"],
          });
          console.log("PythonLauncher: child process created:", child?.pid);
        } catch (spawnError) {
          console.error("PythonLauncher: spawn failed:", spawnError);
          throw spawnError;
        }

        // Handle stdout and stderr normally
        child.stdout?.on("data", (data) => {
          logs.stdout?.write(data);
        });

        child.stderr?.on("data", (data) => {
          logs.stderr?.write(data);
        });

        try {
          await this.handleChildProcess(child, logs, reportDest, src, "python");

          // Generate prompt files for Python tests
          await generatePromptFiles(reportDest, src);
        } finally {
          this.cleanupPorts(portsToUse);
        }
      } catch (error: any) {
        if (error.message !== "No ports available") {
          console.error(`Error in launchPython for ${src}:`, error);
        }
      }
    })();

    // Ensure pythonPromise is defined
    if (!pythonPromise) {
      console.error('PythonLauncher: pythonPromise is undefined for', src);
      throw new Error(`pythonPromise is undefined for ${src}`);
    }
    
    this.addPromiseProcess(
      processId,
      pythonPromise,
      command,
      "bdd-test",
      src,
      "python",
      () => {
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  }
}
