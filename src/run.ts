import * as esbuild from 'esbuild';
import pm2 from 'pm2';
import fs from "fs";
import path from "path";

const TIMEOUT = 1000;
const OPEN_PORT = '';
const testOutPath = "./dist/results/";
const featureOutPath = "./dist/";
const reportOutPath = "./dist/report";

class TesterantoProject {
  tests: [keyName: string, fileName: string, className: string][];
  features: string;
  ports: string[];

  constructor(tests, features, ports) {
    this.tests = tests;
    this.features = features;
    this.ports = ports
  }

  builder() {
    const text = JSON.stringify({ tests: this.tests, features: this.features });
    const p = "./dist/testeranto.config.json";
    fs.promises.mkdir(path.dirname(p), { recursive: true }).then(x => {
      fs.promises.writeFile(p, text);
    })
  }

}

export class Scheduler {
  // featureTestJoin: Record<string, any>;
  // testerantoFeatures: TesterantoFeatures;
  project: TesterantoProject;

  ports: Record<string, string>;
  jobs: Record<string, {
    aborter: () => any;
    cancellablePromise: string;  //CancelablePromise<unknown>
  }>;
  queue: {
    key: string,
    aborter: () => any;
    getCancellablePromise: (testResource) => string; // CancelablePromise<unknown>,
    // testResourceRequired: ITTestResourceRequirement
  }[];
  // testSrcMd5s: object;
  // featureSrcMd5: string;
  spinCycle = 0;
  spinAnimation = "←↖↑↗→↘↓↙";

  constructor(project: TesterantoProject) {
    const portsToUse = project.ports;
    this.ports = {};
    portsToUse.forEach((port) => {
      this.ports[port] = OPEN_PORT;
    });
    this.queue = [];
    this.jobs = {};
    // this.testSrcMd5s = {};
    // this.featureTestJoin = {};
    this.project = project;

    pm2.connect((err) => {
      if (err) {
        console.error(err)
        process.exit(2)
      }

      const theTests = this.project.tests.reduce((m, [kn, fn, cn]) => {
        m[kn] = pm2.start({
          script: "./dist/" + fn.split(".ts")[0] + ".js",
          name: cn
        }, (err, apps) => {
          if (err) {
            console.error(err)
            return pm2.disconnect()
          }
        });
        return m;
      }, {});

      pm2.launchBus((err, pm2_bus) => {

        pm2_bus.on('testeranto:hola', (packet) => {
          // this.push()
        });

        pm2_bus.on('testeranto:done', function (packet) {
          console.log(packet)
        });
        pm2_bus.on('testeranto:killed', function (packet) {
          console.log(packet)
        });
        pm2_bus.on('testeranto:aborted', function (packet) {
          console.log(packet)
        });
      })


      setInterval(async () => {
        console.log(this.spinner(), this.queue.length, this.ports);
        this.pop();
      }, TIMEOUT);
    })

  }

  public async abort(key) {
    if (this.jobs[key]) {
      console.log("aborting...", key, this.jobs[key])
      await this.jobs[key].aborter();
      // await this.jobs[key].cancellablePromise.cancel();
      delete this.jobs[key];
    }
  }

  private spinner() {
    this.spinCycle = (this.spinCycle + 1) % this.spinAnimation.length;
    return this.spinAnimation[this.spinCycle]
  }

  // private push(testJob: ITestJob, key) {
  //   // this.queue.push({
  //   //   key,
  //   //   // aborter: testJob.test.aborter,
  //   //   aborter: testJob.test.aborter,
  //   //   getCancellablePromise: this.startJob(testJob, key),
  //   //   testResourceRequired: testJob.testResource
  //   // });
  // }

  private pop() {
    const qi = this.queue.pop();
    if (!qi) {
      console.log('feed me some tests plz')
      return;
    }
    // const { key, aborter, testResourceRequired, getCancellablePromise } = qi;

    // this.abort(key);

    // if (testResourceRequired.ports === 0) {
    //   // this.jobs[key] = {
    //   //   aborter,
    //   //   cancellablePromise: getCancellablePromise({}).then(() => delete this.jobs[key])
    //   // }
    // }

    // if (testResourceRequired.ports > 0) {

    //   // clear any port-slots associated with this job
    //   Object.values(this.ports).forEach((jobMaybe, portNumber) => {
    //     if (jobMaybe && jobMaybe === key) {
    //       this.ports[portNumber] = OPEN_PORT;
    //     }
    //   });

    //   // find a list of open ports
    //   const foundOpenPorts = Object.keys(this.ports)
    //     .filter((p) => this.ports[p] === OPEN_PORT);

    //   // if there are enough open port-slots...
    //   if (foundOpenPorts.length >= testResourceRequired.ports) {

    //     const selectionOfPorts = foundOpenPorts.slice(0, testResourceRequired.ports);

    //     //  init the promise with ports which are open.
    //     // const testPromise = getCancellablePromise(selectionOfPorts)

    //     //   // when the promise is done...
    //     //   .then(() => {
    //     //     // clear any ports which were used
    //     //     Object.keys(this.ports)
    //     //       .forEach((p, k) => {
    //     //         const jobExistsAndMatches = this.ports[p] === key;
    //     //         if (jobExistsAndMatches) {
    //     //           this.ports[p] = OPEN_PORT;
    //     //         }
    //     //       });

    //     //     delete this.jobs[key]
    //     //   });

    //     // mark the selected ports as occupied
    //     for (const foundOpenPort of selectionOfPorts) {
    //       this.ports[foundOpenPort] = key;
    //     }

    //     // this.jobs[key] = {
    //     //   aborter,
    //     //   cancellablePromise: testPromise
    //     // };

    //   } else {
    //     console.log(`no port was open so send the ${key} job to the back of the queue`)
    //     this.queue.push(qi);
    //   }
    // }
  }

