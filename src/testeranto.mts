import pm2 from 'pm2';
import fs from "fs";
import path from "path";
import * as esbuild from 'esbuild';
import fsExists from 'fs.promises.exists'

import { TesterantoFeatures } from "./index.mjs";

console.log("watch.ts", process.cwd(), process.argv);

const configFile = `${process.cwd()}/${process.argv[2]}`;

console.log("watch.ts configFile", configFile);

const TIMEOUT = 1000;
const OPEN_PORT = '';
const testOutPath = "./dist/results/";

class TesterantoProject {
  tests: string[];
  features: string;
  ports: string[];
  watchMode: boolean;
  loaders: {
    name: string;
    setup: (build: any) => any;
  }[];
  outdir: string;
  resultsdir: string;

  constructor(
    tests, features, ports, watchMode, loaders, outdir: string, resultsdir: string
  ) {
    this.tests = tests;
    this.features = features;
    this.ports = ports;
    this.watchMode = watchMode;
    this.loaders = loaders;
    this.outdir = outdir;
    this.resultsdir = resultsdir;
  }
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

class Scheduler {
  testerantoFeatures: TesterantoFeatures;
  project: TesterantoProject;

  ports: Record<string, string>;
  jobs: Record<string, {
    aborter: () => any;
    cancellablePromise: string;
  }>;
  queue: IPm2Process[];
  spinCycle = 0;
  spinAnimation = "←↖↑↗→↘↓↙";
  pm2: typeof pm2;

  constructor(project: TesterantoProject, testerantoFeatures: TesterantoFeatures) {
    const portsToUse = project.ports;
    this.ports = {};
    portsToUse.forEach((port) => {
      this.ports[port] = OPEN_PORT;
    });
    this.queue = [];
    this.jobs = {};
    this.project = project;
    this.testerantoFeatures = testerantoFeatures;

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
        // return "./dist/tests/" + fPath.split(".ts")[0] + ".mjs";
        // const fNameSplit = (fPath.split(".ts")[0]).split[`/`];
        // const fName = fNameSplit[fNameSplit.length -1 ];
        // return `./dist/tests/${classname}.mjs`;
      }

      const bootInterval = setInterval(async () => {

        const filesToLookup = this.project.tests.map((f) => {
          const filepath = makePath(f); //"./dist/" + f.split(".ts")[0] + ".mjs";
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
            const script = makePath(inputFilePath); // "./dist/" + fn.split(".ts")[0] + ".mjs";
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
            console.log(this.spinner(), this.queue.length, this.ports);
            this.pop();
          }, TIMEOUT);

        }

      }, TIMEOUT);





    });

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
    if (!p && Object.values(this.ports).every((pp) => pp === OPEN_PORT)) {
      if (this.project.watchMode === false) {
        console.log("watch mode is false, so I am quitting now");
        process.exit(0);
      } else {
        console.log('feed me some tests plz');
      }
    }
    if (!p) {
      return;
    }

    const pid = p.process.pm_id;
    const testResource = p.data.testResource;

    const message = {
      // these fields must be present
      id: p.process.pm_id, // id of process from "pm2 list" command or from pm2.list(errback) method
      topic: 'some topic',
      // process:msg will be send as 'message' on target process
      type: 'process:msg',

      // Data to be sent
      data: {
        goWithTestResources: [],
        id: p.process.pm_id
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
            id: p.process.pm_id
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

        // fs.writeFile(
        //   `${testOutPath}${pm2Proc.process.name}.json`,
        //   JSON.stringify(this.testerantoFeatures, null, 2),
        //   (err) => {
        //     if (err) {
        //       console.error(err);
        //     }
        //   }
        // );




        const testJob = { test: pm2Proc.data.results };

        for (const [gNdx, g] of testJob.test.givens.entries()) {
          for (const testArtifactKey of Object.keys(g.testArtifacts)) {
            for (const [ndx, testArtifact] of g.testArtifacts[testArtifactKey].entries()) {
              const artifactOutFolderPath = `$${this.project.resultsdir}/${pm2Proc.process.name}/${gNdx}/${ndx}/`;
              const artifactOutPath = `${artifactOutFolderPath}/${testArtifactKey}.png`
              await fs.promises.mkdir(artifactOutFolderPath, { recursive: true });
              await fs.writeFile(
                artifactOutPath,
                Buffer.from(testArtifact.binary.data),
                (err) => {
                  if (err) {
                    console.error(err);
                  }
                  // resolve(result)
                }
              );
            }
          }
        }

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
}

import(configFile).then(async (testerantoConfigImport) => {
  const configModule = testerantoConfigImport.default;
  const tProject = new TesterantoProject(
    configModule.tests,
    configModule.features,
    configModule.ports,
    configModule.watchMode,
    configModule.loaders,
    configModule.outdir,
    configModule.resultsdir,
  )
  const entryPoints = [
    tProject.features,
    ...tProject.tests.map((sourcefile) => {
      return sourcefile;
      // return `${tProject.outdir}/${sourcefile}`;
    })
  ];
  console.log("entryPoints", entryPoints);
  let ctx = await esbuild.context({
    entryPoints,
    bundle: true,
    minify: true,
    format: "esm",
    write: true,
    outdir: tProject.outdir,
    outExtension: { '.js': '.mjs' },
    packages: 'external',
    plugins: [
      {
        name: 'import-path',
        setup(build) {
          build.onResolve({ filter: /^\.{1,2}\// }, args => {

            const importedPath = args.resolveDir + "/" + args.path;
            const absolutePath = path.resolve(importedPath);

            const featurfilePath = path.resolve(tProject.features).split(".js").slice(0, -1).join('.js');

            if (absolutePath === featurfilePath) {
              return {
                path: process.cwd() + tProject.outdir + "/testerantoFeatures.test.mjs",
                external: true
              }
            }
          })
        },
      },
      ...tProject.loaders || [],
    ],
    external: [
      // testerantoConfig.features
    ]
  })

  fs.promises.writeFile("./dist/testeranto.config.js", JSON.stringify(tProject));

  import(path.resolve(process.cwd(), tProject.features)).then(async (testerantoFeaturesImport) => {
    const tFeatures = testerantoFeaturesImport.default as TesterantoFeatures;
    new Scheduler(tProject, tFeatures);
    await ctx.watch()
  });

});

export default {};