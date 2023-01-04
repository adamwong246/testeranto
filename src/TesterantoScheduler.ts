import CancelablePromise, { cancelable } from 'cancelable-promise';
import fs from "fs";
import fresh from 'fresh-require';
import { topologicalSort } from 'graphology-dag/topological-sort';

import { TesterantoFeatures } from './Features';
import { ITestJob, IT_FeatureNetwork } from './testShapes';

const TIMEOUT = 500;
const OPEN_PORT = '';
const testOutPath = "./dist/results/";
const featureOutPath = "./dist/";
const reportOutPath = "./dist/report";

export class TesterantoScheduler {
  featureTestJoin: Record<string, any>;
  testerantoFeatures: TesterantoFeatures;

  ports: Record<string, string>;
  jobs: Record<string, {
    aborter: () => any;
    cancellablePromise: CancelablePromise<unknown>
  }>;
  queue: {
    key: string,
    aborter: () => any;
    getCancellablePromise: (testResource) => CancelablePromise<unknown>,
    testResourceRequired: "na" | "port"
  }[];
  testSrcMd5s: object;
  featureSrcMd5: string;
  spinCycle = 0;
  spinAnimation = "←↖↑↗→↘↓↙";

  constructor(portsToUse: string[]) {
    this.ports = {};
    portsToUse.forEach((port) => {
      this.ports[port] = OPEN_PORT;
    });
    this.queue = [];
    this.jobs = {};
    this.testSrcMd5s = {};
    this.featureTestJoin = {};
  }

  public async abort(key) {
    if (this.jobs[key]) {
      console.log("aborting...", key, this.jobs[key])
      await this.jobs[key].aborter();
      await this.jobs[key].cancellablePromise.cancel();
      delete this.jobs[key];
    }
  }

  public launch() {
    setInterval(async () => {
      console.log(this.spinner(), this.queue.length, this.ports);
      const qi = this.queue.pop();
      if (!qi) {
        console.log('feed me some tests plz')
        return;
      }
      const { key, aborter, testResourceRequired, getCancellablePromise } = qi;

      this.abort(key);

      if (testResourceRequired === "na") {
        this.jobs[key] = {
          aborter,
          cancellablePromise: getCancellablePromise({}).then(() => delete this.jobs[key])
        }
      }

      if (testResourceRequired === "port") {
        Object.values(this.ports).forEach((jobMaybe, portNumber) => {
          if (jobMaybe && jobMaybe === key) {
            this.ports[portNumber] = OPEN_PORT;
          }
        });

        const foundOpenPort = Object.keys(this.ports).find((p) => this.ports[p] === OPEN_PORT);

        if (foundOpenPort) {
          const testPromise = getCancellablePromise({ port: foundOpenPort }).then(() => {
            Object.keys(this.ports).forEach((p, k) => {
              const jobExistsAndMatches = this.ports[p] === key;
              if (jobExistsAndMatches) {
                this.ports[p] = OPEN_PORT;
              }
            });

            delete this.jobs[key]
          });
          this.ports[foundOpenPort] = key;
          this.jobs[key] = {
            aborter,
            cancellablePromise: testPromise
          };
        } else {
          console.log(`no port was open so send the ${key} job to the back of the queue`)
          this.queue.push(qi);
        }
      }
    }, TIMEOUT);
  }

  public testFileTouched(key, distFile, className, hash) {
    if (hash !== this.testSrcMd5s[key]) {
      console.log("running", key);
      this.testSrcMd5s[key] = hash;
      this.addTest(new (fresh(distFile, require)[className])()[0], key);
    }
  }

  public featureFileTouched(distFile, hash) {
    if (hash !== this.featureSrcMd5) {
      console.log("running featureSrcMd5");
      this.featureSrcMd5 = hash;
      this.setFeatures((fresh(distFile, require)['default']));
    } else {
      console.log("feature file changed byt md5 hash did not")
    }
  }

  private async setFeatures(testerantoFeatures: TesterantoFeatures) {
    console.log("testerantoFeatures", testerantoFeatures.networks);
    this.testerantoFeatures = testerantoFeatures;
    await fs.promises.mkdir(featureOutPath, { recursive: true });

    await fs.writeFile(
      `${featureOutPath}TesterantoFeatures.json`,
      JSON.stringify(testerantoFeatures.toObj(), null, 2),
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );

    this.regenerateReports();
  }

