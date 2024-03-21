import WebSocket, { WebSocketServer } from 'ws';
import esbuild, { BuildOptions, ImportKind, ServeOnRequestArgs } from "esbuild";
import fs from "fs";
import path from "path";
import fsExists from "fs.promises.exists";
import pm2 from "pm2";

import { TesterantoFeatures } from "./Features";
import { IBaseConfig, ICollateMode } from "./IBaseConfig";
import { ITTestResourceConfiguration, ITTestResourceRequirement } from './core';

const TIMEOUT = 2000;
const OPEN_PORT = "";

export type IRunTime = `node` | `electron` | `puppeteer`;
export type IRunTimes = { runtime: IRunTime; entrypoint: string }[];

export type ITestTypes = [
  string,
  IRunTime,
  ITestTypes[]
];

type IScehdulerProtocols = `ipc` | `ws`;

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

let webSocketServer: WebSocketServer;

export default class Scheduler {
  private spinCycle = 0;
  private spinAnimation = "←↖↑↗→↘↓↙";

  project: ITProject;
  ports: Record<string, string>;
  jobs: Record<
    string,
    {
      aborter: () => any;
      cancellablePromise: string;
    }
  >;
  resourceQueue: {
    requirement: ITTestResourceRequirement,
    protocol: IScehdulerProtocols,
    // name: string,
  }[];
  summary: Record<string, boolean | undefined>;
  mode: `up` | `down`;
  websockets: Record<string, WebSocket>;

