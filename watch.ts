import fs from "fs";
import fresh from 'fresh-require';
import { watchFile } from 'node:fs';
import { cancelable } from 'cancelable-promise';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testerantoConfig = require("./testeranto.config");

const outPath = "./dist/results/";

const jobs = {};
const md5s = {};

const changed = (key, suite) => {
  console.log("running", key)
  if (jobs[key]) {
    jobs[key].cancel
  } 
  // eslint-disable-next-line no-async-promise-executor
  jobs[key] = cancelable(new Promise(async (resolve) => {
    fs.promises.mkdir(outPath, { recursive: true }) 
    const result = {
      test: suite.test,
      status: await suite.runner({})
    }

    fs.writeFile(
      `${outPath}${key}.json`,
      JSON.stringify(result, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          process.exit(-1)
        }
        resolve(result)
      }
    );
  }));
  
};

testerantoConfig.forEach(async ([key, sourcefile, className]) => {
  
  const distFile = "./dist/" + sourcefile.split(".ts")[0] + ".js";
  const md5File = "./dist/" + sourcefile.split(".ts")[0] + ".md5";
  
  fs.readFile(md5File, 'utf-8', (err, firstmd5hash) => {
    md5s[key] = firstmd5hash;

    changed(key, new (fresh(distFile, require)[className])()[0]);

    watchFile(md5File, async (curr, prev) => {
      fs.readFile(md5File, 'utf-8', (err, newmd5Hash) => {
        if (newmd5Hash !== md5s[key]) {
          md5s[key] = newmd5Hash;
          changed(key, new (fresh(distFile, require)[className])()[0]);
        }
      })
    });
  });
});
