import WebSocket, { WebSocketServer } from 'ws';
import esbuild, { BuildOptions } from "esbuild";
import fs from "fs";
import path from "path";
import fsExists from "fs.promises.exists";
import pm2 from "pm2";
import readline from 'readline';

import { TesterantoFeatures } from "./Features";
import { IBaseConfig, IRunTime, ITestTypes } from "./Types";
import { ITTestResourceRequirement } from './core';

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY)
  process.stdin.setRawMode(true);

const TIMEOUT = 2000;
const OPEN_PORT = "";

let webSocketServer: WebSocketServer;

type ISchedulerProtocols = `ipc` | `ws`;

type IPm2ProcessB = {
  process: {
    namespace: string;
    versioning: object;
    name: string;
    pm_id: number;
  };
  data: {
    name: string;
    testResource: string[];
    results: any;
  };
  at: string;
};

const getRunnables = (
  tests: ITestTypes[],
  payload = [new Set<string>(), new Set<string>()]
): [Set<string>, Set<string>] => {
  return tests.reduce((pt, cv, cndx, cry) => {

    if (cv[1] === "node") {
      pt[0].add(cv[0]);
    } else if (cv[1] === "web") {
      pt[1].add(cv[0]);
    }

    if (cv[2].length) {
      getRunnables(cv[2], payload);
    }

    return pt;
  }, payload as [Set<string>, Set<string>]);

}

export class ITProject {
  clearScreen: boolean;
  devMode: boolean;
  exitCodes: Record<number, string> = {};
  features: TesterantoFeatures;
  mode: `up` | `down` = `up`;
  ports: Record<string, string> = {};
  tests: ITestTypes[];
  websockets: Record<string, WebSocket> = {};

  resourceQueue: {
    requirement: ITTestResourceRequirement,
    protocol: ISchedulerProtocols,
  }[] = [];

  private spinCycle = 0;
  private spinAnimation = "←↖↑↗→↘↓↙";