  constructor(project: ITProject) {
    this.project = project;

    this.resourceQueue = [];
    this.jobs = {};
    this.ports = {};
    this.websockets = {};

    Object.values(this.project.ports).forEach((port) => {
      this.ports[port] = OPEN_PORT;
    });

    this.mode = `up`;
    this.summary = {};

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
        process.exit()
      });

      webSocketServer.on('close', (data) => {
        console.log('webSocketServer close: %s', data);
        process.exit()
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

          // const wsName = parseInt(webSocket.url.substr(1), 10)
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
        const x = "./" + project.outdir + "/" + fPath.replace(ext, "") + ".js";
        return path.resolve(x);
      };

      const bootInterval = setInterval(async () => {
        const filesToLookup = this.project.tests
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
          console.log(
            this.spinner(),
            "waiting for files to be bundled...",
            filesToLookup
          );
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

          const inputFilePaths: string[] = this.project
            .tests
            .reduce((m, [inputFilePath, runtime]) => {
              const script = makePath(inputFilePath);
              this.summary[inputFilePath] = undefined;
              const partialTestResourceByCommandLineArg = `${script} '${JSON.stringify(
                {
                  name: inputFilePath,
                  ports: [],
                  fs: path.resolve(
                    process.cwd(),
                    project.outdir,
                    inputFilePath
                  ),
                }
              )}'`;

              if (runtime === "puppeteer") {
                const sourceFileSplit = inputFilePath.split("/");
                const sourceDir = sourceFileSplit.slice(0, -1);
                const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
                const sourceFileNameWithoutExtensions = sourceFileName.split(".").slice(0, -1).join(".")
                const htmlFilePath = path.normalize(`/${project.outdir}/${sourceDir.join("/")}/${sourceFileNameWithoutExtensions}.html`);

                // const name = script;

                pm2.start(
                  {
                    script: `node ./node_modules/testeranto/dist/common/Puppeteer.js ${htmlFilePath} '${JSON.stringify(
                      {
                        name: inputFilePath,
                        ports: [],
                        fs:
                          path.resolve(
                            process.cwd(),
                            project.outdir,
                            inputFilePath
                          ),
                      }
                    )}'`,
                    name: inputFilePath,
                    autorestart: false,
                    args: partialTestResourceByCommandLineArg,
                  },
                  (err, proc) => {
                    if (err) {
                      console.error(err);
                      return pm2.disconnect();
                    }
                  }
                );
              } else if (runtime === "electron") {
                const fileAsList = inputFilePath.split("/");
                const fileListHead = fileAsList.slice(0, -1);
                const fname = fileAsList[fileAsList.length - 1];
                const fnameOnly = fname.split(".").slice(0, -1).join(".");
                const htmlFile = [this.project.outdir, ...fileListHead, `${fnameOnly}.html`].join("/");
                // const htmlFilePath = path.normalize(`${process.cwd()}/${this.outdir}/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);

                // const name = `electron ${htmlFile}`;
                pm2.start(
                  {
                    script: `yarn electron node_modules/testeranto/dist/common/electron.js ${htmlFile} '${JSON.stringify(
                      {
                        name: inputFilePath,
                        ports: [],
                        fs:
                          path.resolve(
                            process.cwd(),
                            project.outdir,
                            inputFilePath
                          ),
                      }
                    )}'`,
                    name: inputFilePath,
                    autorestart: false,
                    args: partialTestResourceByCommandLineArg,
                  },
                  (err, proc) => {
                    if (err) {
                      console.error(err);
                      return pm2.disconnect();
                    }
                  }
                );



              } else if (runtime === "node") {
                // const name = `node ${inputFilePath}`
                pm2.start({
                  name: inputFilePath,
                  script: `node ${script} '${JSON.stringify(
                    {
                      name: inputFilePath,
                      ports: [],
                      fs:
                        path.resolve(
                          process.cwd(),
                          project.outdir,
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

          // console.log("inputFilePaths", inputFilePaths);

          setInterval(this.mainLoop, TIMEOUT).unref();
        }
      }, TIMEOUT).unref();
    });
  }

  public shutdown() {
    this.mode = `down`;

    pm2.list((err, processes) => {
      processes.forEach((proc: pm2.ProcessDescription) => {
        proc.pm_id &&
          pm2.stop(proc.pm_id, (err, proc) => {
            console.error(err);
          });
      });
    });
  }

  private spinner() {
    this.spinCycle = (this.spinCycle + 1) % this.spinAnimation.length;
    return this.spinAnimation[this.spinCycle];
  }

  private requestResource(
    requirement: ITTestResourceRequirement,
    protocol: IScehdulerProtocols
  ) {
    this.resourceQueue.push({ requirement, protocol });
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

  private mainLoop = async () => {
    if (this.project.clearScreen) {
      console.clear();
    }

    // console.log(
    //   `# of processes in resourceQueue:`,
    //   this.resourceQueue.length,
    //   "/",
    //   this.project.getSecondaryEndpointsPoints().length
    // );

    // pm2.list((err, procs) => {
    //   procs.forEach((proc) => {
    //     console.log(proc.name, proc.pid, proc.pm_id, proc.monit)
    //   })
    // });


    // console.log("webSocketServer.clients", webSocketServer.clients.size);
    console.log("resourceQueue", this.resourceQueue);

    this.tick();
    // this.checkForShutDown();

    console.log(
      this.spinner(),
      this.mode === `up`
        ? `press "q" to initiate graceful shutdown`
        : `please wait while testeranto shuts down gracefully...`
    );
  };

  private tick() {
    const resourceRequest = this.resourceQueue.pop();

    if (!resourceRequest) {
      console.log("feed me a test!");
      return;
    } else {
      console.log("handling", resourceRequest);
    }

    if (resourceRequest.protocol === "ipc") {
      this.allocateViaIpc(resourceRequest)
    } else if (resourceRequest.protocol === "ws") {
      this.allocateViaWs(resourceRequest)
    }
  }

  private allocateViaWs(resourceRequest: {
    requirement: ITTestResourceRequirement;
    protocol: IScehdulerProtocols;
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
    protocol: IScehdulerProtocols;
  }) {
    console.log("allocateViaIpc", resourceRequest)
    const pName = resourceRequest.requirement.name;
    const testResourceRequirement = resourceRequest.requirement;

    pm2.list((err, processes) => {
      // console.log("mark1", processes);
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

  // this is called every cycle
  // if there are no running processes, none waiting and we are in shutdown mode,
  // write the summary to a file and end self with summarized exit code
  // private checkForShutDown() {
  //   const sums = Object.entries(this.summary).filter((s) => s[1] !== undefined);
  // }

  // public async abort(pm2Proc: IIpcResourceRequest) {
  //   pm2.stop(pm2Proc.process.pm_id, (err, proc) => {
  //     console.error(err);
  //   });
  // }
}

const getRunnables = (
  tests: ITestTypes[],
  payload = [new Set<string>(), new Set<string>()]
): [Set<string>, Set<string>] => {
  // const sidekicks: [Set<string>, Set<string>] = [new Set<string>(), new Set<string>()];
  // tests.reduce((pt, cv, cndx, cry) => {
  // }, sidekicks);
  // return sidekicks;
  return tests.reduce((pt, cv, cndx, cry) => {

    if (cv[1] === "node") {
      pt[0].add(cv[0]);
    } else if (cv[1] === "electron") {
      pt[1].add(cv[0]);
    }

    if (cv[2].length) {
      getRunnables(cv[2], payload);
    }

    return pt;
  }, payload as [Set<string>, Set<string>]);

}

export class ITProjectTests { }

export class ITProject {
  buildMode: "on" | "off" | "watch";
  clearScreen: boolean;
  collateEntry: string;
  collateMode: ICollateMode;
  features: TesterantoFeatures;
  loaders: any[];
  minify: boolean;
  outbase: string;
  outdir: string;
  ports: string[];
  runMode: boolean;
  tests: ITestTypes[];
  __dirname: string;

  getSecondaryEndpointsPoints(runtime?: IRunTime): string[] {
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

  constructor(config: IBaseConfig) {
    this.buildMode = config.buildMode;
    this.clearScreen = config.clearScreen;
    this.collateEntry = config.collateEntry;
    this.collateMode = config.collateMode;
    this.features = config.features;
    this.loaders = config.loaders;
    this.minify = config.minify;
    this.outbase = config.outbase;
    this.outdir = config.outdir;
    this.ports = config.ports;
    this.runMode = config.runMode;
    this.tests = config.tests;
    this.__dirname = config.__dirname;

    // const collateDir = ".";

    // const collateOpts: BuildOptions = {
    //   format: "iife",
    //   outbase: this.outbase,
    //   outdir: collateDir,
    //   jsx: `transform`,
    //   entryPoints: [config.collateEntry],
    //   bundle: true,
    //   write: true,

    //   banner: {
    //     js: ' (() => new EventSource("/esbuild").onmessage = () => location.reload())();',
    //   },

    //   plugins: [
    //     {
    //       name: "hot-refresh",
    //       setup(build) {
    //         build.onEnd((result) => {
    //           console.log(`collation transpilation`, result);
    //           /* @ts-ignore:next-line */
    //           clients.forEach((res) => res.write("data: update\n\n"));
    //           clients.length = 0;
    //           // console.log(error ? error : '...')
    //         });
    //       },
    //     },
    //   ],
    // };

    const runnables = getRunnables(this.tests);
    console.log("runnables", runnables);

    const nodeEntryPoints = this.getSecondaryEndpointsPoints("node");

    const esbuildConfigNode: BuildOptions = {
      packages: "external",
      platform: "node",
      outbase: this.outbase,
      outdir: this.outdir,
      jsx: `transform`,
      entryPoints: [
        // ...nodeEntryPoints,
        ...runnables[0]
      ],
      bundle: true,
      minify: this.minify === true,
      write: true,
      plugins: [
        ...(this.loaders || []),
      ],
    };

    Promise.resolve(Promise.all(
      [...this.getSecondaryEndpointsPoints("puppeteer"),
      ...this.getSecondaryEndpointsPoints("electron")]
        .map(async (sourceFilePath) => {
          const sourceFileSplit = sourceFilePath.split("/");
          const sourceDir = sourceFileSplit.slice(0, -1);
          const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
          const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
          const htmlFilePath = path.normalize(`${process.cwd()}/${this.outdir}/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);
          const jsfilePath = `./${sourceFileNameMinusJs}.js`;
          return fs.promises.mkdir(path.dirname(htmlFilePath), { recursive: true }).then(x => fs.writeFileSync(htmlFilePath, `
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
      external: ["stream"],
      platform: "browser",
      format: "esm",
      outbase: this.outbase,
      outdir: this.outdir,
      jsx: `transform`,
      entryPoints: [
        ...runnables[1],
      ],
      bundle: true,
      minify: this.minify === true,
      write: true,
      splitting: true,
      plugins: [
        ...(this.loaders || []),
        {
          name: "testeranto-redirect",
          setup(build) {
            build.onResolve({ filter: /^.*\/testeranto\/$/ }, (args) => {
              return {
                path: path.join(
                  process.cwd(),
                  `..`,
                  "node_modules",
                  `testeranto`
                ),
              };
            });
          },
        },
      ],
    };


    esbuild.build({
      bundle: true,
      entryPoints: ["./node_modules/testeranto/dist/module/Report.js"],
      minify: this.minify === true,
      outbase: this.outbase,
      write: true,
      outfile: `${this.outdir}/Report.js`
      // outfile: "Report.js",
      // outdir: this.outdir,
    });

    console.log("buildMode   -", this.buildMode);
    console.log("runMode     -", this.runMode);
    console.log("collateMode -", this.collateMode);

    if (this.buildMode === "on") {
      console.log("esbuildConfigNode", esbuildConfigNode)
      esbuild.build(esbuildConfigNode).then(async (eBuildResult) => {
        console.log("node tests", eBuildResult);
      });
      esbuild.build(esbuildConfigWeb).then(async (eBuildResult) => {
        console.log("electron tests", eBuildResult);
      });
    } else if (this.buildMode === "watch") {
      Promise.all([
        esbuild.context(esbuildConfigNode).then(async (nodeContext) => {
          nodeContext.watch();
        }),
        esbuild.context(esbuildConfigWeb).then(async (esbuildWeb) => {

          if (this.runMode) {

            // unlike the server side, we need to run an http server to handle chunks imported into web-tests.
            esbuildWeb.serve({
              port: 8000,
              servedir: ".",
              onRequest: (args: ServeOnRequestArgs) => {
                // console.log("onRequest", args)
              }
            }).then((esbuildServerResult) => {
              console.log("esbuildServer result", esbuildServerResult)
            }, (esbuildServerFailure) => {
              console.log("esbuildServer failure", esbuildServerFailure)
              process.exit(-1)
            })
          }
        })
      ]
      );

    } else {
      console.log("skipping 'build' phase");
    }

    if (this.runMode) {
      const scheduler = new Scheduler(this);

      process.stdin.on("keypress", (str, key) => {
        if (key.name === "q") {
          // process.stdin.setRawMode(false);
          console.log("Shutting down gracefully...");
          scheduler.shutdown();
        }

        if (key.ctrl && key.name === "c") {
          console.log("Shutting down ungracefully!");
          process.exit(-1);
        }
      });
    } else {
      console.log("skipping 'run' phase");
    }

    // if (this.collateMode === "on") {
    //   esbuild.build(collateOpts).then(async (eBuildResult) => {
    //     console.log("ts collation", eBuildResult);
    //   });
    // } else if (this.collateMode === "watch") {
    //   esbuild.context(collateOpts).then(async (ectx) => {
    //     ectx.watch();
    //   });
    // } else if (this.collateMode === "serve") {
    //   esbuild.context(collateOpts).then((esbuildContext) => {
    //     hotReload(esbuildContext, collateDir);
    //   });
    // } else if (this.collateMode === "watch+serve") {
    //   esbuild.context(collateOpts).then((esbuildContext) => {
    //     hotReload(esbuildContext, collateDir);
    //     esbuildContext.watch();
    //     console.log(`serving collated reports @ ${"http://localhost:8000/"}`);
    //   });
    // } else if (this.collateMode === "dev") {
    //   console.log("mark2", process.cwd());

    //   esbuild.build({
    //     bundle: true,
    //     entryPoints: [config.collateEntry],
    //     format: "iife",
    //     jsx: `transform`,
    //     minify: this.minify === true,
    //     outbase: this.outbase,
    //     outdir: collateDir,
    //     write: true,
    //   });
    // } else {
    //   console.log("skipping 'collate' phase");
    // }
  }
}

// const hotReload = (ectx, collateDir, port?: string) => {
//   ectx.serve({ servedir: collateDir, host: "localhost" }).then(() => {
//     if (port) {
//       createServer((req, res) => {
//         const { url, method, headers } = req;
//         if (req.url === "/esbuild")
//           return clients.push(
//             /* @ts-ignore:next-line */
//             res.writeHead(200, {
//               "Content-Type": "text/event-stream",
//               "Cache-Control": "no-cache",
//               Connection: "keep-alive",
//             })
//           );
//         /* @ts-ignore:next-line */
//         const path = ~url.split("/").pop().indexOf(".") ? url : `/index.html`; //for PWA with router
//         req.pipe(
//           request(
//             { hostname: "0.0.0.0", port, path, method, headers },
//             (prxRes) => {
//               /* @ts-ignore:next-line */
//               res.writeHead(prxRes.statusCode, prxRes.headers);
//               prxRes.pipe(res, { end: true });
//             }
//           ),
//           { end: true }
//         );
//       }).listen(port);

//       setTimeout(() => {
//         console.log("tick");
//         const op = {
//           darwin: ["open"],
//           linux: ["xdg-open"],
//           win32: ["cmd", "/c", "start"],
//         };
//         const ptf = process.platform;
//         if (clients.length === 0)
//           spawn(op[ptf][0], [
//             ...[op[ptf].slice(1)],
//             `http://localhost:${port}`,
//           ]);
//       }, 1000); //open the default browser only if it is not opened yet
//     }
//   });
// };
