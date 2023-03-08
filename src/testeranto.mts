import path from 'path';
import pm2 from 'pm2';
import fs from "fs";
import * as esbuild from "esbuild";
import fsExists from 'fs.promises.exists'
import readline from 'readline';

import { TesterantoFeatures } from "./index.mjs";

console.log("watch.ts", process.cwd(), process.argv);

const TIMEOUT = 1000;
const OPEN_PORT = '';

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

type IPm2Process = {
  process: {
    namespace: string;
    versioning: object;
    name: string;
    pm_id: number;
  },
  data: {
    testResource: {
      ports: number
    }
  };
  at: string;
};

type IPm2ProcessB = {
  process: {
    namespace: string;
    versioning: object;
    name: string;
    pm_id: number;
  },
  data: {
    testResource: string[],
    results: any,
  };
  at: string;
};

type ITProject = {
  tests: string[],
  features: TesterantoFeatures,
  ports: string[],
  watchMode: boolean,
  loaders: any[],
  resultsdir: string,
  minify: boolean,
  outbase: string,
  outdir: string,
  clearScreen: boolean;
};

class Scheduler {
  project: ITProject;

  ports: Record<string, string>;
  jobs: Record<string, {
    aborter: () => any;
    cancellablePromise: string;
  }>;
  queue: IPm2Process[];
  spinCycle = 0;
  spinAnimation = "←↖↑↗→↘↓↙";
  pm2: typeof pm2;
  summary: Record<string, boolean | undefined>;

  mode: `up` | `down`;

