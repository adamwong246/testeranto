import fs from "fs";
import fresh from 'fresh-require';
import { watchFile } from 'node:fs';
import { cancelable } from 'cancelable-promise';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testerantoConfig = require("../testeranto.config");

const outPath = "./dist/results/";

const jobs = {};
const md5s = {};

const changed = async (key, suite) => {
  console.log("running", key)
  
  if (jobs[key]) {
    console.log("aborting...", key)
    await jobs[key].aborter();
    await jobs[key].cancellablePromise.cancel();
  } 

  let aborter;
  // eslint-disable-next-line no-async-promise-executor
  const cancellablePromise = cancelable(new Promise(async (resolve) => {
    fs.promises.mkdir(outPath, { recursive: true });

    aborter = () => suite.test.aborter();

    let result = {};
    if (suite.testResource === 'port') {
      result = {
        test: suite.test,
        status: await suite.runner({ port: 3001 })
      }
    } else {
      result = {
        test: suite.test,
        status: await suite.runner({})
      }
    }

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

  jobs[key] = {
    aborter, cancellablePromise
  }

};

testerantoConfig.forEach( ([key, sourcefile, className]) => {
  
  const distFile = "../dist/" + sourcefile.split(".ts")[0] + ".js";
  const md5File = "./dist/" + sourcefile.split(".ts")[0] + ".md5";
  
  fs.readFile(md5File, 'utf-8', (err, firstmd5hash) => {
    md5s[key] = firstmd5hash;

    changed(key, new (fresh(distFile, require)[className])()[0]);

    watchFile(md5File, (curr, prev) => {
      fs.readFile(md5File, 'utf-8', (err, newmd5Hash) => {
        if (err) {
          console.error(err)
          process.exit(-1)
        }
        if (newmd5Hash !== md5s[key]) {
          console.log("changed: ", md5File, newmd5Hash)
          md5s[key] = newmd5Hash;
          changed(key, new (fresh(distFile, require)[className])()[0]);
        }
      })
    });
  });
});
