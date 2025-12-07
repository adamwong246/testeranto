/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { default as ansiC, default as ansiColors } from "ansi-colors";
import fs from "fs";
import { ChildProcess, spawn } from "node:child_process";
import path from "node:path";
import { ConsoleMessage } from "puppeteer-core";
import { IFinalResults, IRunTime } from "../lib/index.js";
import {
  createLogStreams,
  LogStreams,
  statusMessagePretty,
} from "../clients/utils.js";
import { Queue } from "../clients/utils/queue.js";

import { getRunnables, webEvaluator } from "./utils.js";
import { server } from "typescript";
import { PM_2_WithTCP } from "./PM_2_WithTCP.js";

const files: Record<string, Set<string>> = {};
const screenshots: Record<string, Promise<Uint8Array>[]> = {};

export class PM_4_Main extends PM_2_WithTCP {
  constructor(configs: any, name: string, mode: string) {
    super(configs, name, mode);
  }

  launchNode = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`node < ${src}`)));

    const processId = `node-${src}-${Date.now()}`;
    const command = `node test: ${src}`;

    const nodePromise = (async () => {
      try {
        const { reportDest, testResources, portsToUse } =
          await this.setupTestEnvironment(src, "node");

        const builtfile = dest;
        const ipcfile = "/tmp/tpipe_" + Math.random();
        const logs = createLogStreams(reportDest, "node");

        let buffer = Buffer.from("");
        const queue = new Queue<string[]>();

        const onData = (data: Buffer) => {
          buffer = Buffer.concat([buffer, data]);

          // Process complete JSON messages
          for (let b = 0; b < buffer.length + 1; b++) {
            const c = buffer.slice(0, b);
            try {
              const d = JSON.parse(c.toString());
              queue.enqueue(d);
              buffer = buffer.slice(b);
              b = 0;
            } catch (e) {
              // Continue processing
            }
          }

          // Process messages
          while (queue.size() > 0) {
            const message = queue.dequeue();
            if (message) {
              this.mapping().forEach(async ([command, func]) => {
                if (message[0] === command) {
                  const args = message.slice(1, -1);
                  try {
                    const result = await (this as any)[command](...args);
                    child.send(
                      JSON.stringify({
                        payload: result,
                        key: message[message.length - 1],
                      })
                    );
                  } catch (error) {
                    console.error(`Error handling command ${command}:`, error);
                  }
                }
              });
            }
          }
        };

        // const server = await this.createIpcServer(onData, ipcfile);
        const child = spawn("node", [builtfile, testResources, ipcfile], {
          stdio: ["pipe", "pipe", "pipe", "ipc"],
        });

        try {
          await this.handleChildProcess(child, logs, reportDest, src, "node");

          // Generate prompt files for Node tests
          await this.generatePromptFiles(reportDest, src);
        } finally {
          server.close();
          this.cleanupPorts(portsToUse);
        }
      } catch (error: any) {
        if (error.message !== "No ports available") {
          console.error(`Error in launchNode for ${src}:`, error);
          // Don't throw the error, just log it and continue
          // This allows other tests to run even if this one fails
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
        // When the promise resolves, check the queue for more tests
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        // When the promise rejects, check the queue for more tests
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  };

  launchWeb = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`web < ${src}`)));

    const processId = `web-${src}-${Date.now()}`;
    const command = `web test: ${src}`;

    // Create the promise
    const webPromise = (async () => {
      try {
        this.bddTestIsRunning(src);

        const reportDest = `testeranto/reports/${this.projectName}/${src
          .split(".")
          .slice(0, -1)
          .join(".")}/web`;
        if (!fs.existsSync(reportDest)) {
          fs.mkdirSync(reportDest, { recursive: true });
        }

        const destFolder = dest.replace(".mjs", "");
        const htmlPath = `${destFolder}.html`;

        const webArgz = JSON.stringify({
          name: src,
          ports: [].toString(),
          fs: reportDest,
          browserWSEndpoint: this.browser.wsEndpoint(),
        });

        const logs = createLogStreams(reportDest, "web");

        // Use HTTP URL instead of file:// to allow WebSocket connections
        const httpPort = Number(process.env.HTTP_PORT) || 3000;

        // Check if HTML file exists
        if (!fs.existsSync(htmlPath)) {
          console.error(`HTML file not found: ${htmlPath}`);
          console.log(`Current directory: ${process.cwd()}`);
          console.log(`Looking for HTML file at: ${htmlPath}`);
          throw new Error(`HTML file not found for web test ${src}`);
        }

        // Convert HTML file path to relative URL under /bundles/web/
        // htmlPath is something like: /Users/adam/Code/testeranto/testeranto/bundles/web/allTests/example/Calculator.test.html
        // We need: /bundles/web/allTests/example/Calculator.test.html
        let relativePath: string;
        const match = htmlPath.match(/testeranto\/bundles\/web\/(.*)/);
        if (match) {
          relativePath = match[1];
        } else {
          // Try to extract from absolute path
          const absMatch = htmlPath.match(/\/bundles\/web\/(.*)/);
          if (absMatch) {
            relativePath = absMatch[1];
          } else {
            // Fallback: just use the filename
            relativePath = path.basename(htmlPath);
          }
        }

        const url = `http://localhost:${httpPort}/bundles/web/${relativePath}`;
        console.log(
          `Navigating to ${url} (HTML file exists: ${fs.existsSync(htmlPath)})`
        );

        const page = await this.browser.newPage();

        page.on("console", (log: ConsoleMessage) => {
          const msg = `${log.text()}\n`;
          switch (log.type()) {
            case "info":
              logs.info?.write(msg);
              break;
            case "warn":
              logs.warn?.write(msg);
              break;
            case "error":
              logs.error?.write(msg);
              break;
            case "debug":
              logs.debug?.write(msg);
              break;
            default:
              break;
          }
        });

        page.on("close", () => {
          logs.writeExitCode(0);
          logs.closeAll();
        });

        // Expose functions
        this.mapping().forEach(([command, func]) => {
          if (command === "page") {
            page.exposeFunction(command, (x?) => {
              if (x) {
                return func(x);
              } else {
                return func(page.mainFrame()._id);
              }
            });
          } else {
            page.exposeFunction(command, func);
          }
        });

        const close = () => {
          logs.info?.write("close2");
          if (!files[src]) {
            files[src] = new Set();
          }
          delete files[src];
          Promise.all(screenshots[src] || []).then(() => {
            delete screenshots[src];
          });
        };

        page.on("pageerror", (err: Error) => {
          logs.info?.write("pageerror: " + err.message);
          console.error("Page error in web test:", err);
          logs.writeExitCode(-1, err);
          console.log(
            ansiColors.red(
              `web ! ${src} failed to execute. No "tests.json" file was generated. Check ${reportDest}/error.log for more info`
            )
          );
          this.bddTestIsNowDone(src, -1);
          close();
          throw err;
        });

        // Log console messages for debugging
        page.on("console", (msg) => {
          const text = msg.text();
          console.log(`Browser console [${msg.type()}]: ${text}`);
        });

        // Navigate to the HTML page
        await page.goto(url, { waitUntil: "networkidle0" });

        // Inject test resource configuration into the page
        await page.evaluate((config) => {
          (window as any).__TEST_RESOURCE_CONFIG__ = config;
        }, webArgz);

        // The HTML page loads the JS bundle, but we need to actually run the test
        // Use webEvaluator to import and run the test module
        // First, get the JS file path from the dest
        const jsPath = dest;
        // Convert to relative URL for the browser
        let jsRelativePath: string;
        const jsMatch = jsPath.match(/testeranto\/bundles\/web\/(.*)/);
        if (jsMatch) {
          jsRelativePath = jsMatch[1];
        } else {
          const jsAbsMatch = jsPath.match(/\/bundles\/web\/(.*)/);
          if (jsAbsMatch) {
            jsRelativePath = jsAbsMatch[1];
          } else {
            jsRelativePath = path.basename(jsPath);
          }
        }
        const jsUrl = `/bundles/web/${jsRelativePath}?cacheBust=${Date.now()}`;

        // Evaluate the test using webEvaluator
        const evaluation = webEvaluator(jsUrl, webArgz);
        console.log("Evaluating web test with URL:", jsUrl);

        try {
          const results = (await page.evaluate(evaluation)) as IFinalResults;
          const { fails, failed, features } = results;
          logs.info?.write("\n idk1");
          statusMessagePretty(fails, src, "web");
          this.bddTestIsNowDone(src, fails);
        } catch (error) {
          console.error("Error evaluating web test:", error);
          logs.info?.write("\n Error evaluating web test");
          statusMessagePretty(-1, src, "web");
          this.bddTestIsNowDone(src, -1);
        }

        // Generate prompt files for Web tests
        await this.generatePromptFiles(reportDest, src);

        await page.close();
        close();
      } catch (error) {
        console.error(`Error in web test ${src}:`, error);
        this.bddTestIsNowDone(src, -1);
        throw error;
      }
    })();

    // Add to process manager
    this.addPromiseProcess(
      processId,
      webPromise,
      command,
      "bdd-test",
      src,
      "web",
      () => {
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  };

  launchPython = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`python < ${src}`)));

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

        const ipcfile = "/tmp/tpipe_python_" + Math.random();
        const child = spawn(pythonCommand, [src, testResources, ipcfile], {
          stdio: ["pipe", "pipe", "pipe", "ipc"],
        });

        // IPC server setup is similar to Node
        let buffer = Buffer.from("");
        const queue = new Queue<string[]>();

        const onData = (data: Buffer) => {
          buffer = Buffer.concat([buffer, data]);

          for (let b = 0; b < buffer.length + 1; b++) {
            const c = buffer.slice(0, b);
            try {
              const d = JSON.parse(c.toString());
              queue.enqueue(d);
              buffer = buffer.slice(b);
              b = 0;
            } catch (e) {
              // Continue processing
            }
          }

          while (queue.size() > 0) {
            const message = queue.dequeue();
            if (message) {
              this.mapping().forEach(async ([command, func]) => {
                if (message[0] === command) {
                  const args = message.slice(1, -1);
                  try {
                    const result = await (this as any)[command](...args);
                    child.send(
                      JSON.stringify({
                        payload: result,
                        key: message[message.length - 1],
                      })
                    );
                  } catch (error) {
                    console.error(`Error handling command ${command}:`, error);
                  }
                }
              });
            }
          }
        };

        // const server = await this.createIpcServer(onData, ipcfile);

        try {
          await this.handleChildProcess(child, logs, reportDest, src, "python");

          // Generate prompt files for Python tests
          await this.generatePromptFiles(reportDest, src);
        } finally {
          server.close();
          this.cleanupPorts(portsToUse);
        }
      } catch (error: any) {
        if (error.message !== "No ports available") {
          console.error(`Error in launchNode for ${src}:`, error);
          // Don't re-throw to allow other tests to continue
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
  };

  launchGolang = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`goland < ${src}`)));

    const processId = `golang-${src}-${Date.now()}`;
    const command = `golang test: ${src}`;

    const golangPromise = (async () => {
      try {
        const { reportDest, testResources, portsToUse } =
          await this.setupTestEnvironment(src, "golang");

        const logs = createLogStreams(reportDest, "golang");

        // Create IPC file path
        const ipcfile =
          "/tmp/tpipe_golang_" + Math.random().toString(36).substring(2);

        let buffer = Buffer.from("");
        const queue = new Queue<string[]>();

        const onData = (data: Buffer) => {
          buffer = Buffer.concat([buffer, data]);

          // Process complete JSON messages
          for (let b = 0; b < buffer.length + 1; b++) {
            const c = buffer.slice(0, b);
            try {
              const d = JSON.parse(c.toString());
              queue.enqueue(d);
              buffer = buffer.slice(b);
              b = 0;
            } catch (e) {
              // Continue processing
            }
          }

          // Process messages
          while (queue.size() > 0) {
            const message = queue.dequeue();
            if (message) {
              this.mapping().forEach(async ([command, func]) => {
                if (message[0] === command) {
                  const args = message.slice(1, -1);
                  try {
                    const result = await (this as any)[command](...args);
                    // Send response back through IPC
                    // This would need to be implemented based on your IPC protocol
                  } catch (error) {
                    console.error(`Error handling command ${command}:`, error);
                  }
                }
              });
            }
          }
        };

        // Create IPC server like in launchNode
        // const server = await this.createIpcServer(onData, ipcfile);

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

        // Run go test from the directory containing go.mod
        const child = spawn(
          "go",
          ["test", "-v", "-json", "./" + path.dirname(relativeTestPath)],
          {
            stdio: ["pipe", "pipe", "pipe"],
            env: {
              ...process.env,
              TEST_RESOURCES: testResources,
              IPC_FILE: ipcfile,
              GO111MODULE: "on",
            },
            cwd: goModDir,
          }
        );

        await this.handleChildProcess(child, logs, reportDest, src, "golang");

        // Generate prompt files for Golang tests
        await this.generatePromptFiles(reportDest, src);

        // Ensure tests.json exists by parsing the go test JSON output
        await this.processGoTestOutput(reportDest, src);

        // Clean up
        server.close();
        try {
          fs.unlinkSync(ipcfile);
        } catch (e) {
          // Ignore errors during cleanup
        }
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
  };

  private async processGoTestOutput(
    reportDest: string,
    src: string
  ): Promise<void> {
    const testsJsonPath = `${reportDest}/tests.json`;

    // Parse the stdout.log to extract test results from JSON output
    const stdoutPath = `${reportDest}/stdout.log`;
    if (fs.existsSync(stdoutPath)) {
      try {
        const stdoutContent = fs.readFileSync(stdoutPath, "utf-8");
        const lines = stdoutContent.split("\n").filter((line) => line.trim());

        const testResults = {
          tests: [],
          features: [],
          givens: [],
          fullPath: path.resolve(process.cwd(), src),
        };

        // Parse each JSON line from go test output
        for (const line of lines) {
          try {
            const event = JSON.parse(line);
            if (event.Action === "pass" || event.Action === "fail") {
              testResults.tests.push({
                name: event.Test || event.Package,
                status: event.Action === "pass" ? "passed" : "failed",
                time: event.Elapsed ? `${event.Elapsed}s` : "0s",
              });
            }
          } catch (e) {
            // Skip non-JSON lines
          }
        }

        fs.writeFileSync(testsJsonPath, JSON.stringify(testResults, null, 2));
        return;
      } catch (error) {
        console.error("Error processing go test output:", error);
      }
    }

    // Fallback: create a basic tests.json if processing fails
    const basicTestResult = {
      tests: [],
      features: [],
      givens: [],
      fullPath: path.resolve(process.cwd(), src),
    };
    fs.writeFileSync(testsJsonPath, JSON.stringify(basicTestResult, null, 2));
  }

  private async generatePromptFiles(
    reportDest: string,
    src: string
  ): Promise<void> {
    try {
      // Ensure the report directory exists
      if (!fs.existsSync(reportDest)) {
        fs.mkdirSync(reportDest, { recursive: true });
      }

      // Create message.txt
      const messagePath = `${reportDest}/message.txt`;
      const messageContent = `There are 3 types of test reports.
1) bdd (highest priority)
2) type checker
3) static analysis (lowest priority)

"tests.json" is the detailed result of the bdd tests.
if these files do not exist, then something has gone badly wrong and needs to be addressed.

"type_errors.txt" is the result of the type checker.
if this file does not exist, then type check passed without errors;

"lint_errors.txt" is the result of the static analysis.
if this file does not exist, then static analysis passed without errors;

BDD failures are the highest priority. Focus on passing BDD tests before addressing other concerns.
Do not add error throwing/catching to the tests themselves.`;

      fs.writeFileSync(messagePath, messageContent);

      // Create prompt.txt
      const promptPath = `${reportDest}/prompt.txt`;

      const promptContent = `/read node_modules/testeranto/docs/index.md
/read node_modules/testeranto/docs/style.md
/read node_modules/testeranto/docs/testing.ai.txt
/read node_modules/testeranto/src/CoreTypes.ts

/read ${reportDest}/tests.json
/read ${reportDest}/type_errors.txt
/read ${reportDest}/lint_errors.txt

/read ${reportDest}/stdout.log
/read ${reportDest}/stderr.log
/read ${reportDest}/exit.log
/read ${reportDest}/message.txt`;

      fs.writeFileSync(promptPath, promptContent);
    } catch (error) {
      console.error(`Failed to generate prompt files for ${src}:`, error);
    }
  }
}