  constructor(
    project: ITProject,
  ) {

    this.project = project;

    this.queue = [];
    this.jobs = {};
    this.ports = {};

    this.project.ports.forEach((port) => {
      this.ports[port] = OPEN_PORT;
    });

    this.mode = `up`;
    this.summary = {};

    pm2.connect(async (err) => {
      if (err) {
        console.error(err)
        process.exit(-1)
      } else {
        console.log(`pm2 is connected`);
      }

      this.pm2 = pm2;

      const makePath = (fPath: string): string => {
        return "./" + project.outdir + "/" + fPath.split(".ts")[0] + ".mjs";
      }

      const bootInterval = setInterval(async () => {

        const filesToLookup = this.project.tests.map((f) => {
          const filepath = makePath(f);
          return {
            filepath,
            exists: fsExists(filepath)
          }
        });
        const allFilesExist = (await Promise.all(filesToLookup.map((f) => f.exists))).every((b) => b);

        if (!allFilesExist) {
          console.log(this.spinner(), "waiting for files to be bundled...", filesToLookup);
        } else {
          clearInterval(bootInterval);

          this.project.tests.reduce((m, inputFilePath) => {
            const script = makePath(inputFilePath);

            this.summary[inputFilePath] = undefined;

            m[inputFilePath] = pm2.start({
              script,
              name: inputFilePath,
              autorestart: false,
              watch: [script],
            }, (err, apps) => {
              if (err) {
                console.error(err);
                return pm2.disconnect();
              }
            });
            return m;
          }, {});

          pm2.launchBus((err, pm2_bus) => {
            pm2_bus.on('testeranto:hola', (packet: any) => {
              // console.log("hola", packet);
              this.push(packet);
            });

            pm2_bus.on('testeranto:adios', (packet: IPm2ProcessB) => {
              // console.log("adios", packet);
              this.releaseTestResources(packet);
            });

          });

          setInterval(async () => {
            if (this.project.clearScreen) {
              console.clear()
            }

            console.log(`# of processes in queue:`, this.queue.length, "/", this.project.tests.length);
            console.log(`summary:`, this.summary);
            console.log(`watchmode:`, this.project.watchMode);
            // pm2.list((err, procs) => {
            //   procs.forEach((proc) => {
            //     console.log(proc.name, proc.pid, proc.pm_id, proc.monit)
            //   })
            // });

            this.pop();
            this.checkForShutDown();

            console.log(this.spinner(), this.mode === `up` ? `press "q" to initiate graceful shutdown` : `please wait while testeranto shuts down gracefully...`);

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

    if (

      (this.project.watchMode === false || this.mode === `down`) &&
      sums.length === this.project.tests.length
    ) {

      fs.writeFile(
        `${this.project.resultsdir}/results.json`,
        JSON.stringify(this.summary, null, 2),
        (err) => {
          if (err) {
            console.error(err);
          }
          const finalExitCode = sums.filter((s) => s[1] !== true).length


          fs.writeFile(
            `${this.project.resultsdir}/testeranto.txt`,
            finalExitCode.toString(),
            (err) => {
              if (err) {
                console.error(err);
              }
              console.log(`goodbye testeranto - ${finalExitCode === 0 ? '👍🏼' : '👎🏻'}`)
              process.exit(finalExitCode);
            }
          );
        }
      );
    }
  }

  public async abort(pm2Proc: IPm2Process) {
    this.pm2.stop(pm2Proc.process.pm_id, (err, proc) => {
      console.error(err);
    });
  }

  private spinner() {
    this.spinCycle = (this.spinCycle + 1) % this.spinAnimation.length;
    return this.spinAnimation[this.spinCycle]
  }

  private push(process: IPm2Process) {
    this.queue.push(process);
  }

  private pop() {
    const p = this.queue.pop();

    if (!p) {
      console.log('feed me a test');
      return;
    }

    const pid = p.process.pm_id;
    const testResource = p.data.testResource;

    const recommendedFsPath = path.resolve(`${process.cwd()}/${this.project.resultsdir}/${p.process.name}/`);//.replaceAll('.', '-');
    const message = {
      // these fields must be present
      id: p.process.pm_id, // id of process from "pm2 list" command or from pm2.list(errback) method
      topic: 'some topic',
      // process:msg will be send as 'message' on target process
      type: 'process:msg',

      // Data to be sent
      data: {
        goWithTestResources: [],
        id: p.process.pm_id,
        recommendedFsPath
      }
    };

    if (testResource?.ports === 0) {
      this.pm2.sendDataToProcessId(p.process.pm_id, message, function (err, res) {
        // console.log("sendDataToProcessId", err, res, message);
      })
    }

    if ((testResource?.ports || 0) > 0) {

      // clear any port-slots associated with this job
      Object.values(this.ports).forEach((jobMaybe, portNumber) => {
        if (jobMaybe && jobMaybe === pid.toString()) {
          this.ports[portNumber] = OPEN_PORT;
        }
      });

      // find a list of open ports
      const foundOpenPorts = Object.keys(this.ports)
        .filter((p) => this.ports[p] === OPEN_PORT);

      // if there are enough open port-slots...
      if (foundOpenPorts.length >= testResource.ports) {

        const selectionOfPorts = foundOpenPorts.slice(0, testResource.ports);

        const message = {
          // these fields must be present
          id: p.process.pm_id, // id of process from "pm2 list" command or from pm2.list(errback) method
          topic: 'some topic',
          // process:msg will be send as 'message' on target process
          type: 'process:msg',

          // Data to be sent
          data: {
            goWithTestResources: selectionOfPorts,
            id: p.process.pm_id,
            recommendedFsPath
          }
        };

        this.pm2.sendDataToProcessId(p.process.pm_id, message, function (err, res) {
        })

        // mark the selected ports as occupied
        for (const foundOpenPort of selectionOfPorts) {
          this.ports[foundOpenPort] = pid.toString();
        }

      } else {
        console.log(`no port was open so send the ${pid} job to the back of the queue`)
        this.queue.push(p);
      }
    }
  }

  private async releaseTestResources(pm2Proc: IPm2ProcessB) {
    if (pm2Proc) {
      (pm2Proc.data.testResource || [])
        .forEach((p, k) => {
          const jobExistsAndMatches = this.ports[p] === pm2Proc.process.pm_id.toString();
          if (jobExistsAndMatches) {
            this.ports[p] = OPEN_PORT;
          }
        });

      if (pm2Proc.data.results) {
        const testJob = { test: pm2Proc.data.results };
        await fs.mkdirSync(`${this.project.resultsdir}/${pm2Proc.process.name}`.split('/').slice(0, -1).join('/'), { recursive: true });

        fs.writeFile(
          `${this.project.resultsdir}/${pm2Proc.process.name}.json`,
          JSON.stringify(
            ({
              ...pm2Proc.data.results,
              givens: pm2Proc.data.results.givens.map((g) => { delete g.testArtifacts; return g })
            }),
            null, 2),
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );

        this.summary[pm2Proc.process.name] = testJob.test.fails.length === 0;
        // fs.writeFile(
        //   `${reportOutPath}testDAG.json`,
        //   JSON.stringify(this.testerantoFeatures.graphs.dags[0].graph.export(), null, 2),
        //   (err) => {
        //     if (err) {
        //       console.error(err);
        //     }
        //   }
        // );

      }
    } else {
      console.error("idk?!")
    }
  }

  public shutdown() {
    this.mode = `down`;

    pm2.list(((err, processes) => {
      processes.forEach((proc: pm2.ProcessDescription) => {

        proc.pm_id && this.pm2.stop(proc.pm_id, (err, proc) => {
          console.error(err);
        });
      })

    }))

  }
}

let scheduler: Scheduler;

process.stdin.on('keypress', (str, key) => {
  if (key.name === 'q') {
    console.log("Shutting down gracefully...");
    scheduler.shutdown();
  }

  if (key.ctrl && key.name === 'c') {
    console.log("Shutting down ungracefully!");
    process.exit(-1);
  }
});

export default async (project: ITProject) => {
  const ctx = await esbuild.context({
    allowOverwrite: true,
    outbase: project.outbase,
    outdir: project.outdir,
    jsx: `transform`,
    entryPoints: [
      ...project.tests.map((sourcefile) => {
        return sourcefile;
      })
    ],
    bundle: true,
    minify: project.minify === true,
    format: "esm",
    write: true,
    outExtension: { '.js': '.mjs' },
    packages: 'external',
    plugins: [
      ...project.loaders || [],
    ],
    external: [
    ]
  });

  scheduler = new Scheduler(project);
  ctx.watch();

};
