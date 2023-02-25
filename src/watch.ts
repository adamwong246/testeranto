import pm2 from 'pm2';
import fs from "fs";
import path from "path";

import { TesterantoFeatures } from './index.mjs';

console.log("watch.ts", process.cwd(), process.argv);

const configFile = `${process.cwd()}/${process.argv[2]}`;

console.log("watch.ts configFile", configFile);

const TIMEOUT = 1000;
const OPEN_PORT = '';
const testOutPath = "./dist/results/";
const featureOutPath = "./dist/";
const reportOutPath = "./dist/report/";

class TesterantoProject {
  tests: [keyName: string, fileName: string, className: string][];
  features: string;
  ports: string[];

  constructor(tests, features, ports) {
    this.tests = tests;
    this.features = features;
    this.ports = ports
  }

  // builder() {
  //   const text = JSON.stringify({ tests: this.tests, features: this.features });
  //   const p = "./dist/testeranto.config.json";
  //   fs.promises.mkdir(path.dirname(p), { recursive: true }).then(x => {
  //     fs.promises.writeFile(p, text);
  //   })
  // }

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
  // featureTestJoin: Record<string, any>;
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

    pm2.connect((err) => {
      console.log(`pm2 is connected`);
      this.pm2 = pm2;

      if (err) {
        console.error(err)
        process.exit(2)
      }

      const theTests = this.project.tests.reduce((m, [kn, fn, cn]) => {
        const script = "./dist/" + fn.split(".ts")[0] + ".mjs";
        m[kn] = pm2.start({
          script,
          name: cn,
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
          console.log("hola", packet);
          this.push(packet);
        });

        pm2_bus.on('testeranto:adios', (packet: IPm2ProcessB) => {
          console.log("adios", packet);
          this.releaseTestResources(packet);
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
      console.log("mark2", message)
      this.pm2.sendDataToProcessId(p.process.pm_id, message, function (err, res) {
        console.log("sendDataToProcessId", err, res, message);
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
    console.log("releasing test resources", pm2Proc.data.testResource, this.ports);
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

        fs.writeFile(
          `${testOutPath}${pm2Proc.process.name}.json`,
          JSON.stringify(pm2Proc.data.results, null, 2),
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );

        const testJob = { test: pm2Proc.data.results };



        for (const [gNdx, g] of testJob.test.givens.entries()) {
          for (const testArtifactKey of Object.keys(g.testArtifacts)) {
            for (const [ndx, testArtifact] of g.testArtifacts[testArtifactKey].entries()) {
              const artifactOutFolderPath = `${testOutPath}${pm2Proc.process.name}/${gNdx}/${ndx}/`;

              // console.log("mark4", artifactOutFolderPath);
              console.log("mark5", testArtifact);

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

import(configFile).then((testerantoConfigImport) => {
  const configModule = testerantoConfigImport.default;
  const tProject = new TesterantoProject(configModule.tests, configModule.features, configModule.ports)

  import(path.resolve(process.cwd(), tProject.features)).then((testerantoFeaturesImport) => {
    const tFeatures = testerantoFeaturesImport.default as TesterantoFeatures;
    const TRM = new Scheduler(tProject, tFeatures);
  });

});

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