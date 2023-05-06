import fs from "fs";
import fsExists from "fs.promises.exists";
import pm2 from "pm2";
import { spawn } from "child_process";
import path from "path";
import esbuild, { BuildContext, BuildOptions } from "esbuild";
import { createServer, request } from "http";

import { TesterantoFeatures } from "./Features";
import { ICollateMode } from "./IBaseConfig";
import { IBaseConfig } from "./index.js";

export type IRunTimes = `node` | `electron`;
export type ITestTypes = [f: string, r: IRunTimes][];
const TIMEOUT = 2000;
const OPEN_PORT = "";
const clients = [];

const hotReload = (ectx, collateDir, port?: string) => {
  ectx.serve({ servedir: collateDir, host: "localhost" }).then(() => {
    if (port) {
      createServer((req, res) => {
        const { url, method, headers } = req;
        if (req.url === "/esbuild")
          return clients.push(
            /* @ts-ignore:next-line */
            res.writeHead(200, {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              Connection: "keep-alive",
            })
          );
        /* @ts-ignore:next-line */
        const path = ~url.split("/").pop().indexOf(".") ? url : `/index.html`; //for PWA with router
        req.pipe(
          request(
            { hostname: "0.0.0.0", port, path, method, headers },
            (prxRes) => {
              /* @ts-ignore:next-line */
              res.writeHead(prxRes.statusCode, prxRes.headers);
              prxRes.pipe(res, { end: true });
            }
          ),
          { end: true }
        );
      }).listen(port);

      setTimeout(() => {
        console.log("tick");
        const op = {
          darwin: ["open"],
          linux: ["xdg-open"],
          win32: ["cmd", "/c", "start"],
        };
        const ptf = process.platform;
        if (clients.length === 0)
          spawn(op[ptf][0], [
            ...[op[ptf].slice(1)],
            `http://localhost:${port}`,
          ]);
      }, 1000); //open the default browser only if it is not opened yet
    }
  });
};

type IPm2Process = {
  process: {
    namespace: string;
    versioning: object;
    name: string;
    pm_id: number;
  };
  data: {
    testResourceRequirement: {
      ports: number;
    };
  };
  at: string;
};

type IPm2ProcessB = {
  process: {
    namespace: string;
    versioning: object;
    name: string;
    pm_id: number;
  };
  data: {
    testResource: string[];
    results: any;
  };
  at: string;
};

export default class Scheduler {
  project: ITProject;

  ports: Record<string, string>;
  jobs: Record<
    string,
    {
      aborter: () => any;
      cancellablePromise: string;
    }
  >;
  queue: IPm2Process[];
  spinCycle = 0;
  spinAnimation = "←↖↑↗→↘↓↙";
  pm2: typeof pm2;
  summary: Record<string, boolean | undefined>;

  mode: `up` | `down`;

