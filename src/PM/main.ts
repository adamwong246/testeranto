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

import { IFinalResults, ITTestResourceConfiguration } from "../lib/index.js";
import { webEvaluator } from "../utils";
import { Queue } from "../utils/queue.js";

import { createLogStreams, statusMessagePretty } from "./utils.js";
import { PM_WithProcesses } from "./PM_WithProcesses.js";

const files: Record<string, Set<string>> = {};
const screenshots: Record<string, Promise<Uint8Array>[]> = {};

export class PM_Main extends PM_WithProcesses {
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

  launchNode = async (src: string, dest: string) => {
    const processId = `node-${src}-${Date.now()}`;
    const command = `node test: ${src}`;

    // Create the promise
    const nodePromise = (async () => {
      this.bddTestIsRunning(src);

      const reportDest = `testeranto/reports/${this.name}/${src
        .split(".")
        .slice(0, -1)
        .join(".")}/node`;

      if (!fs.existsSync(reportDest)) {
        fs.mkdirSync(reportDest, { recursive: true });
      }

      let testResources = "";

      const testConfig = this.configs.tests.find((t) => {
        return t[0] === src;
      });

      if (!testConfig) {
        console.log(
          ansiC.inverse(
            `missing test config! Exiting ungracefully for '${src}'`
          )
        );
        process.exit(-1);
      }

      const testConfigResource = testConfig[2];

      const portsToUse: string[] = [];

      if (testConfigResource.ports === 0) {
        const t: ITTestResourceConfiguration = {
          name: src,
          ports: [],
          fs: reportDest,
          browserWSEndpoint: this.browser.wsEndpoint(),
        };

        testResources = JSON.stringify(t);
      } else if (testConfigResource.ports > 0) {
        const openPorts: [string, string][] = Object.entries(this.ports).filter(
          ([portnumber, portopen]) => portopen === ""
        );

        if (openPorts.length >= testConfigResource.ports) {
          for (let i = 0; i < testConfigResource.ports; i++) {
            portsToUse.push(openPorts[i][0]);

            this.ports[openPorts[i][0]] = src; // port is now claimed
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
              `node: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again run a port is available`
            )
          );
          this.queue.push(src);
          return [Math.random(), testResources];
        }
      } else {
        console.error("negative port makes no sense", src);
        process.exit(-1);
      }

      const builtfile = dest;

      let haltReturns = false;

      const ipcfile = "/tmp/tpipe_" + Math.random();
      const child = spawn("node", [builtfile, testResources, ipcfile], {
        stdio: ["pipe", "pipe", "pipe", "ipc"],
      });

      let buffer: Buffer<ArrayBufferLike> = new Buffer("");

      const server = net.createServer((socket) => {
        const queue = new Queue<string[]>();

        socket.on("data", (data) => {
          buffer = Buffer.concat([buffer, data]);

          for (let b = 0; b < buffer.length + 1; b++) {
            const c = buffer.slice(0, b);
            let d;
            try {
              d = JSON.parse(c.toString());

              queue.enqueue(d);
              buffer = buffer.slice(b, buffer.length + 1);
              b = 0;
            } catch (e) {
              // b++;
            }
          }

          while (queue.size() > 0) {
            const message = queue.dequeue();

            if (message) {
              // set up the "node" listeners
              this.mapping().forEach(async ([command, func]) => {
                if (message[0] === command) {
                  const x = message.slice(1, -1);
                  const r = await this[command](...x);

                  if (!haltReturns) {
                    child.send(
                      JSON.stringify({
                        payload: r,
                        key: message[message.length - 1],
                      })
                    );
                  }
                }
              });
            }
          }
        });
      });

      const logs = createLogStreams(reportDest, "node");

      return new Promise<void>((resolve, reject) => {
        server.listen(ipcfile, () => {
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
            server.close();

            if (exitCode === 255) {
              console.log(
                ansiColors.red(
                  `node ! ${src} failed to execute. No "tests.json" file was generated. Check ${reportDest}/stderr.log for more info`
                )
              );
              this.bddTestIsNowDone(src, -1);
              statusMessagePretty(-1, src, "node");
              reject(new Error(`Process exited with code ${exitCode}`));
            } else if (exitCode === 0) {
              this.bddTestIsNowDone(src, 0);
              statusMessagePretty(0, src, "node");
              resolve();
            } else {
              this.bddTestIsNowDone(src, exitCode);
              statusMessagePretty(exitCode, src, "node");
              reject(new Error(`Process exited with code ${exitCode}`));
            }

            haltReturns = true;
          });

          child.on("error", (e) => {
            console.log("error");
            haltReturns = true;
            console.log(
              ansiC.red(
                ansiC.inverse(
                  `${src} errored with: ${e.name}. Check error logs for more info`
                )
              )
            );
            this.bddTestIsNowDone(src, -1);
            statusMessagePretty(-1, src, "node");
            reject(e);
          });
        });
      }).finally(() => {
        for (let i = 0; i <= portsToUse.length; i++) {
          if (portsToUse[i]) {
            this.ports[portsToUse[i]] = ""; //port is open again
          }
        }
      });
    })();

    // Add to process manager
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
              .finally(() => {
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
      this.bddTestIsRunning(src);

      const reportDest = `testeranto/reports/${this.name}/${src
        .split(".")
        .slice(0, -1)
        .join(".")}/python`;

      if (!fs.existsSync(reportDest)) {
        fs.mkdirSync(reportDest, { recursive: true });
      }

      let testResources = "";

      const testConfig = this.configs.tests.find((t) => t[0] === src);
      if (!testConfig) {
        console.log(
          ansiColors.inverse(
            `missing test config! Exiting ungracefully for '${src}'`
          )
        );
        process.exit(-1);
      }

      const testConfigResource = testConfig[2];
      const portsToUse: string[] = [];

      if (testConfigResource.ports === 0) {
        testResources = JSON.stringify({
          scheduled: true,
          name: src,
          ports: portsToUse,
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
            ansiColors.red(
              `python: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again when a port is available`
            )
          );
          this.queue.push(src);
          return;
        }
      } else {
        console.error("negative port makes no sense", src);
        process.exit(-1);
      }

      const logs = createLogStreams(reportDest, "python");

      // For Python, we'll just run the script directly and pass test resources as an argument
      // Python tests need to handle their own IPC if needed
      const child = spawn("python3", [src, testResources], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      return new Promise<void>((resolve, reject) => {
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
            statusMessagePretty(0, src, "python");
            resolve();
          } else {
            console.log(
              ansiColors.red(
                `python ! ${src} failed to execute. Check ${reportDest}/stderr.log for more info`
              )
            );
            this.bddTestIsNowDone(src, exitCode);
            statusMessagePretty(exitCode, src, "python");
            reject(new Error(`Process exited with code ${exitCode}`));
          }
        });

        child.on("error", (e) => {
          console.log(
            ansiColors.red(
              ansiColors.inverse(
                `python: ${src} errored with: ${e.name}. Check error logs for more info`
              )
            )
          );
          this.bddTestIsNowDone(src, -1);
          statusMessagePretty(-1, src, "python");
          reject(e);
        });
      }).finally(() => {
        portsToUse.forEach(port => {
          this.ports[port] = "";
        });
      });
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
    const processId = `golang-${src}-${Date.now()}`;
    const command = `golang test: ${src}`;

    const golangPromise = (async () => {
      this.bddTestIsRunning(src);

      const reportDest = `testeranto/reports/${this.name}/${src
        .split(".")
        .slice(0, -1)
        .join(".")}/golang`;

      if (!fs.existsSync(reportDest)) {
        fs.mkdirSync(reportDest, { recursive: true });
      }

      let testResources = "";

      const testConfig = this.configs.tests.find((t) => t[0] === src);
      if (!testConfig) {
        console.log(
          ansiColors.inverse(
            `golang: missing test config! Exiting ungracefully for '${src}'`
          )
        );
        process.exit(-1);
      }

      const testConfigResource = testConfig[2];
      const portsToUse: string[] = [];

      if (testConfigResource.ports === 0) {
        testResources = JSON.stringify({
          scheduled: true,
          name: src,
          ports: portsToUse,
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
            ansiColors.red(
              `golang: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again when a port is available`
            )
          );
          this.queue.push(src);
          return;
        }
      } else {
        console.error("negative port makes no sense", src);
        process.exit(-1);
      }

      // Compile the Go test first
      const buildDir = path.dirname(dest);
      const binaryName = path.basename(dest, '.go');
      const binaryPath = path.join(buildDir, binaryName);
      
      const logs = createLogStreams(reportDest, "golang");

      // First, compile the Go program
      const compileProcess = spawn("go", ["build", "-o", binaryPath, dest]);
      
      return new Promise<void>((resolve, reject) => {
        compileProcess.stdout?.on("data", (data) => {
          logs.stdout?.write(data);
        });

        compileProcess.stderr?.on("data", (data) => {
          logs.stderr?.write(data);
        });

        compileProcess.on("close", (compileCode) => {
          if (compileCode !== 0) {
            console.log(
              ansiColors.red(
                `golang ! ${src} failed to compile. Check ${reportDest}/stderr.log for more info`
              )
            );
            this.bddTestIsNowDone(src, compileCode || -1);
            statusMessagePretty(compileCode || -1, src, "golang");
            reject(new Error(`Compilation failed with code ${compileCode}`));
            return;
          }

          // Now run the compiled binary
          const child = spawn(binaryPath, [testResources], {
            stdio: ["pipe", "pipe", "pipe"],
          });

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
              statusMessagePretty(0, src, "golang");
              resolve();
            } else {
              console.log(
                ansiColors.red(
                  `golang ! ${src} failed to execute. Check ${reportDest}/stderr.log for more info`
                )
              );
              this.bddTestIsNowDone(src, exitCode);
              statusMessagePretty(exitCode, src, "golang");
              reject(new Error(`Process exited with code ${exitCode}`));
            }
          });

          child.on("error", (e) => {
            console.log(
              ansiColors.red(
                ansiColors.inverse(
                  `golang: ${src} errored with: ${e.name}. Check error logs for more info`
                )
              )
            );
            this.bddTestIsNowDone(src, -1);
            statusMessagePretty(-1, src, "golang");
            reject(e);
          });
        });

        compileProcess.on("error", (e) => {
          console.log(
            ansiColors.red(
              ansiColors.inverse(
                `golang: ${src} compilation errored with: ${e.name}. Check error logs for more info`
              )
            )
          );
          this.bddTestIsNowDone(src, -1);
          statusMessagePretty(-1, src, "golang");
          reject(e);
        });
      }).finally(() => {
        portsToUse.forEach(port => {
          this.ports[port] = "";
        });
      });
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
}
