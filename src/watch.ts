import pm2 from 'pm2';
import fs from "fs";
import path from "path";

console.log("watch.ts", process.cwd(), process.argv);

const configFile = `${process.cwd()}/${process.argv[2]}`;

console.log("watch.ts configFile", configFile);

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

class Scheduler {
  // featureTestJoin: Record<string, any>;
  // testerantoFeatures: TesterantoFeatures;
  project: TesterantoProject;

  ports: Record<string, string>;
  jobs: Record<string, {
    aborter: () => any;
    cancellablePromise: string;  //CancelablePromise<unknown>
  }>;
  queue: IPm2Process[];
  // testSrcMd5s: object;
  // featureSrcMd5: string;
  spinCycle = 0;
  spinAnimation = "←↖↑↗→↘↓↙";
  pm2: typeof pm2;

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
      console.log(`pm2 is connected`);
      this.pm2 = pm2;

      if (err) {
        console.error(err)
        process.exit(2)
      }

      const theTests = this.project.tests.reduce((m, [kn, fn, cn]) => {
        m[kn] = pm2.start({
          script: "./dist/" + fn.split(".ts")[0] + ".mjs",
          name: cn,
          autorestart: false,
          watch: true,
        }, (err, apps) => {
          if (err) {
            console.error(err);
            return pm2.disconnect();
          }
        });
        return m;
      }, {});

      pm2.launchBus((err, pm2_bus) => {
        console.log(`pm2 bus is launched`);

        pm2_bus.on('testeranto:hola', (packet: any) => {
          console.log("mark7", packet);
          console.log(`hola`, packet);
          this.push(packet);
        });

        pm2_bus.on('testeranto:adios', function (packet: IPm2Process) {
          console.log(`adios`, packet);
        });

      });

      setInterval(async () => {
        console.log(this.spinner(), this.queue.length, this.ports);
        this.pop();
      }, TIMEOUT);
    });

  }

  public async abort(pm2Proc: IPm2Process) {
    this.pm2.stop(pm2Proc.process.pm_id, (err, proc) => {
      console.error(err);
    });
    // if (this.jobs[key]) {
    //   console.log("aborting...", key, this.jobs[key])
    //   await this.jobs[key].aborter();
    //   // await this.jobs[key].cancellablePromise.cancel();
    //   delete this.jobs[key];
    // }
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
      console.log('feed me some tests plz')
      return;
    }
    // const { key, aborter, testResourceRequired, getCancellablePromise } = qi;

    // this.abort(p.process);
    const pid = p.process.pm_id;
    const testResource = p.data.testResource;

    console.log("mark4");
    const message = {
      // these fields must be present
      id: p.process.pm_id, // id of process from "pm2 list" command or from pm2.list(errback) method
      topic: 'some topic',
      // process:msg will be send as 'message' on target process
      type: 'process:msg',

      // Data to be sent
      data: {
        go: true,
        id: p.process.pm_id
      }
    };

    if (testResource?.ports === 0) {
      this.pm2.sendDataToProcessId(p.process.pm_id, message, function (err, res) {
        console.log("mark5", err, res, message);
      })

      // this.jobs[key] = {
      //   aborter,
      //   cancellablePromise: getCancellablePromise({}).then(() => delete this.jobs[key])
      // }
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


        this.pm2.sendDataToProcessId(p.process.pm_id, {
          // id of process from "pm2 list" command or from pm2.list(errback) method
          // id: 1,

          // process:msg will be send as 'message' on target process
          type: 'process:msg',

          // Data to be sent
          data: {
            goWithResources: selectionOfPorts
          },
          // id: 0, // id of process from "pm2 list" command or from pm2.list(errback) method
          // topic: 'some topic'
        }, function (err, res) {
        })

        //  init the promise with ports which are open.
        // const testPromise = getCancellablePromise(selectionOfPorts)

        //   // when the promise is done...
        //   .then(() => {
        //     // clear any ports which were used
        //     Object.keys(this.ports)
        //       .forEach((p, k) => {
        //         const jobExistsAndMatches = this.ports[p] === key;
        //         if (jobExistsAndMatches) {
        //           this.ports[p] = OPEN_PORT;
        //         }
        //       });

        //     delete this.jobs[key]
        //   });

        // mark the selected ports as occupied
        for (const foundOpenPort of selectionOfPorts) {
          this.ports[foundOpenPort] = pid.toString();
        }

        // this.jobs[key] = {
        //   aborter,
        //   cancellablePromise: testPromise
        // };

      } else {
        console.log(`no port was open so send the ${pid} job to the back of the queue`)
        this.queue.push(p);
      }
    }
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

import(configFile).then((testerantoConfigImport) => {
  const configModule = testerantoConfigImport.default;

  console.log("build.ts tProject", configModule);
  const tProject = new TesterantoProject(configModule.tests, configModule.features, configModule.ports)
  console.log("build.ts tProject", tProject);

  const TRM = new Scheduler(tProject);

  // (async function () {
  //   for await (const [ndx, [key, sourcefile, className]] of tProject.tests.entries()) {
  //     const distFile = process.cwd() + "/dist/" + sourcefile.split(".ts")[0] + ".js";
  //     // const md5File = process.cwd() + "/dist/" + sourcefile.split(".ts")[0] + ".md5";

  //     // fs.readFile(md5File, 'utf-8', (err, firstmd5hash) => {
  //     //   TRM.testFileTouched(key, distFile, className, firstmd5hash);

  //     watchFile(distFile, () => {
  //       TRM.testFileTouched(key, distFile, className);

  //       // fs.readFile(distFile, 'utf-8', (err, newmd5Hash) => {
  //       //   if (err) {
  //       //     console.error(err)
  //       //     process.exit(-1)
  //       //   }

  //       //   TRM.testFileTouched(key, distFile, className);
  //       // })
  //     });
  //     // });

  //     TRM.testFileTouched(key, distFile, className);

  //   }

  //   ///////////////////////////////////////////////////////////////////////////////////////

  //   const featureFile = tProject.features;
  //   const distFile = process.cwd() + "/dist/" + featureFile.split(".ts")[0] + ".js";
  //   // const md5File = process.cwd() + "/dist/" + featureFile.split(".ts")[0] + ".md5";

  //   TRM.featureFileTouched(distFile);
  //   // fs.readFile(featureFile, 'utf-8', (err, featuresFileContents) => {
  //   //   TRM.featureFileTouched(distFile);

  //   watchFile(distFile, () => {
  //     TRM.featureFileTouched(distFile);
  //     // fs.readFile(distFile, 'utf-8', (err, newContents) => {
  //     //   if (err) {
  //     //     console.error(err)
  //     //     process.exit(-1)
  //     //   }

  //     //   TRM.featureFileTouched(distFile);
  //     // })
  //   });

  //   //   // TRM.featureFileTouched(distFile);
  //   // });



  //   TRM.launch();

  // })();

})