  constructor(config: IBaseConfig) {
    this.clearScreen = config.clearScreen;
    this.devMode = config.devMode;

    Object.values(config.ports).forEach((port) => {
      this.ports[port] = OPEN_PORT;
    });

    const testPath = `${process.cwd()}/${config.tests}`;
    const featurePath = `${process.cwd()}/${config.features}`;

    process.on('SIGINT', () => this.initiateShutdown("CTRL+C"));
    process.on('SIGQUIT', () => this.initiateShutdown("Keyboard quit"));
    process.on('SIGTERM', () => this.initiateShutdown("'kill' command"));

    process.stdin.on('keypress', (str, key) => {
      if (key.name === 'q') {
        this.initiateShutdown("'q' command")
      }
    });

    import(testPath).then((tests) => {
      this.tests = tests.default;

      import(featurePath).then((features) => {
        this.features = features.default;

        const [nodeEntryPoints, webEntryPoints] = getRunnables(this.tests);
        const esbuildConfigNode: BuildOptions = {
          packages: "external",
          external: ["tests.test.js", "features.test.js"],
          platform: "node",
          outbase: config.outbase,
          outdir: config.outdir,
          jsx: `transform`,
          entryPoints: [...nodeEntryPoints],
          bundle: true,
          minify: config.minify === true,
          write: true,
          plugins: [
            ...(config.loaders || []),
            {
              name: 'rebuild-notify',
              setup(build) {
                build.onEnd(result => {
                  console.log(`node build ended with ${result.errors.length} errors`);
                  // HERE: somehow restart the server from here, e.g., by sending a signal that you trap and react to inside the server.
                })
              }
            },
          ],
        };

        Promise.resolve(Promise.all(
          [
            ...this.getSecondaryEndpointsPoints("web")
          ]
            .map(async (sourceFilePath) => {
              const sourceFileSplit = sourceFilePath.split("/");
              const sourceDir = sourceFileSplit.slice(0, -1);
              const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
              const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
              const htmlFilePath = path.normalize(`${process.cwd()}/${config.outdir}/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);
              const jsfilePath = `./${sourceFileNameMinusJs}.js`;
              return fs.promises.mkdir(path.dirname(htmlFilePath), { recursive: true }).then(x => fs.writeFileSync(htmlFilePath,
                `
<!DOCTYPE html>
<html lang="en">
<head>
  <script type="module" src="${jsfilePath}"></script>
</head>

<body>
  <h1>${htmlFilePath}</h1>
  <div id="root">
    
  </div>
</body>

<footer></footer>

</html>
`))
            })));

        const esbuildConfigWeb: BuildOptions = {
          external: ["stream", "tests.test.js", "features.test.js"],
          platform: "browser",
          format: "esm",
          outbase: config.outbase,
          outdir: config.outdir,
          jsx: `transform`,
          entryPoints: [
            ...webEntryPoints,
            testPath,
            featurePath,
          ],
          bundle: true,
          minify: config.minify === true,
          write: true,
          splitting: true,
          plugins: [
            ...(config.loaders || []),

            {
              name: 'rebuild-notify',
              setup(build) {
                build.onEnd(result => {
                  console.log(`web build ended with ${result.errors.length} errors`);
                  // HERE: somehow restart the server from here, e.g., by sending a signal that you trap and react to inside the server.
                })
              }
            },

            // {
            //   name: "testeranto-redirect",
            //   setup(build) {
            //     build.onResolve({ filter: /^.*\/testeranto\/$/ }, (args) => {
            //       return {
            //         path: path.join(
            //           process.cwd(),
            //           `..`,
            //           "node_modules",
            //           `testeranto`
            //         ),
            //       };
            //     });
            //   },
            // },
          ],
        };

        esbuild.build({
          bundle: true,
          entryPoints: ["./node_modules/testeranto/dist/module/Report.js"],
          minify: config.minify === true,
          outbase: config.outbase,
          write: true,
          outfile: `${config.outdir}/Report.js`,
          external: ["tests.test.js", "features.test.js"]
        });

        fs.writeFileSync(`${config.outdir}/report.html`, `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <title>kokomoBay - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />
  <link rel="stylesheet" href="./Report.css" />

  <script type="importmap">
    {
    "imports": {
      "tests.test.js": "./tests.test.js",
      "features.test.js": "./features.test.js"
    }
  }
  </script>


  <script src="./Report.js"></script>
</head>

<body>
  <div id="root">
    react is loading
  </div>
</body>

</html>
        `)

        Promise.all([

          esbuild.context(esbuildConfigNode).then(async (nodeContext) => {
            await nodeContext.watch();
          }),

          esbuild.context(esbuildConfigWeb).then(async (esbuildWeb) => {
            await esbuildWeb.watch();
          })
        ]);

        pm2.connect(async (err) => {
          if (err) {
            console.error(err);
            process.exit(-1);
          } else {
            console.log(`pm2 is connected`);
          }
          // run a websocket as an alternative to node IPC
          webSocketServer = new WebSocketServer({
            port: 8080,
            host: "localhost",
          });

          webSocketServer.on('open', () => {
            console.log('open');
            // process.exit()
          });

          webSocketServer.on('close', (data) => {
            console.log('webSocketServer close: %s', data);
            // process.exit()
          });

          webSocketServer.on('listening', () => {
            console.log("webSocketServer listening", webSocketServer.address());
            // process.exit()
          });

          webSocketServer.on('connection', (webSocket: WebSocket) => {
            console.log('webSocketServer connection');

            webSocket.on('message', (webSocketData) => {
              console.log('webSocket message: %s', webSocketData);
              const payload = webSocketData.valueOf() as { type: string, data: ITTestResourceRequirement };
              const name = payload.data.name;
              const messageType = payload.type;
              const requestedResources = payload.data;

              this.websockets[name] = webSocket
              console.log('connected: ' + name + ' in ' + Object.getOwnPropertyNames(this.websockets))

              if (messageType === "testeranto:hola") {
                console.log("hola WS", requestedResources);
                this.requestResource(requestedResources, 'ws');
              } else if (messageType === "testeranto:adios") {
                console.log("adios WS", name);
                this.releaseTestResources(name);
              }

            });
          });

          const makePath = (fPath: string): string => {
            const ext = path.extname(fPath);
            const x = "./" + config.outdir + "/" + fPath.replace(ext, "") + ".js";
            return path.resolve(x);
          };

          const bootInterval = setInterval(async () => {
            const filesToLookup = this.tests
              .map(([p, rt]) => {
                const filepath = makePath(p);
                return {
                  filepath,
                  exists: fsExists(filepath),
                };
              });
            const allFilesExist = (
              await Promise.all(filesToLookup.map((f) => f.exists))
            ).every((b) => b);

            if (!allFilesExist) {
              console.log(this.spinner(), "waiting for files to build...")
              filesToLookup.forEach((f) => {
                console.log(f.exists, "\t", f.filepath);
              })

            } else {
              clearInterval(bootInterval);

              pm2.launchBus((err, pm2_bus) => {
                pm2_bus.on("testeranto:hola", (packet: { data: { requirement: ITTestResourceRequirement } }) => {
                  console.log("hola IPC", packet);
                  this.requestResource(
                    packet.data.requirement,
                    'ipc'
                  );
                });

                pm2_bus.on("testeranto:adios", (packet: IPm2ProcessB) => {
                  console.log("adios IPC", packet);
                  this.releaseTestResources(packet.data.name);
                });
              });

              this
                .tests
                .reduce((m, [inputFilePath, runtime]) => {
                  const script = makePath(inputFilePath);
                  const partialTestResourceByCommandLineArg = `${script} '${JSON.stringify(
                    {
                      name: inputFilePath,
                      ports: [],
                      fs: path.resolve(
                        process.cwd(),
                        config.outdir,
                        inputFilePath
                      ),
                    }
                  )}'`;

                  if (runtime === "web") {
                    const fileAsList = inputFilePath.split("/");
                    const fileListHead = fileAsList.slice(0, -1);
                    const fname = fileAsList[fileAsList.length - 1];
                    const fnameOnly = fname.split(".").slice(0, -1).join(".");
                    const htmlFile = [config.outdir, ...fileListHead, `${fnameOnly}.html`].join("/");
                    const jsFile = htmlFile.split(".html")[0] + ".js"
                    console.log("watching", jsFile);

                    pm2.start(
                      {

                        script: `yarn electron node_modules/testeranto/dist/common/electron.js ${htmlFile} '${JSON.stringify(
                          {
                            name: inputFilePath,
                            ports: [],
                            fs:
                              path.resolve(
                                process.cwd(),
                                config.outdir,
                                inputFilePath
                              ),
                          }
                        )}'`,
                        name: inputFilePath,
                        autorestart: false,
                        args: partialTestResourceByCommandLineArg,
                        watch: [jsFile],
                      },
                      (err, proc) => {
                        if (err) {
                          console.error(err);
                          return pm2.disconnect();
                        }
                      }
                    );

                  } else if (runtime === "node") {
                    pm2.start({
                      name: inputFilePath,
                      script: `node ${script} '${JSON.stringify(
                        {
                          name: inputFilePath,
                          ports: [],
                          fs:
                            path.resolve(
                              process.cwd(),
                              config.outdir,
                              inputFilePath
                            ),
                        }
                      )}'`,
                      autorestart: false,
                      watch: [script],
                      args: partialTestResourceByCommandLineArg

                    }, (err, proc) => {
                      if (err) {
                        console.error(err);
                        return pm2.disconnect();
                      }
                    });
                  }

                  return [inputFilePath, ...m];
                }, []);
              setInterval(this.mainLoop, TIMEOUT).unref();
            }
          }, TIMEOUT).unref();
        });

      })
    })
  }

  public requestResource(
    requirement: ITTestResourceRequirement,
    protocol: ISchedulerProtocols
  ) {
    this.resourceQueue.push({ requirement, protocol });
  }

  public getSecondaryEndpointsPoints(runtime?: IRunTime): string[] {
    if (runtime) {
      return this.tests
        .filter((t) => {
          return (t[1] === runtime);
        })
        .map((tc) => tc[0])
    }

    return this.tests
      .map((tc) => tc[0])
  }

  public initiateShutdown(reason: string) {
    console.log("Shutdown initiated because", reason);
    this.mode = "down";
  }

  private shutdown() {
    console.log("Stopping PM2");
    pm2.stop("all", (e) => console.error(e));
    pm2.killDaemon((e) => console.error(e));
    pm2.disconnect();
    process.exit();
  }

  private spinner() {
    this.spinCycle = (this.spinCycle + 1) % this.spinAnimation.length;
    return this.spinAnimation[this.spinCycle];
  }

  private async releaseTestResources(name: string) {
    pm2.list((err, processes) => {
      processes.forEach((proc: pm2.ProcessDescription) => {
        if (proc.name === name) {
          Object.keys(this.ports).forEach((port: string) => {
            if (this.ports[port] === name) {
              this.ports[port] = OPEN_PORT;
            }
          });
        }
      });
    });
  }

  private allocateViaWs(resourceRequest: {
    requirement: ITTestResourceRequirement;
    protocol: ISchedulerProtocols;
  }) {

    const pName = resourceRequest.requirement.name;
    const testResourceRequirement = resourceRequest.requirement;

    pm2.list((err, processes) => {
      console.error(err);
      processes.forEach((p) => {
        if (p.name === pName && p.pid) {
          const message = {
            // these fields must be present
            id: p.pid,
            topic: "some topic",
            type: "process:msg",

            // Data to be sent
            data: {
              testResourceConfiguration: {
                ports: [],
                // fs: fPath,
              },
              id: p.pm_id,
            },
          };

          if (testResourceRequirement?.ports === 0) {
            pm2.sendDataToProcessId(
              p.pid,
              message,
              function (err, res) {
                // console.log("sendDataToProcessId", err, res, message);
              }
            );
          }

          if ((testResourceRequirement?.ports || 0) > 0) {
            // clear any port-slots associated with this job
            Object.values(this.ports).forEach((jobMaybe, portNumber) => {
              if (jobMaybe && jobMaybe === pName) {
                this.ports[portNumber] = OPEN_PORT;
              }
            });

            // find a list of open ports
            const foundOpenPorts = Object.keys(this.ports).filter(
              (p) => this.ports[p] === OPEN_PORT
            );
            // if there are enough open port-slots...
            if (foundOpenPorts.length >= testResourceRequirement.ports) {
              const selectionOfPorts = foundOpenPorts.slice(
                0,
                testResourceRequirement.ports
              );

              const message = {
                // these fields must be present
                id: p.pid, // id of process from "pm2 list" command or from pm2.list(errback) method
                topic: "some topic",
                // process:msg will be send as 'message' on target process
                type: "process:msg",

                // Data to be sent
                data: {
                  testResourceConfiguration: {
                    // fs: fPath,
                    ports: selectionOfPorts,
                  },
                  id: p.pid,
                },
              };
              pm2.sendDataToProcessId(
                p.pid,
                message,
                function (err, res) {
                  // no-op
                }
              );
              // mark the selected ports as occupied
              for (const foundOpenPort of selectionOfPorts) {
                this.ports[foundOpenPort] = p.pid.toString();
              }
            } else {
              console.log(
                `no port was open so send the ${p.pid} job to the back of the resourceQueue`
              );
              this.resourceQueue.push(resourceRequest);
            }
          }
        }
      })
    })
  }

  private allocateViaIpc(resourceRequest: {
    requirement: ITTestResourceRequirement;
    protocol: ISchedulerProtocols;
  }) {
    console.log("allocateViaIpc", resourceRequest)
    const pName = resourceRequest.requirement.name;
    const testResourceRequirement = resourceRequest.requirement;

    pm2.list((err, processes) => {
      console.error(err);
      processes.forEach((p) => {
        console.log("p.pid, p.name, p.pm_id", p.pid, p.name, p.pm_id);
        if (p.name === pName && p.pid) {
          const message = {
            // these fields must be present
            id: p.pid,
            topic: "some topic",
            type: "process:msg",

            // Data to be sent
            data: {
              testResourceConfiguration: {
                ports: [],
                // fs: fPath,
              },
              id: p.pm_id,
            },
          };

          console.log("message", message);

          if (testResourceRequirement?.ports === 0) {
            pm2.sendDataToProcessId(
              p.pm_id as number,
              message,
              function (err, res) {
                // console.log("sendDataToProcessId", err, res, message);
              }
            );
          }

          if ((testResourceRequirement?.ports || 0) > 0) {
            // clear any port-slots associated with this job
            Object.values(this.ports).forEach((jobMaybe, portNumber) => {
              if (jobMaybe && jobMaybe === pName) {
                this.ports[portNumber] = OPEN_PORT;
              }
            });

            // find a list of open ports
            const foundOpenPorts = Object.keys(this.ports).filter(
              (p) => this.ports[p] === OPEN_PORT
            );
            // if there are enough open port-slots...
            if (foundOpenPorts.length >= testResourceRequirement.ports) {
              const selectionOfPorts = foundOpenPorts.slice(
                0,
                testResourceRequirement.ports
              );

              const message = {
                // these fields must be present
                id: p.pid, // id of process from "pm2 list" command or from pm2.list(errback) method
                topic: "some topic",
                // process:msg will be send as 'message' on target process
                type: "process:msg",

                // Data to be sent
                data: {
                  testResourceConfiguration: {
                    // fs: fPath,
                    ports: selectionOfPorts,
                  },
                  id: p.pid,
                },
              };
              pm2.sendDataToProcessId(
                p.pm_id as number,
                message,
                function (err, res) {
                  // no-op
                }
              );
              // mark the selected ports as occupied
              for (const foundOpenPort of selectionOfPorts) {
                this.ports[foundOpenPort] = p.pid.toString();
              }
            } else {
              console.log(
                `no port was open so send the ${p.pid} job to the back of the resourceQueue`
              );
              this.resourceQueue.push(resourceRequest);
            }
          }
        }
      })
    })
  }

  private mainLoop = async () => {
    if (this.clearScreen) {
      console.clear();
    }

    const procsTable: any[] = [];
    pm2.list((err, procs) => {
      procs.forEach((proc) => {
        procsTable.push({ name: proc.name, pid: proc.pid, pm_id: proc.pm_id, mem: proc.monit?.memory, cpu: proc.monit?.cpu })
      })
      console.table(procsTable);

      console.table(this.resourceQueue);
      // console.log("webSocketServer.clients", webSocketServer.clients.size);
      // console.log("resourceQueue", this.resourceQueue);

      const resourceRequest = this.resourceQueue.pop();

      if (!resourceRequest) {
        if (!this.devMode && this.mode === "up") {
          this.initiateShutdown("resource request queue is empty");
        }

        if (this.mode === "down" && procsTable.every((p) => p.pid === 0)) {
          this.shutdown();
        }
      } else {
        console.log("handling", resourceRequest);
        if (resourceRequest.protocol === "ipc") {
          this.allocateViaIpc(resourceRequest)
        } else if (resourceRequest.protocol === "ws") {
          this.allocateViaWs(resourceRequest)
        }
      }

      if (this.devMode) {
        if (this.mode === "up") {
          console.log(this.spinner(), "Running tests while watching for changes. Use 'q' to initiate shutdown");
        } else {
          console.log(this.spinner(), "Shutdown is in progress. Please wait.");
        }

      } else {
        if (this.mode === "up") {
          console.log(this.spinner(), "Running tests without watching for changes. Use 'q' to initiate shutdown");
        } else {
          console.log(this.spinner(), "Shutdown is in progress. Please wait.");
        }
      }
      // console.log(this.spinner());
      // console.log(
      //   this.spinner(),
      //   this.mode === `up`
      //     ? `press "q" to initiate graceful shutdown`
      //     : `please wait while testeranto shuts down gracefully...`
      // );
    });


  };

}
