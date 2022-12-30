import fs from "fs";
import fresh from 'fresh-require';
import { watchFile } from 'node:fs';
import CancelablePromise, { cancelable } from 'cancelable-promise';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testerantoConfig = require("../testeranto.config");

const outPath = "./dist/results/";

type IQueudJob = {
  key: string,
  aborter: () => any;
  getCancellablePromise: (testResource) => CancelablePromise<unknown>,
  testResourceRequired: "na" | "port"
};

type IRunningJob = {
  aborter: () => any;
  cancellablePromise: CancelablePromise<unknown>
};

class TestResourceManager {
  allocatedPorts: Record<string, boolean>;
  ports: Record<string, string>;
  jobs: Record<string, IRunningJob>;
  queue: IQueudJob[];
  

  constructor(portsToUse: string[]) {
    this.ports = {};
    this.allocatedPorts = portsToUse.reduce((mm, lm) => {
      this.ports[lm] = '';
      return mm[lm] = false
    }, {});
    this.queue = [];
    this.jobs = {};

  }

  launch() {
    setInterval(async () => {
      console.log(".", this.queue.length, this.ports)
      const qi = this.queue.pop();

      if (qi?.testResourceRequired === "na") {
        const key = qi.key;
        if (this.jobs[key]) {
          console.log("aborting...", key, this.jobs[key])
          await this.jobs[key].aborter();
          await this.jobs[key].cancellablePromise.cancel();
          delete this.jobs[key]
        }
        this.jobs[key] = {
          aborter: qi.aborter,
          cancellablePromise: qi.getCancellablePromise({}).then(() => delete this.jobs[key])
        }
      }

      if (qi?.testResourceRequired === "port") {
        const key = qi.key;

        if (this.jobs[key]) {
          console.log("aborting...", key, this.jobs[key])
          await this.jobs[key].aborter();
          await this.jobs[key].cancellablePromise.cancel();

          Object.values(this.ports).forEach((jobMaybe, portNumber) => {
            if ( jobMaybe && jobMaybe === key) {
              this.ports[portNumber] = '';
            }
          });

          delete this.jobs[key];

        }

        const foundOpenPort = Object.keys(this.ports).find((p, k) => {
          return this.ports[p] === ''
        });

        if (foundOpenPort) {
          const testPromise = qi.getCancellablePromise({ port: foundOpenPort }).then(() => {
            Object.keys(this.ports).forEach((p, k) => {
              const jobExistsAndMatches = this.ports[p] === key;
              if (jobExistsAndMatches) {
                this.ports[p] = '';
              }
            });

            delete this.jobs[key]
          });

          this.ports[foundOpenPort] = key;
          this.jobs[key] = {
            aborter: qi.aborter,
            cancellablePromise: testPromise
          };
          
        } else {
          console.log(`no port was open so send the ${qi.key} job to the back of the queue`)
          this.queue.push(qi);
        }
      }

    }, 100)
  }

  async add(suite, key) {

    // eslint-disable-next-line no-async-promise-executor
    const cancellablePromise = (allocatedTestResource) => cancelable(new Promise(async (resolve) => {
      const result = {
        test: suite.test,
        status: await suite.runner(allocatedTestResource)
      };

      await fs.promises.mkdir(outPath, { recursive: true });
      
      fs.writeFile(
        `${outPath}${key}.json`,
        JSON.stringify(result, null, 2),
        (err) => {
          if (err) {
            console.error(err);
          }
          resolve(result)
        }
      );
    }));

    this.queue.push({
      key,
      aborter: suite.test.aborter,
      getCancellablePromise: cancellablePromise,
      testResourceRequired: suite.testResource
    });
  }
}

const TRM = new TestResourceManager(['3001']);

const changed = async (key, distFile, className) => {
  console.log("running", key)
  TRM.add(new (fresh(distFile, require)[className])()[0], key);
};

const md5s = {};

(async function () {
  for await (const [ndx, [key, sourcefile, className]] of testerantoConfig.entries()) {
    const distFile = "../dist/" + sourcefile.split(".ts")[0] + ".js";
    const md5File = "./dist/" + sourcefile.split(".ts")[0] + ".md5";

    fs.readFile(md5File, 'utf-8', (err, firstmd5hash) => {
      md5s[key] = firstmd5hash;

      changed(key, distFile, className);

      watchFile(md5File, (curr, prev) => {
        fs.readFile(md5File, 'utf-8', (err, newmd5Hash) => {
          if (err) {
            console.error(err)
            process.exit(-1)
          }
          if (newmd5Hash !== md5s[key]) {
            console.log("changed: ", md5File, newmd5Hash)
            md5s[key] = newmd5Hash;
            changed(key, distFile, className);
          }
        })
      });
    });
  }

  TRM.launch();

})();