  private async addTest(testJob: ITestJob, key) {
    // eslint-disable-next-line no-async-promise-executor
    const cancellablePromise = (allocatedTestResource) => cancelable(new Promise(async (resolve) => {
      const result = {
        test: testJob.test,
        status: await testJob.runner(allocatedTestResource)
      };

      await fs.promises.mkdir(testOutPath, { recursive: true });

      fs.writeFile(
        `${testOutPath}${key}.json`,
        JSON.stringify(testJob.test.toObj(), null, 2),

        (err) => {
          if (err) {
            console.error(err);
          }
          resolve(result)
        }
      );

      // let i = 0;
      for (const [gNdx, g] of testJob.test.givens.entries()) {
        for (const testArtifactKey of Object.keys(g.testArtifacts)) {
          for (const [ndx, testArtifact] of g.testArtifacts[testArtifactKey].entries()) {
            const artifactOutFolderPath = `${testOutPath}${key}/${gNdx}/${ndx}/`
            const artifactOutPath = `${artifactOutFolderPath}/${testArtifactKey}.png`
            await fs.promises.mkdir(artifactOutFolderPath, { recursive: true });
            await fs.writeFile(
              artifactOutPath,
              testArtifact.binary,
              (err) => {
                if (err) {
                  console.error(err);
                }
                resolve(result)
              }
            );

            // i = i + 1;

          }
        }

      }



      for await (const [gNdx, given] of result.test.givens.entries()) {
        for await (const givenFeature of given.features) {
          for await (const knownFeature of this.testerantoFeatures.features) {

            if (!this.featureTestJoin[givenFeature.name]) {
              this.featureTestJoin[givenFeature.name] = {};
            }

            if (givenFeature.name === knownFeature.name) {
              this.featureTestJoin[givenFeature.name][given.name] = {
                suite: result.test,
                whens: given.whens.map((w) => w.name),
                thens: given.thens.map((t) => t.name),
                errors: given.error,
              }
            } else {
              // delete this.featureTestJoin[givenFeature.name][given.name];
            }
          }
        }
      }

      fs.writeFile(
        `${testOutPath}featureTestJoin.json`,
        JSON.stringify(
          Object.keys(this.featureTestJoin).reduce((mm, featureKey) => {
            mm[featureKey] = Object.keys(this.featureTestJoin[featureKey]).map((testKey) => {
              const ranJob = this.featureTestJoin[featureKey][testKey];
              return {
                testKey: testKey,
                name: ranJob.suite.name,
                whens: ranJob.whens,
                thens: ranJob.thens,
                errors: ranJob.errors
              }
            });
            return mm;
          }, {})
          , null, 2),
        (err) => {
          if (err) {
            console.error(err);
          }
          resolve(result)
        }
      );

      this.regenerateReports();
    }))

    this.queue.push({
      key,
      aborter: testJob.test.aborter,
      getCancellablePromise: cancellablePromise,
      testResourceRequired: testJob.testResource
    });
  }

  private regenerateReports() {
    fs.writeFile(
      `${reportOutPath}.json`,
      JSON.stringify((this.testerantoFeatures.networks.map((network: IT_FeatureNetwork) => {
        const graph = network.graph;
        const topoSorted = topologicalSort(graph).reverse();

        {
          let i = 0;
          do {
            const me = topoSorted[i];
            const feature = this.featureTestJoin[me] || {};

            graph.setNodeAttribute(me, 'testResults',
              Object.keys(feature).reduce((mm, k) => {
                mm[k] = {
                  name: feature[k].suite.name,
                  fails: feature[k].suite.fails
                };
                return mm;
              }, {})
            );
            i = i + 1;
          } while (i < topoSorted.length)
        }

        {
          let i = 0;
          do {
            const me = topoSorted[i];

            const myTestResults = graph.getNodeAttribute(me, 'testResults');
            const anscestors = graph.inNeighbors(me);

            for (const anscestor of anscestors) {
              const anscestorResults = graph.getNodeAttribute(anscestor, 'testResults');
              graph.setNodeAttribute(anscestor, 'testResults', {
                ...anscestorResults,
                results: {
                  ...anscestorResults.results,
                  [me]: {
                    results: myTestResults,
                    report: graph.getNodeAttribute(anscestor, 'testResults')
                  }
                }
              });
            }

            // if (anscestors.length === 1) {
            //   const anscestor = anscestors[0];              
            // } else if (anscestors.length === 0) {
            //   // no-op
            // } else {
            //   throw "topological sort fail"
            // }
            i = i + 1;
          } while (i < topoSorted.length)
        }

        const report = graph.getNodeAttribute(topoSorted[topoSorted.length - 1], 'testResults');
        const name = topoSorted[topoSorted.length - 1];

        return {
          dagReduction: {
            name,
            report
          },
          topoSorted,
          name: network.name
        }
      })), null, 2),

      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  }

  private spinner() {
    this.spinCycle = (this.spinCycle + 1) % this.spinAnimation.length;
    return this.spinAnimation[this.spinCycle]
  }
}