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
  ports: Record<number, boolean>;
  jobs: Record<string, IRunningJob>;
  queue: IQueudJob[];

  constructor(portsToUse: number[]) {
    this.ports = portsToUse.reduce((mm, lm) => {
      return mm[lm] = false
    }, {});
    this.queue = [];
    this.jobs = {};
  }

  launch() {
    setInterval(async () => {
      console.log("feed me tests plz!")
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
          cancellablePromise: qi.getCancellablePromise({}).then(() => delete this.jobs[key] )
        }
      }
    }, 1000)
  }

  async add(suite, key) {

    const cancellablePromise = (allocatedTestResource) => cancelable(new Promise((resolve) => {
      const result = {
        test: suite.test,
        status: suite.runner(allocatedTestResource)
      };
      
      fs.promises.mkdir(outPath, { recursive: true });
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

const TRM = new TestResourceManager([3001]);

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
