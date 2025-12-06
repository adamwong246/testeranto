/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { default as ansiC, default as ansiColors } from "ansi-colors";
import fs from "fs";
import net from "net";
import { ChildProcess, spawn } from "node:child_process";
import path from "node:path";
import { ConsoleMessage } from "puppeteer-core";
import { WebSocketServer } from "ws";
import esbuildNodeConfiger from "../../esbuildConfigs/node.js";
// import esbuildImportConfiger from "../../esbuildConfigs/pure.js";
import esbuildWebConfiger from "../../esbuildConfigs/web.js";
import { IFinalResults, IRunTime } from "../../lib/index.js";
import {
  createLogStreams,
  LogStreams,
  statusMessagePretty,
} from "../../PM/utils.js";
import { Queue } from "../../utils/queue.js";
import { PM_WithHelpo } from "./PM_WithHelpo.js";
import { getRunnables, webEvaluator } from "./utils.js";
// import { evaluationString } from "puppeteer-core/lib/esm/puppeteer/index-browser.js";

const files: Record<string, Set<string>> = {};
const screenshots: Record<string, Promise<Uint8Array>[]> = {};

export class PM_Main extends PM_WithHelpo {
  constructor(configs: any, name: string, mode: string) {
    super(configs, name, mode);
  }

  async startBuildProcesses(): Promise<void> {
    const { nodeEntryPoints, webEntryPoints } = getRunnables(
      this.configs,
      this.projectName
    );

    console.log(`Starting build processes for ${this.projectName}...`);
    console.log(`  Node entry points: ${Object.keys(nodeEntryPoints).length}`);
    console.log(`  Web entry points: ${Object.keys(webEntryPoints).length}`);
    // console.log(`  Pure entry points: ${Object.keys(pureEntryPoints).length}`);

    // Start all build processes (only node, web, pure)
    await Promise.all([
      this.startBuildProcess(esbuildNodeConfiger, nodeEntryPoints, "node"),
      this.startBuildProcess(esbuildWebConfiger, webEntryPoints, "web"),
      // this.startBuildProcess(esbuildImportConfiger, pureEntryPoints, "pure"),
    ]);
  }

  private async setupTestEnvironment(
    src: string,
    runtime: IRunTime
  ): Promise<{
    reportDest: string;
    testConfig: any;
    testConfigResource: any;
    portsToUse: string[];
    testResources: string;
    wsPort: number;
  }> {
    this.bddTestIsRunning(src);

    const reportDest = `testeranto/reports/${this.projectName}/${src
      .split(".")
      .slice(0, -1)
      .join(".")}/${runtime}`;

    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }

    const testConfig = this.configTests().find((t) => t[0] === src);
    if (!testConfig) {
      console.log(
        ansiC.inverse(`missing test config! Exiting ungracefully for '${src}'`)
      );
      process.exit(-1);
    }

    const testConfigResource = testConfig[2];

    const portsToUse: string[] = [];
    let testResources = "";

    // Find an available port for WebSocket connection
    const wsPort = await this.findAvailablePort();

    if (testConfigResource.ports === 0) {
      testResources = JSON.stringify({
        name: src,
        ports: [],
        fs: reportDest,
        browserWSEndpoint: this.browser ? this.browser.wsEndpoint() : "",
        wsPort: wsPort,
        wsHost: "localhost",
      });
    } else if (testConfigResource.ports > 0) {
      const openPorts = Object.entries(this.ports).filter(
        ([, status]) => status === ""
      );

      if (openPorts.length >= testConfigResource.ports) {
        for (let i = 0; i < testConfigResource.ports; i++) {
          portsToUse.push(openPorts[i][0]);
          this.ports[openPorts[i][0]] = src;
        }

        testResources = JSON.stringify({
          scheduled: true,
          name: src,
          ports: portsToUse,
          fs: reportDest,
          browserWSEndpoint: this.browser ? this.browser.wsEndpoint() : "",
          wsPort: wsPort,
          wsHost: "localhost",
        });
      } else {
        console.log(
          ansiC.red(
            `${runtime}: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again when a port is available`
          )
        );
        this.queue.push(src);
        throw new Error("No ports available");
      }
    } else {
      console.error("negative port makes no sense", src);
      process.exit(-1);
    }