  // public launch() {

  //   pm2.connect(function (err) {
  //     if (err) {
  //       console.error(err)
  //       process.exit(2)
  //     }

  //     setInterval(async () => {
  //       console.log(this.spinner(), this.queue.length, this.ports);
  //       this.pop();
  //     }, TIMEOUT);
  //   })


  // }

  // public async testFileTouched(key, distFile, className) {
  //   // this.push([distFile, className], key);

  // }

  // public featureFileTouched(distFile) {
  //   this.setFeatures((fresh(distFile, require)['default']));
  // }

  // private async setFeatures(testerantoFeatures: TesterantoFeatures) {
  //   this.testerantoFeatures = testerantoFeatures;
  //   await fs.promises.mkdir(featureOutPath, { recursive: true });
  //   await fs.writeFile(
  //     `${featureOutPath}TesterantoFeatures.json`,
  //     JSON.stringify(testerantoFeatures.toObj(), null, 2),
  //     (err) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //     }
  //   );
  //   this.regenerateReports();
  // }

  // private dumpNetworks = () => {
  //   return {
  //     dags: this.dumpNetworksDags(),
  //     directed: this.testerantoFeatures.graphs.directed.map((g) => { return { name: g.name } }),
  //     undirected: this.testerantoFeatures.graphs.undirected.map((g) => { return { name: g.name } })
  //   }
  // }

  // private dumpNetworksDags = () => {
  //   return (this.testerantoFeatures.graphs.dags.map((network: IT_FeatureNetwork) => {
  //     const graph = network.graph;
  //     const topoSorted = topologicalSort(graph).reverse();
  //     {
  //       let i = 0;
  //       do {
  //         const me = topoSorted[i];
  //         const feature = this.featureTestJoin[me] || {};

  //         graph.setNodeAttribute(me, 'testResults',
  //           Object.keys(feature).reduce((mm, k) => {
  //             mm[k] = {
  //               name: feature[k].suite.name,
  //               fails: feature[k].suite.fails
  //             };
  //             return mm;
  //           }, {})
  //         );
  //         i = i + 1;
  //       } while (i < topoSorted.length)
  //     }

  //     {
  //       let i = 0;
  //       do {
  //         const me = topoSorted[i];

  //         const myTestResults = graph.getNodeAttribute(me, 'testResults');
  //         const anscestors = graph.inNeighbors(me);

  //         for (const anscestor of anscestors) {
  //           const anscestorResults = graph.getNodeAttribute(anscestor, 'testResults');
  //           graph.setNodeAttribute(anscestor, 'testResults', {
  //             ...anscestorResults,
  //             results: {
  //               ...anscestorResults.results,
  //               [me]: {
  //                 results: myTestResults,
  //                 report: graph.getNodeAttribute(anscestor, 'testResults')
  //               }
  //             }
  //           });
  //         }

  //         i = i + 1;
  //       } while (i < topoSorted.length)
  //     }

  //     const report = graph.getNodeAttribute(topoSorted[topoSorted.length - 1], 'testResults');
  //     const name = topoSorted[topoSorted.length - 1];

  //     return {
  //       dagReduction: {
  //         name,
  //         report
  //       },
  //       topoSorted,
  //       name: network.name
  //     }
  //   }));
  // }

  // private regenerateReports() {
  //   fs.writeFile(
  //     `${reportOutPath}.json`,
  //     JSON.stringify(this.dumpNetworks(), null, 2),
  //     (err) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //     }
  //   );
  // }



  // private startJob(testJob, key) {

  //   return async (allocatedTestResource) => await testJob.runner(allocatedTestResource)

  //   // eslint-disable-next-line no-async-promise-executor
  //   // return (allocatedTestResource) => cancelable(new Promise(async (resolve) => {
  //   //   const result = {
  //   //     test: testJob.test,
  //   //     status: await testJob.runner(allocatedTestResource)
  //   //   };

  //   //   await fs.promises.mkdir(testOutPath, { recursive: true });

  //   //   fs.writeFile(
  //   //     `${testOutPath}${key}.json`,
  //   //     JSON.stringify(testJob.test.toObj(), null, 2),

  //   //     (err) => {
  //   //       if (err) {
  //   //         console.error(err);
  //   //       }
  //   //       resolve(result)
  //   //     }
  //   //   );