  constructor(project: ITProject) {
    this.project = project;

    this.queue = [];
    this.jobs = {};
    this.ports = {};

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

      this.pm2 = pm2;

      const makePath = (fPath: string): string => {
        const ext = path.extname(fPath);
        const x = "./" + project.outdir + "/" + fPath.replace(ext, "") + ".cjs";
        return path.resolve(x);
      };

      const bootInterval = setInterval(async () => {
        const filesToLookup = this.project.getEntryPoints().map((f) => {
          const filepath = makePath(f[0]);
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

          this.project
            .getEntryPoints()
            .reduce((m, [inputFilePath, runtime]) => {
              const script = makePath(inputFilePath);
              this.summary[inputFilePath] = undefined;
              // const partialTestResourceByCommandLineArg = `${script} '${JSON.stringify(
              //   {
              //     ports: [],
              //     fs: path.resolve(
              //       process.cwd(),
              //       project.outdir,
              //       inputFilePath
              //     ),
              //   }
              // )}'`;

              m[inputFilePath] = pm2.start(
                {
                  script: `yarn electron node_modules/testeranto/dist/common/electron.js ./js-bazel/myTests/ClassicalReact.html '${JSON.stringify(
                    {
                      ports: [],
                      fs: path.resolve(
                        process.cwd(),
                        project.outdir,
                        inputFilePath
                      ),
                    }
                  )}'`,
                  name: `electron test`,
                  // autorestart: false,
                  // watch: [script],
                  // env: {
                  //   ELECTRON_NO_ASAR: `true`,
                  //   ELECTRON_RUN_AS_NODE: `true`,
                  // },
                  // args: partialTestResourceByCommandLineArg,
                },
                (err, proc) => {
                  if (err) {
                    console.error(err);
                    return pm2.disconnect();
                  } else {
                  }
                }
              );
              return m;
            }, {});

          pm2.launchBus((err, pm2_bus) => {
            pm2_bus.on("testeranto:hola", (packet: any) => {
              console.log("hola", packet);
              this.push(packet);
            });

            pm2_bus.on("testeranto:adios", (packet: IPm2ProcessB) => {
              console.log("adios", packet);
              this.releaseTestResources(packet);
            });
          });

          setInterval(async () => {
            if (this.project.clearScreen) {
              console.clear();
            }

            console.log(
              `# of processes in queue:`,
              this.queue.length,
              "/",
              this.project.getEntryPoints().length
            );
            console.log(`summary:`, this.summary);
            console.log(`ports:`, this.ports);
            // pm2.list((err, procs) => {
            //   procs.forEach((proc) => {
            //     console.log(proc.name, proc.pid, proc.pm_id, proc.monit)
            //   })
            // });

            this.pop();
            this.checkForShutDown();

            console.log(
              this.spinner(),
              this.mode === `up`
                ? `press "q" to initiate graceful shutdown`
                : `please wait while testeranto shuts down gracefully...`
            );
          }, TIMEOUT).unref();
        }
      }, TIMEOUT).unref();
    });
  }

  // this is called every cycle
  // if there are no running processes, none waiting and we are in shutdown mode,
  // write the summary to a file and end self with summarized exit code
  private checkForShutDown() {
    const sums = Object.entries(this.summary).filter((s) => s[1] !== undefined);
  }

  public async abort(pm2Proc: IPm2Process) {
    this.pm2.stop(pm2Proc.process.pm_id, (err, proc) => {
      console.error(err);
    });
  }

  private spinner() {
    this.spinCycle = (this.spinCycle + 1) % this.spinAnimation.length;
    return this.spinAnimation[this.spinCycle];
  }

  private push(process: IPm2Process) {
    this.queue.push(process);
  }

  private pop() {
    const p = this.queue.pop();

    if (!p) {
      console.log("feed me a test");
      return;
    }

    const pid = p.process.pm_id;
    const testResourceRequirement = p.data.testResourceRequirement;
    // const fPath = path.resolve(this.project.resultsdir + `/` + p.process.name);

    const message = {
      // these fields must be present
      id: p.process.pm_id,
      topic: "some topic",
      type: "process:msg",

      // Data to be sent
      data: {
        testResourceConfiguration: {
          ports: [],
          // fs: fPath,
        },
        id: p.process.pm_id,
      },
    };
    if (testResourceRequirement?.ports === 0) {
      this.pm2.sendDataToProcessId(
        p.process.pm_id,
        message,
        function (err, res) {
          // console.log("sendDataToProcessId", err, res, message);
        }
      );
    }

    if ((testResourceRequirement?.ports || 0) > 0) {
      // clear any port-slots associated with this job
      Object.values(this.ports).forEach((jobMaybe, portNumber) => {
        if (jobMaybe && jobMaybe === pid.toString()) {
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
          id: p.process.pm_id, // id of process from "pm2 list" command or from pm2.list(errback) method
          topic: "some topic",
          // process:msg will be send as 'message' on target process
          type: "process:msg",

          // Data to be sent
          data: {
            testResourceConfiguration: {
              // fs: fPath,
              ports: selectionOfPorts,
            },
            id: p.process.pm_id,
          },
        };

        console.log("mark1");
        this.pm2.sendDataToProcessId(
          p.process.pm_id,
          message,
          function (err, res) {}
        );

        // mark the selected ports as occupied
        for (const foundOpenPort of selectionOfPorts) {
          this.ports[foundOpenPort] = pid.toString();
        }
      } else {
        console.log(
          `no port was open so send the ${pid} job to the back of the queue`
        );
        this.queue.push(p);
      }
    }
  }

  private async releaseTestResources(pm2Proc: IPm2ProcessB) {
    if (pm2Proc) {
      (pm2Proc.data.testResource || []).forEach((p, k) => {
        const jobExistsAndMatches =
          this.ports[p] === pm2Proc.process.pm_id.toString();
        if (jobExistsAndMatches) {
          this.ports[p] = OPEN_PORT;
        }
      });
    } else {
      console.error("idk?!");
    }
  }

  public shutdown() {
    this.mode = `down`;

    pm2.list((err, processes) => {
      processes.forEach((proc: pm2.ProcessDescription) => {
        proc.pm_id &&
          this.pm2.stop(proc.pm_id, (err, proc) => {
            console.error(err);
          });
      });
    });
  }
}

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
  tests: ITestTypes;

  getEntryPoints(runtime?: IRunTimes): ITestTypes {
    if (runtime)
      return Object.values(this.tests).filter((t) => t[1] === runtime);

    return Object.values(this.tests);
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

    const collateDir = ".";

    const collateOpts: BuildOptions = {
      format: "iife",
      outbase: this.outbase,
      outdir: collateDir,
      jsx: `transform`,
      entryPoints: [config.collateEntry],
      bundle: true,
      minify: this.minify === true,
      write: true,

      banner: {
        js: ' (() => new EventSource("/esbuild").onmessage = () => location.reload())();',
      },

      plugins: [
        {
          name: "hot-refresh",
          setup(build) {
            build.onEnd((result) => {
              console.log(`collation traspilation`, result);
              /* @ts-ignore:next-line */
              clients.forEach((res) => res.write("data: update\n\n"));
              clients.length = 0;
              // console.log(error ? error : '...')
            });
          },
        },
      ],
    };

    const nodeRuntimeEsbuildConfig: BuildOptions = {
      platform: "node",
      format: "esm",
      outbase: this.outbase,
      outdir: this.outdir,
      jsx: `transform`,
      entryPoints: this.getEntryPoints("node").map(
        (sourcefile) => sourcefile[0]
      ),
      bundle: true,
      minify: this.minify === true,
      write: true,
      outExtension: { ".js": ".mjs" },
      packages: "external",
      plugins: [
        ...(this.loaders || []),
        {
          name: "testeranto-redirect",
          setup(build) {
            build.onResolve({ filter: /^.*\/testeranto\/$/ }, async (args) => {
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

    this.getEntryPoints("electron").map((sourcefile) => {
      fs.writeFile(
        `${this.outdir}/${sourcefile[0]
          .split("/")
          .slice(0, -1)
          .join("/")}.html`,
        `
<!DOCTYPE html>
    <html lang="en">
    <head>
      <script type="module" src="./ClassicalReact/ClassicalComponent.electron.test.js"></script>
    </head>

    <body>
      <div id="root">
      </div>
    </body>

    <footer></footer>

    </html>
`,
        (error) => {
          if (error) {
            console.error(error);
          }
        }
      );
    });

    const electronRuntimeEsbuildConfig: BuildOptions = {
      // target: `node`,
      platform: "node",
      format: "esm",
      outbase: this.outbase,
      outdir: this.outdir,
      jsx: `transform`,
      entryPoints: this.getEntryPoints("electron").map(
        (sourcefile) => sourcefile[0]
      ),
      bundle: true,
      minify: this.minify === true,
      write: true,
      outExtension: { ".js": ".js" },
      packages: "external",
      // splitting: true,
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

    esbuild.build(electronRuntimeEsbuildConfig).then((eBuildResult) => {
      console.log("electron tests", eBuildResult);
    });

    esbuild
      .context({
        entryPoints: ["src/app.ts"],
        outdir: "www/js",
        bundle: true,
      })
      .then(() => {});

    let { host, port } = ctx.serve({
      servedir: "www",
    });

    // console.log("buildMode   -", this.buildMode);
    // console.log("runMode     -", this.runMode);
    // console.log("collateMode -", this.collateMode);

    // if (this.buildMode === "on") {
    //   /* @ts-ignore:next-line */
    //   // esbuild.build(nodeRuntimeEsbuildConfig).then(async (eBuildResult) => {
    //   //   console.log("node tests", eBuildResult);
    //   // });

    //   /* @ts-ignore:next-line */
    //   esbuild.build(electronRuntimeEsbuildConfig).then(async (eBuildResult) => {
    //     console.log("electron tests", eBuildResult);
    //   });
    // } else if (this.buildMode === "watch") {
    //   /* @ts-ignore:next-line */
    //   // esbuild.context(nodeRuntimeEsbuildConfig).then(async (ectx) => {
    //   //   ectx.watch();
    //   // });

    //   /* @ts-ignore:next-line */
    //   esbuild.context(electronRuntimeEsbuildConfig).then(async (ectx) => {
    //     ectx.watch();
    //   });
    // } else {
    //   console.log("skipping 'build' phase");
    // }

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