    return {
      reportDest,
      testConfig,
      testConfigResource,
      portsToUse,
      testResources,
      wsPort,
    };
  }

  private async findAvailablePort(): Promise<number> {
    return new Promise((resolve, reject) => {
      const server = net.createServer();
      server.listen(0, () => {
        const address = server.address();
        const port =
          typeof address === "string"
            ? parseInt(address.split(":").pop() || "0")
            : address?.port || 0;
        server.close(() => {
          resolve(port);
        });
      });
      server.on("error", reject);
    });
  }

  private cleanupPorts(portsToUse: string[]) {
    portsToUse.forEach((port) => {
      this.ports[port] = "";
    });
  }

  private createIpcServer(
    onData: (data: Buffer) => void,
    ipcfile: string
  ): Promise<net.Server> {
    return new Promise((resolve, reject) => {
      const server = net.createServer((socket) => {
        socket.on("data", onData);
      });

      server.listen(ipcfile, () => {
        resolve(server);
      });

      server.on("error", (err) => reject(err));
    });
  }

  private handleChildProcess(
    child: ChildProcess,
    logs: LogStreams,
    reportDest: string,
    src: string,
    runtime: IRunTime
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      child.stdout?.on("data", (data) => {
        logs.stdout?.write(data);
      });

      child.stderr?.on("data", (data) => {
        logs.stderr?.write(data);
      });

      child.on("close", (code) => {
        const exitCode = code === null ? -1 : code;
        if (exitCode < 0) {
          logs.writeExitCode(
            exitCode,
            new Error("Process crashed or was terminated")
          );
        } else {
          logs.writeExitCode(exitCode);
        }
        logs.closeAll();

        if (exitCode === 0) {
          this.bddTestIsNowDone(src, 0);
          statusMessagePretty(0, src, runtime);
          resolve();
        } else {
          console.log(
            ansiColors.red(
              `${runtime} ! ${src} failed to execute. Check ${reportDest}/stderr.log for more info`
            )
          );
          this.bddTestIsNowDone(src, exitCode);
          statusMessagePretty(exitCode, src, runtime);
          reject(new Error(`Process exited with code ${exitCode}`));
        }
      });

      child.on("error", (e) => {
        console.log(
          ansiC.red(
            ansiC.inverse(
              `${src} errored with: ${e.name}. Check error logs for more info`
            )
          )
        );
        this.bddTestIsNowDone(src, -1);
        statusMessagePretty(-1, src, runtime);
        reject(e);
      });
    });
  }

  launchNode = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`node < ${src}`)));

    const processId = `node-${src}-${Date.now()}`;
    const command = `node test: ${src}`;

    const nodePromise = (async () => {
      try {
        const { reportDest, testResources, portsToUse, wsPort } =
          await this.setupTestEnvironment(src, "node");

        const builtfile = dest;
        const logs = createLogStreams(reportDest, "node");

        // Create a WebSocket server for this test
        const wss = new WebSocketServer({ port: wsPort });

        // Store connection for this test
        let testConnection: WebSocket | null = null;

        // Send a message to the frontend about the test WebSocket server
        this.webSocketBroadcastMessage({
          type: "testWebSocketServer",
          message: `Created WebSocket server for test ${src} on port ${wsPort}`,
          test: src,
          wsPort,
          timestamp: new Date().toISOString(),
        });

        wss.on("connection", (ws) => {
          testConnection = ws;
          console.log(`WebSocket connected for test ${src}`);

          // Send a message to the frontend about the connection
          this.webSocketBroadcastMessage({
            type: "testWebSocketConnection",
            message: `Test ${src} connected to its WebSocket server`,
            test: src,
            timestamp: new Date().toISOString(),
          });

          ws.on("message", async (data) => {
            try {
              const message = JSON.parse(data.toString());
              if (message.type === "command") {
                const { command, args, id } = message;
                try {
                  const func = this.mapping().find(
                    ([cmd]) => cmd === command
                  )?.[1];
                  if (func) {
                    const result = await (this as any)[command](...args);
                    ws.send(
                      JSON.stringify({
                        type: "response",
                        id,
                        result,
                      })
                    );
                  } else {
                    ws.send(
                      JSON.stringify({
                        type: "error",
                        id,
                        error: `Command ${command} not found`,
                      })
                    );
                  }
                } catch (error) {
                  ws.send(
                    JSON.stringify({
                      type: "error",
                      id,
                      error: error.message,
                    })
                  );
                }
              }
            } catch (error) {
              console.error(
                `Error handling WebSocket message for ${src}:`,
                error
              );
            }
          });

          ws.on("close", () => {
            console.log(`WebSocket closed for test ${src}`);
            testConnection = null;

            // Send a message to the frontend about the disconnection
            this.webSocketBroadcastMessage({
              type: "testWebSocketDisconnection",
              message: `Test ${src} disconnected from its WebSocket server`,
              test: src,
              timestamp: new Date().toISOString(),
            });
          });

          ws.on("error", (error) => {
            console.error(`WebSocket error for test ${src}:`, error);

            this.webSocketBroadcastMessage({
              type: "testWebSocketError",
              message: `WebSocket error for test ${src}: ${error.message}`,
              test: src,
              error: error.message,
              timestamp: new Date().toISOString(),
            });
          });
        });

        const child = spawn(
          "node",
          [builtfile, testResources, wsPort.toString()],
          {
            stdio: ["pipe", "pipe", "pipe"],
          }
        );

        try {
          await this.handleChildProcess(child, logs, reportDest, src, "node");

          // Generate prompt files for Node tests
          await this.generatePromptFiles(reportDest, src);
        } finally {
          wss.close();
          this.cleanupPorts(portsToUse);
        }
      } catch (error) {
        if (error.message !== "No ports available") {
          throw error;
        }
      }
    })();

    this.addPromiseProcess(
      processId,
      nodePromise,
      command,
      "bdd-test",
      src,
      "node"
    );
  };

  launchWeb = async (src: string, dest: string) => {
    console.log(ansiC.green(ansiC.inverse(`web < ${src}`)));

    const processId = `web-${src}-${Date.now()}`;
    const command = `web test: ${src}`;

    // Create the promise
    const webPromise = (async () => {
      this.bddTestIsRunning(src);

      const reportDest = `testeranto/reports/${this.projectName}/${src
        .split(".")
        .slice(0, -1)
        .join(".")}/web`;
      if (!fs.existsSync(reportDest)) {
        fs.mkdirSync(reportDest, { recursive: true });
      }

      const destFolder = dest.replace(".mjs", "");

      const webArgz = JSON.stringify({
        name: src,
        ports: [].toString(),
        fs: reportDest,
        browserWSEndpoint: this.browser ? this.browser.wsEndpoint() : "",
      });

      const d = `${dest}?cacheBust=${Date.now()}`;

      const logs = createLogStreams(reportDest, "web");

      return new Promise<void>((resolve, reject) => {
        if (!this.browser) {
          reject(new Error("Browser not initialized"));
          return;
        }
        this.browser
          .newPage()

          .then((page) => {
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

            this.mapping().forEach(async ([command, func]) => {
              if (command === "page") {
                page.exposeFunction(command, (x?) => {
                  if (x) {
                    return func(x);
                  } else {
                    return func(page.mainFrame()._id);
                  }
                });
              } else {
                return page.exposeFunction(command, func);
              }
            });

            return page;
          })
          .then(async (page) => {
            const close = () => {
              logs.info?.write("close2");

              if (!files[src]) {
                files[src] = new Set();
              }

              delete files[src];

              Promise.all(screenshots[src] || []).then(() => {
                delete screenshots[src];
                // page.close();
              });
            };

            page.on("pageerror", (err: Error) => {
              logs.info?.write("pageerror");
              // logs.writeExitCode(-1, err);
              // console.log(
              //   ansiColors.red(
              //     `web ! ${src} failed to execute No "tests.json" file was generated. Check ${reportDest}/error.log for more info`
              //   )
              // );
              // this.bddTestIsNowDone(src, -1);
              // close();
              reject(err);
            });

            await page.goto(`file://${`${destFolder}.html`}`, {});

            const evaluation = webEvaluator(d, webArgz);
            console.log(evaluation);
            await page
              .evaluate(evaluation)
              .then(
                async (
                  // { fails, failed, features }: IFinalResults
                  fr: IFinalResults
                ) => {
                  const { fails, failed, features } = fr;

                  logs.info?.write("\n idk1");
                  statusMessagePretty(fails, src, "web");
                  this.bddTestIsNowDone(src, fails);
                  resolve();
                }
              )
              .catch((e) => {
                logs.info?.write("\n idk2");
                console.log(ansiC.red(ansiC.inverse(e.stack)));
                console.log(
                  ansiC.red(
                    ansiC.inverse(
                      `web ! ${src} failed to execute. No "tests.json" file was generated. Check logs for more info`
                    )
                  )
                );

                // Create a minimal tests.json even on failure
                const testsJsonPath = `${reportDest}/tests.json`;
                if (!fs.existsSync(testsJsonPath)) {
                  fs.writeFileSync(
                    testsJsonPath,
                    JSON.stringify(
                      {
                        tests: [],
                        features: [],
                        givens: [],
                        fullPath: src,
                      },
                      null,
                      2
                    )
                  );
                }

                this.bddTestIsNowDone(src, -1);
                reject(e);
              })
              .finally(async () => {
                logs.info?.write("\n idk3");
                // Generate prompt files for Web tests
                await this.generatePromptFiles(reportDest, src);
                close();
              });
          })
          .catch((error) => {
            reject(error);
          });
      });
    })();

    // Add to process manager
    this.addPromiseProcess(
      processId,
      webPromise,
      command,
      "bdd-test",
      src,
      "web"
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
                    if (child.send) {
                      child.send(
                        JSON.stringify({
                          payload: result,
                          key: message[message.length - 1],
                        })
                      );
                    }
                  } catch (error) {
                    console.error(`Error handling command ${command}:`, error);
                  }
                }
              });
            }
          }
        };

        const server = await this.createIpcServer(onData, ipcfile);

        try {
          await this.handleChildProcess(child, logs, reportDest, src, "python");

          // Generate prompt files for Python tests
          await this.generatePromptFiles(reportDest, src);
        } finally {
          server.close();
          this.cleanupPorts(portsToUse);
        }
      } catch (error) {
        if (error.message !== "No ports available") {
          throw error;
        }
      }
    })();

    this.addPromiseProcess(
      processId,
      pythonPromise,
      command,
      "bdd-test",
      src,
      "python"
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
        const server = await this.createIpcServer(onData, ipcfile);

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
      "golang"
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

        const testResults: {
          tests: Array<{ name: string; status: string; time: string }>;
          features: any[];
          givens: any[];
          fullPath: string;
        } = {
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
