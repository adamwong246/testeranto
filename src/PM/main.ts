/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { spawn } from "node:child_process";
import ansiColors from "ansi-colors";
import net from "net";
import fs from "fs";
import { ConsoleMessage } from "puppeteer-core";
import ansiC from "ansi-colors";

import { IFinalResults, ITTestResourceConfiguration, IRunTime } from "../lib/index.js";
import { webEvaluator } from "../utils";
import { Queue } from "../utils/queue.js";

import { createLogStreams, statusMessagePretty } from "./utils.js";
import { PM_WithHelpo } from "./PM_WithHelpo.js";
import path from "node:path";

const files: Record<string, Set<string>> = {};
const screenshots: Record<string, Promise<Uint8Array>[]> = {};

export class PM_Main extends PM_WithHelpo {
  launchPure = async (src: string, dest: string) => {
    const processId = `pure-${src}-${Date.now()}`;
    const command = `pure test: ${src}`;

    // Create the promise
    const purePromise = (async () => {
      this.bddTestIsRunning(src);

      const reportDest = `testeranto/reports/${this.name}/${src
        .split(".")
        .slice(0, -1)
        .join(".")}/pure`;

      if (!fs.existsSync(reportDest)) {
        fs.mkdirSync(reportDest, { recursive: true });
      }

      const destFolder = dest.replace(".mjs", "");

      let argz = "";

      const testConfig = this.configs.tests.find((t) => {
        return t[0] === src;
      });

      if (!testConfig) {
        console.log(
          ansiC.inverse("missing test config! Exiting ungracefully!")
        );
        process.exit(-1);
      }
      const testConfigResource = testConfig[2];

      const portsToUse: string[] = [];
      if (testConfigResource.ports === 0) {
        argz = JSON.stringify({
          scheduled: true,
          name: src,
          ports: portsToUse,
          fs: reportDest,
          browserWSEndpoint: this.browser.wsEndpoint(),
        });
      } else if (testConfigResource.ports > 0) {
        const openPorts = Object.entries(this.ports).filter(
          ([portnumber, status]) => status === ""
        );

        if (openPorts.length >= testConfigResource.ports) {
          for (let i = 0; i < testConfigResource.ports; i++) {
            portsToUse.push(openPorts[i][0]);

            this.ports[openPorts[i][0]] = src; // port is now claimed
          }

          argz = JSON.stringify({
            scheduled: true,
            name: src,
            ports: portsToUse,
            fs: destFolder,
            browserWSEndpoint: this.browser.wsEndpoint(),
          });
        } else {
          this.queue.push(src);
          return [Math.random(), argz];
        }
      } else {
        console.error("negative port makes no sense", src);
        process.exit(-1);
      }

      const builtfile = dest;

      const logs = createLogStreams(reportDest, "pure");

      try {
        await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
          return module.default
            .then((defaultModule) => {
              return defaultModule
                .receiveTestResourceConfig(argz)
                .then(async (results: IFinalResults) => {
                  statusMessagePretty(results.fails, src, "pure");
                  this.bddTestIsNowDone(src, results.fails);
                  return results.fails;
                });
            })
            .catch((e2) => {
              console.log(
                ansiColors.red(
                  `pure ! ${src} failed to execute. No "tests.json" file was generated. Check the logs for more info`
                )
              );

              logs.exit.write(e2.stack);
              logs.exit.write(-1);
              this.bddTestIsNowDone(src, -1);
              statusMessagePretty(-1, src, "pure");
              throw e2;
            });
        });
      } catch (e3) {
        logs.writeExitCode(-1, e3);
        console.log(
          ansiC.red(
            ansiC.inverse(
              `${src} 1 errored with: ${e3}. Check logs for more info`
            )
          )
        );

        logs.exit.write(e3.stack);
        logs.exit.write("-1");
        this.bddTestIsNowDone(src, -1);
        statusMessagePretty(-1, src, "pure");
        throw e3;
      } finally {
        // Generate prompt files for Pure tests
        await this.generatePromptFiles(reportDest, src);
        
        for (let i = 0; i <= portsToUse.length; i++) {
          if (portsToUse[i]) {
            this.ports[portsToUse[i]] = ""; // port is open again
          }
        }
      }
    })();

    // Add to process manager
    this.addPromiseProcess(
      processId,
      purePromise,
      command,
      "bdd-test",
      src,
      "pure"
    );
  };

  private async setupTestEnvironment(
    src: string, 
    runtime: IRunTime
  ): Promise<{
    reportDest: string;
    testConfig: any;
    testConfigResource: any;
    portsToUse: string[];
    testResources: string;
  }> {
    this.bddTestIsRunning(src);

    const reportDest = `testeranto/reports/${this.name}/${src
      .split(".")
      .slice(0, -1)
      .join(".")}/${runtime}`;

    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }

    const testConfig = this.configs.tests.find((t) => t[0] === src);
    if (!testConfig) {
      console.log(
        ansiC.inverse(`missing test config! Exiting ungracefully for '${src}'`)
      );
      process.exit(-1);
    }

    const testConfigResource = testConfig[2];
    const portsToUse: string[] = [];
    let testResources = "";

    if (testConfigResource.ports === 0) {
      testResources = JSON.stringify({
        name: src,
        ports: [],
        fs: reportDest,
        browserWSEndpoint: this.browser.wsEndpoint(),
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
          browserWSEndpoint: this.browser.wsEndpoint(),
        });
      } else {
        console.log(
          ansiC.red(
            `${runtime}: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again when a port is available`
          )
        );
        this.queue.push(src);
        throw new Error('No ports available');
      }
    } else {
      console.error("negative port makes no sense", src);
      process.exit(-1);
    }

    return { reportDest, testConfig, testConfigResource, portsToUse, testResources };
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
        socket.on('data', onData);
      });
      
      server.listen(ipcfile, (err) => {
        if (err) reject(err);
        else resolve(server);
      });
      
      server.on('error', reject);
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
        
        const server = await this.createIpcServer(onData, ipcfile);
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
      } catch (error) {
        if (error.message !== 'No ports available') {
          throw error;
        }
      }
    })();

    this.addPromiseProcess(processId, nodePromise, command, "bdd-test", src, "node");
  };

  launchWeb = async (src: string, dest: string) => {
    const processId = `web-${src}-${Date.now()}`;
    const command = `web test: ${src}`;

    // Create the promise
    const webPromise = (async () => {
      this.bddTestIsRunning(src);

      const reportDest = `testeranto/reports/${this.name}/${src
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
        browserWSEndpoint: this.browser.wsEndpoint(),
      });

      const d = `${dest}?cacheBust=${Date.now()}`;

      const logs = createLogStreams(reportDest, "web");

      return new Promise<void>((resolve, reject) => {
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
              if (!files[src]) {
                files[src] = new Set();
              }

              delete files[src];

              Promise.all(screenshots[src] || []).then(() => {
                delete screenshots[src];
                page.close();
              });
            };

            page.on("pageerror", (err: Error) => {
              logs.writeExitCode(-1, err);
              console.log(
                ansiColors.red(
                  `web ! ${src} failed to execute No "tests.json" file was generated. Check ${reportDest}/error.log for more info`
                )
              );
              this.bddTestIsNowDone(src, -1);
              close();
              reject(err);
            });

            await page.goto(`file://${`${destFolder}.html`}`, {});

            await page
              .evaluate(webEvaluator(d, webArgz))
              .then(async ({ fails, failed, features }: IFinalResults) => {
                statusMessagePretty(fails, src, "web");
                this.bddTestIsNowDone(src, fails);
                resolve();
              })
              .catch((e) => {
                console.log(ansiC.red(ansiC.inverse(e.stack)));
                console.log(
                  ansiC.red(
                    ansiC.inverse(
                      `web ! ${src} failed to execute. No "tests.json" file was generated. Check logs for more info`
                    )
                  )
                );
                this.bddTestIsNowDone(src, -1);
                reject(e);
              })
              .finally(async () => {
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
    const processId = `python-${src}-${Date.now()}`;
    const command = `python test: ${src}`;

    const pythonPromise = (async () => {
      try {
        const { reportDest, testResources, portsToUse } = 
          await this.setupTestEnvironment(src, "python");
        
        const logs = createLogStreams(reportDest, "python");
        
        // Determine Python command
        const venvPython = `./venv/bin/python3`;
        const pythonCommand = fs.existsSync(venvPython) ? venvPython : "python3";
        
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
        if (error.message !== 'No ports available') {
          throw error;
        }
      }
    })();

    this.addPromiseProcess(processId, pythonPromise, command, "bdd-test", src, "python");
  };

  launchGolang = async (src: string, dest: string) => {
    const processId = `golang-${src}-${Date.now()}`;
    const command = `golang test: ${src}`;

    const golangPromise = (async () => {
      try {
        const { reportDest, testResources, portsToUse } = 
          await this.setupTestEnvironment(src, "golang");
        
        const logs = createLogStreams(reportDest, "golang");
        
        // For Go tests, use 'go test' with JSON output
        // The test file should be in a proper Go package structure
        // Get the directory containing the test file
        const testDir = path.dirname(src);
        
        // Ensure the bundle directory exists
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        
        // Copy necessary files to the bundle directory to ensure they can be found
        // This may include the test file and any dependencies
        const testFileName = path.basename(src);
        const destTestPath = path.join(destDir, testFileName);
        if (src !== destTestPath) {
          fs.copyFileSync(src, destTestPath);
        }
        
        // Create a go.mod file in the bundle directory if it doesn't exist
        const goModPath = path.join(destDir, 'go.mod');
        if (!fs.existsSync(goModPath)) {
          const goModContent = `module example_test

go 1.19

replace testeranto/src/golingvu => ../../../../../src/golingvu

require (
    testeranto/src/golingvu v0.0.0
)
`;
          fs.writeFileSync(goModPath, goModContent);
        }
        
        // Run go mod tidy first to ensure dependencies are correct
        const tidyChild = spawn("go", ["mod", "tidy"], {
            stdio: ["pipe", "pipe", "pipe"],
            cwd: destDir
        });
        
        // Wait for go mod tidy to complete
        await new Promise<void>((resolve, reject) => {
            tidyChild.on("close", (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    console.warn(`go mod tidy failed with exit code ${code}, continuing anyway`);
                    resolve();
                }
            });
            tidyChild.on("error", (error) => {
                console.warn(`go mod tidy error: ${error}, continuing anyway`);
                resolve();
            });
        });
        
        // Run the tests using go test with JSON output from the test directory
        const child = spawn("go", ["test", "-v", "-json", testFileName], {
            stdio: ["pipe", "pipe", "pipe"],
            cwd: destDir
        });
        
        await this.handleChildProcess(child, logs, reportDest, src, "golang");
        
        // Generate prompt files for Golang tests
        await this.generatePromptFiles(reportDest, src);
        
        // Ensure tests.json exists by parsing the go test JSON output
        await this.processGoTestOutput(reportDest, src);
        
        // Clean up the test binary
        try {
            fs.unlinkSync(testBinaryPath);
        } catch (e) {
            // Ignore errors during cleanup
        }
        
        this.cleanupPorts(portsToUse);
      } catch (error) {
        if (error.message !== 'No ports available') {
          throw error;
        }
      }
    })();

    this.addPromiseProcess(processId, golangPromise, command, "bdd-test", src, "golang");
  };

  private async processGoTestOutput(reportDest: string, src: string): Promise<void> {
    const testsJsonPath = `${reportDest}/tests.json`;
    
    // Parse the stdout.log to extract test results from JSON output
    const stdoutPath = `${reportDest}/stdout.log`;
    if (fs.existsSync(stdoutPath)) {
      try {
        const stdoutContent = fs.readFileSync(stdoutPath, 'utf-8');
        const lines = stdoutContent.split('\n').filter(line => line.trim());
        
        const testResults = {
          tests: [],
          features: [],
          givens: [],
          fullPath: path.resolve(process.cwd(), src)
        };
        
        // Parse each JSON line from go test output
        for (const line of lines) {
          try {
            const event = JSON.parse(line);
            if (event.Action === 'pass' || event.Action === 'fail') {
              testResults.tests.push({
                name: event.Test || event.Package,
                status: event.Action === 'pass' ? 'passed' : 'failed',
                time: event.Elapsed ? `${event.Elapsed}s` : '0s'
              });
            }
          } catch (e) {
            // Skip non-JSON lines
          }
        }
        
        fs.writeFileSync(testsJsonPath, JSON.stringify(testResults, null, 2));
        return;
      } catch (error) {
        console.error('Error processing go test output:', error);
      }
    }
    
    // Fallback: create a basic tests.json if processing fails
    const basicTestResult = {
      tests: [],
      features: [],
      givens: [],
      fullPath: path.resolve(process.cwd(), src)
    };
    fs.writeFileSync(testsJsonPath, JSON.stringify(basicTestResult, null, 2));
  }

  private async generatePromptFiles(reportDest: string, src: string): Promise<void> {
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
      console.log(`Created message.txt at ${messagePath}`);

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
      console.log(`Created prompt.txt at ${promptPath}`);
      
      console.log(ansiColors.green(`Generated prompt files for test: ${src}`));
    } catch (error) {
      console.error(`Failed to generate prompt files for ${src}:`, error);
    }
  }

  private getGolangSourceFiles(src: string): string[] {
    // Get all .go files in the same directory as the test
    const testDir = path.dirname(src);
    const files: string[] = [];
    
    try {
      const dirContents = fs.readdirSync(testDir);
      dirContents.forEach(file => {
        if (file.endsWith('.go')) {
          files.push(path.join(testDir, file));
        }
      });
    } catch (error) {
      console.error(`Error reading directory ${testDir}:`, error);
    }
    
    // Always include the main test file
    if (!files.includes(src)) {
      files.push(src);
    }
    
    return files;
  }
}
