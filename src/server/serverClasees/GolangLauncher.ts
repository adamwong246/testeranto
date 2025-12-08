import { ChildProcess, spawn } from "child_process";
import fs from "fs";
import path from "path";
import { createLogStreams, LogStreams } from "../../clients/utils";
import { generatePromptFiles } from "../aider/generatePromptFiles";
import { processGoTestOutput } from "../golang/processGoTestOutput";
import { IRunTime } from "../../Types";
import { ChildProcessHandler } from "./ChildProcessHandler";

export class GolangLauncher {
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

  async launchGolang(src: string, dest: string): Promise<void> {
    const { default: ansiC } = await import("ansi-colors");
    console.log(ansiC.green(ansiC.inverse(`goland < ${src}`)));

    const processId = `golang-${src}-${Date.now()}`;
    const command = `golang test: ${src}`;

    const golangPromise = (async () => {
      try {
        const { reportDest, testResources, portsToUse } =
          await this.setupTestEnvironment(src, "golang");

        const logs = createLogStreams(reportDest, "golang");

        // For Go tests, we need to run from the directory containing the go.mod file
        // Find the nearest go.mod file by walking up the directory tree
        let currentDir = path.dirname(src);
        let goModDir = null;

        while (currentDir !== path.parse(currentDir).root) {
          if (fs.existsSync(path.join(currentDir, "go.mod"))) {
            goModDir = currentDir;
            break;
          }
          currentDir = path.dirname(currentDir);
        }

        if (!goModDir) {
          console.error(`Could not find go.mod file for test ${src}`);
          // Try running from the test file's directory as a fallback
          goModDir = path.dirname(src);
          console.error(`Falling back to: ${goModDir}`);
        }

        // Get the relative path to the test file from the go.mod directory
        const relativeTestPath = path.relative(goModDir, src);

        // Pass WebSocket port (3000) via environment variable
        // The Go test should connect to WebSocket at ws://localhost:3000
        const child = spawn(
          "go",
          ["test", "-v", "-json", "./" + path.dirname(relativeTestPath)],
          {
            stdio: ["pipe", "pipe", "pipe"],
            env: {
              ...process.env,
              TEST_RESOURCES: testResources,
              WS_PORT: "3000", // Pass WebSocket port
              GO111MODULE: "on",
            },
            cwd: goModDir,
          }
        );

        // Handle stdout and stderr normally
        child.stdout?.on("data", (data) => {
          logs.stdout?.write(data);
        });

        child.stderr?.on("data", (data) => {
          logs.stderr?.write(data);
        });

        await this.handleChildProcess(child, logs, reportDest, src, "golang");

        // Generate prompt files for Golang tests
        generatePromptFiles(reportDest, src);

        // Ensure tests.json exists by parsing the go test JSON output
        processGoTestOutput(reportDest, src);

        this.cleanupPorts(portsToUse);
      } catch (error) {
        if (error.message !== "No ports available") {
          throw error;
        }
      }
    })();

    this.addPromiseProcess(
      processId,
      golangPromise,
      command,
      "bdd-test",
      src,
      "golang",
      () => {
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  }
}
