/* eslint-disable @typescript-eslint/no-explicit-any */

import { spawn } from "child_process";
import ansiColors from "ansi-colors";
import { createLogStreams, LogStreams } from "../../clients/utils";
import { IRunTime } from "../../Types";
import { generatePromptFiles } from "../aider/generatePromptFiles";
import fs from "fs";

export class NodeLauncher {
  constructor(
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

        // Wait for the bundle file to exist, similar to nodeScript.ts
        const maxBundleRetries = 60;
        let bundleRetryCount = 0;
        while (
          !fs.existsSync(builtfile) &&
          bundleRetryCount < maxBundleRetries
        ) {
          console.log(
            `Bundle not ready yet (attempt ${
              bundleRetryCount + 1
            }/${maxBundleRetries})`
          );
          bundleRetryCount++;
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (!fs.existsSync(builtfile)) {
          throw new Error(
            `Bundle file ${builtfile} does not exist after waiting`
          );
        }

        console.log("Build is ready. Proceeding with test...");

        // Prepare test resources as a JSON string
        const testResourcesJson = JSON.stringify({
          name: "node-test",
          fs: process.cwd(),
          ports: [],
          browserWSEndpoint: "",
          timeout: 30000,
          retries: 3,
        });

        console.log("launchNode", [builtfile, "3002", testResourcesJson]);

        const child = spawn("node", [builtfile, "3002", testResourcesJson], {
          stdio: ["pipe", "pipe", "pipe"],
          env: {
            ...process.env,
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
        // Re-throw to be caught by the promise handlers
        throw error;
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
