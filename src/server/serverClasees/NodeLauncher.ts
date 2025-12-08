/* eslint-disable @typescript-eslint/no-explicit-any */

import { spawn } from "child_process";
import ansiColors from "ansi-colors";
import { createLogStreams, LogStreams } from "../../clients/utils";
import { IRunTime } from "../../Types";
import { generatePromptFiles } from "../aider/generatePromptFiles";
import fs from "fs";
import path from "path";

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

        // Ensure setupTestEnvironment is callable
        if (typeof this.setupTestEnvironment !== "function") {
          throw new Error(
            `NodeLauncher: setupTestEnvironment is not a function. It is ${typeof this
              .setupTestEnvironment}. Check ServerTestExecutor setup.`
          );
        }
        const setupResult = await this.setupTestEnvironment(src, "node");
        const { reportDest, testResources, portsToUse } = setupResult;
        console.log("setupResult portsToUse:", portsToUse);

        const builtfile = dest;
        const logs = createLogStreams(reportDest, "node");

        // Log the path we're waiting for
        console.log(`NodeLauncher: Waiting for bundle at ${builtfile}`);
        console.log(`Current working directory: ${process.cwd()}`);

        // Check if file exists immediately
        if (fs.existsSync(builtfile)) {
          console.log(`Bundle file exists immediately at ${builtfile}`);
        } else {
          console.log(`Bundle file does not exist yet at ${builtfile}`);
          // List the directory to see what's there
          const dir = path.dirname(builtfile);
          if (fs.existsSync(dir)) {
            console.log(`Directory ${dir} exists, contents:`);
            try {
              const files = fs.readdirSync(dir);
              files.forEach((file) => {
                console.log(`  ${file}`);
              });
            } catch (e) {
              console.log(`Could not read directory ${dir}: ${e.message}`);
            }
          } else {
            console.log(`Directory ${dir} does not exist`);
          }
        }

        // Wait for the bundle file to exist, similar to nodeScript.ts
        const maxBundleRetries = 30; // Reduced from 60 to fail faster
        let bundleRetryCount = 0;
        while (
          !fs.existsSync(builtfile) &&
          bundleRetryCount < maxBundleRetries
        ) {
          console.log(
            `Bundle not ready yet (attempt ${
              bundleRetryCount + 1
            }/${maxBundleRetries}) at path: ${builtfile}`
          );
          bundleRetryCount++;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Reduced to 1 second
        }

        if (!fs.existsSync(builtfile)) {
          // Try to find any .mjs file in the directory
          const dir = path.dirname(builtfile);
          if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            const mjsFiles = files.filter((f) => f.endsWith(".mjs"));
            console.log(`Found .mjs files in ${dir}:`, mjsFiles);
            if (mjsFiles.length > 0) {
              // Use the first .mjs file
              const alternativePath = path.join(dir, mjsFiles[0]);
              console.log(`Trying alternative path: ${alternativePath}`);
              if (fs.existsSync(alternativePath)) {
                console.log(
                  `Using alternative bundle file: ${alternativePath}`
                );
                // Update builtfile to the alternative path
                // Note: We need to pass this to spawn, so we'll adjust
                // For now, let's throw an error with more information
                throw new Error(
                  `Expected bundle file ${builtfile} does not exist, but found ${alternativePath}. ` +
                    `This suggests a path mismatch between build and launch configurations.`
                );
              }
            }
          }
          throw new Error(
            `Bundle file ${builtfile} does not exist after waiting. ` +
              `Current directory: ${process.cwd()}. ` +
              `Make sure the build process is creating the correct bundle.`
          );
        }

        console.log(`Build is ready at ${builtfile}. Proceeding with test...`);

        // Prepare test resources as a JSON string
        // Use the testResources from setupResult, which should include proper ports
        // If testResources is a string, parse it first
        let testResourcesObj;
        if (typeof testResources === "string") {
          try {
            testResourcesObj = JSON.parse(testResources);
          } catch (e) {
            console.error("Failed to parse testResources string:", e);
            testResourcesObj = {};
          }
        } else {
          testResourcesObj = testResources || {};
        }

        // Ensure ports are included
        if (portsToUse && portsToUse.length > 0) {
          // Convert port strings to numbers
          testResourcesObj.ports = portsToUse.map((p) => parseInt(p, 10));
        } else {
          testResourcesObj.ports = testResourcesObj.ports || [];
        }

        // Make sure other required fields are present
        testResourcesObj.name = testResourcesObj.name || "node-test";
        testResourcesObj.fs = testResourcesObj.fs || process.cwd();
        testResourcesObj.browserWSEndpoint =
          testResourcesObj.browserWSEndpoint || "";
        testResourcesObj.timeout = testResourcesObj.timeout || 30000;
        testResourcesObj.retries = testResourcesObj.retries || 3;

        const testResourcesJson = JSON.stringify(testResourcesObj);

        // Determine which port to pass to the test
        // Use the first port from portsToUse, or default to 3002
        const portToUse =
          portsToUse && portsToUse.length > 0 ? portsToUse[0] : "3002";

        console.log("launchNode", [builtfile, portToUse, testResourcesJson]);
        console.log(
          `Full command: node ${builtfile} ${portToUse} ${testResourcesJson.substring(
            0,
            100
          )}...`
        );
        console.log("Test resources ports:", testResourcesObj.ports);
        console.log("Port being passed to test:", portToUse);

        // Verify the bundle file is readable
        try {
          const stats = fs.statSync(builtfile);
          console.log(`Bundle file size: ${stats.size} bytes`);
        } catch (e) {
          console.error(`Cannot access bundle file ${builtfile}:`, e.message);
          throw new Error(
            `Bundle file ${builtfile} is not accessible: ${e.message}`
          );
        }

        const child = spawn("node", [builtfile, portToUse, testResourcesJson], {
          stdio: ["pipe", "pipe", "pipe"],
          env: {
            ...process.env,
            NODE_OPTIONS: "--enable-source-maps",
          },
        });

        // Log child process events
        child.on("error", (error) => {
          console.error(
            `Failed to start child process for ${builtfile}:`,
            error
          );
        });

        child.on("spawn", () => {
          console.log(
            `Child process spawned for ${builtfile} with PID: ${child.pid}`
          );
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