  //   //   for (const [gNdx, g] of testJob.test.givens.entries()) {
  //   //     for (const testArtifactKey of Object.keys(g.testArtifacts)) {
  //   //       for (const [ndx, testArtifact] of g.testArtifacts[testArtifactKey].entries()) {
  //   //         const artifactOutFolderPath = `${testOutPath}${key}/${gNdx}/${ndx}/`
  //   //         const artifactOutPath = `${artifactOutFolderPath}/${testArtifactKey}.png`
  //   //         await fs.promises.mkdir(artifactOutFolderPath, { recursive: true });
  //   //         await fs.writeFile(
  //   //           artifactOutPath,
  //   //           testArtifact.binary,
  //   //           (err) => {
  //   //             if (err) {
  //   //               console.error(err);
  //   //             }
  //   //             resolve(result)
  //   //           }
  //   //         );
  //   //       }
  //   //     }
  //   //   }
  //   //   for await (const [gNdx, given] of result.test.givens.entries()) {
  //   //     for await (const givenFeature of given.features) {
  //   //       for await (const knownFeature of this.testerantoFeatures.features) {
  //   //         if (!this.featureTestJoin[givenFeature.name]) {
  //   //           this.featureTestJoin[givenFeature.name] = {};
  //   //         }
  //   //         if (givenFeature.name === knownFeature.name) {
  //   //           this.featureTestJoin[givenFeature.name][given.name] = {
  //   //             suite: result.test,
  //   //             whens: given.whens.map((w) => w.name),
  //   //             thens: given.thens.map((t) => t.name),
  //   //             errors: given.error,
  //   //           }
  //   //         } else {
  //   //           // delete this.featureTestJoin[givenFeature.name][given.name];
  //   //         }
  //   //       }
  //   //     }
  //   //   }

  //   //   fs.writeFile(
  //   //     `${testOutPath}featureTestJoin.json`,
  //   //     JSON.stringify(
  //   //       Object.keys(this.featureTestJoin).reduce((mm, featureKey) => {
  //   //         mm[featureKey] = Object.keys(this.featureTestJoin[featureKey]).map((testKey) => {
  //   //           const ranJob = this.featureTestJoin[featureKey][testKey];
  //   //           return {
  //   //             testKey: testKey,
  //   //             name: ranJob.suite.name,
  //   //             whens: ranJob.whens,
  //   //             thens: ranJob.thens,
  //   //             errors: ranJob.errors
  //   //           }
  //   //         });
  //   //         return mm;
  //   //       }, {})
  //   //       , null, 2),
  //   //     (err) => {
  //   //       if (err) {
  //   //         console.error(err);
  //   //       }
  //   //       resolve(result)
  //   //     }
  //   //   );
  //   //   this.regenerateReports();
  //   // }))
  // }

}


console.log("build.sh", process.cwd(), process.argv);
console.log(path.resolve(process.cwd(), process.argv[2]))

fs.readFile(
  // path.resolve(process.cwd(), process.argv[2]),
  "./testeranto.config.json",
  async (err, testerantoConfigImport) => {

    const testerantoConfig: {
      tests: [key: string, sourcefile: string, className: string][],
      features: any,
      loaders: any,
      ports: string[],
    } = JSON.parse(testerantoConfigImport.toString());

    console.log("testerantoConfig", testerantoConfig)

    const entryPoints = [
      testerantoConfig.features,
      ...testerantoConfig.tests.map(([key, sourcefile, className]) => {
        return sourcefile
      })
    ];

    console.log("entryPoints", entryPoints)

    let ctx = await esbuild.context({
      entryPoints,
      bundle: true,
      minify: false,
      format: "esm",
      platform: 'node',
      supported: { "dynamic-import": true },
      // target: ["esnext"],
      write: true,
      outdir: 'dist/tests',
      packages: 'external',
      plugins: [
        ...testerantoConfig.loaders || [],
        {
          name: 'import-path',
          setup(build) {
            build.onResolve({ filter: /^\.{1,2}\// }, args => {
              const importedPath = args.resolveDir + "/" + args.path;
              const absolutePath = path.resolve(importedPath);
              const absolutePath2 = path.resolve(testerantoConfig.features).split(".ts").slice(0, -1).join('.ts');
              if (absolutePath === absolutePath2) {
                return {
                  path: process.cwd() + "/dist/tests/testerantoFeatures.test.js",
                  external: true
                }
              } else {
                // if (absolutePath === process.cwd() + "/contracts") {
                //   return {
                //     path: path.resolve(importedPath), external: false
                //   }
                // }
              }
            })
          },
        },

      ],
      external: [
        testerantoConfig.features
      ]
    })

    await ctx.watch()

    // let { host, port } = await ctx.serve({
    //   servedir: 'dist',
    // })

    fs.promises.writeFile("./dist/testeranto.config.js", JSON.stringify(testerantoConfig));

    console.log("watch.ts tProject", testerantoConfig);
    const tProject = new TesterantoProject(testerantoConfig.tests, testerantoConfig.features, testerantoConfig.ports);
    new Scheduler(tProject);

  })


