/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import { spawn } from "child_process";
import ansiColors from "ansi-colors";
import { createLogStreams, LogStreams } from "../../clients/utils";
import { IRunTime } from "../../Types";
import { generatePromptFiles } from "../aider/generatePromptFiles";

export class NodeLauncher {
  constructor(
    private projectName: string,
    private setupTestEnvironment: (
      src: string,
      runtime: IRunTime
    ) => Promise<any>,
    private cleanupPorts: (portsToUse: string[]) => void,
    private handleChildProcess: (
      child: any,
      logs: LogStreams,
      reportDest: string,
      src: string,
      runtime: IRunTime
    ) => Promise<void>,
    private bddTestIsRunning: (src: string) => void,
    private bddTestIsNowDone: (src: string, failures: number) => void,
    private addPromiseProcess: (
      processId: string,
      promise: Promise<any>,
      command: string,
      category: "aider" | "bdd-test" | "build-time" | "other",
      entrypoint: string,
      platform: IRunTime,
      onResolve?: () => void,
      onReject?: () => void
    ) => void,
    private checkQueue: () => void
  ) {}

  async launchNode(src: string, dest: string): Promise<void> {
    console.log(ansiColors.green(ansiColors.inverse(`node < ${src}`)));

    const processId = `node-${src}-${Date.now()}`;
    const command = `node test: ${src}`;

    const nodePromise = (async () => {
      try {
        this.bddTestIsRunning(src);

        const setupResult = await this.setupTestEnvironment(src, "node");
        const { reportDest, testResources, portsToUse } = setupResult;

        const builtfile = dest;
        const logs = createLogStreams(reportDest, "node");

        // Spawn without IPC - use only stdio pipes
        // Pass WebSocket port via environment variable for congruence
        const child = spawn("node", [builtfile, testResources], {
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
          await this.handleChildProcess(child, logs, reportDest, src, "node");

          // Generate prompt files for Node tests
          generatePromptFiles(reportDest, src);
        } finally {
          this.cleanupPorts(portsToUse);
        }
      } catch (error: any) {
        if (error.message !== "No ports available") {
          console.error(`Error in launchNode for ${src}:`, error);
        }
      }
    })();

    this.addPromiseProcess(
      processId,
      nodePromise,
      command,
      "bdd-test",
      src,
      "node",
      () => {
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  }
}
