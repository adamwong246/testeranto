import { ChildProcess, spawn } from "child_process";
import fs from "fs";
import path from "path";
import { createLogStreams, LogStreams } from "../../clients/utils";
import { generatePromptFiles } from "../aider/generatePromptFiles";
import { IRunTime } from "../../Types";

export class PythonLauncher {
  constructor(
    private projectName: string,
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

        // Determine Python command
        const venvPython = `./venv/bin/python3`;
        const pythonCommand = fs.existsSync(venvPython)
          ? venvPython
          : "python3";

        // Pass WebSocket port via environment variable for congruence
        const child = spawn(pythonCommand, [src, testResources], {
          stdio: ["pipe", "pipe", "pipe"],
          env: {
            ...process.env,
            WS_PORT: "3000",
          },
        });

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
