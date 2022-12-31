import CancelablePromise, { cancelable } from 'cancelable-promise';
import fs from "fs";
import fresh from 'fresh-require';

const outPath = "./dist/results/";

export class TestResourceManager {
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
  md5s: object;
  
  spinCycle = 0;
  spinAnimation = "←↖↑↗→↘↓↙";
  
  constructor(portsToUse: string[]) {
    this.ports = {};
    portsToUse.forEach((port) => {
      this.ports[port] = '';
    });
    this.queue = [];
    this.jobs = {};
    this.md5s = {};
  }

  spinner() {
    this.spinCycle = this.spinCycle + 1;
    if (this.spinCycle === this.spinAnimation.length) {
      this.spinCycle = 0;
    }
    return this.spinAnimation[this.spinCycle]
  }

  changed (key, distFile, className, hash) {
    if (hash !== this.md5s[key]) {
      console.log("running", key);
      this.md5s[key] = hash;
      this.add(new (fresh(distFile, require)[className])()[0], key);
    }
  }

  async abort(key) {
    if (this.jobs[key]) {
      console.log("aborting...", key, this.jobs[key])
      await this.jobs[key].aborter();
      await this.jobs[key].cancellablePromise.cancel();
      delete this.jobs[key];
    }
  }

  launch() {
    setInterval(async () => {
      console.log(this.spinner(), this.queue.length, this.ports)
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
            this.ports[portNumber] = '';
          }
        });

        const foundOpenPort = Object.keys(this.ports).find((p) => this.ports[p] === '');

        if (foundOpenPort) {
          const testPromise = getCancellablePromise({ port: foundOpenPort }).then(() => {
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
            aborter,
            cancellablePromise: testPromise
          };   
        } else {
          console.log(`no port was open so send the ${key} job to the back of the queue`)
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