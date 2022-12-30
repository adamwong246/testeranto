import fs from "fs";
import fresh from 'fresh-require';
import { watchFile } from 'node:fs';
import { cancelable } from 'cancelable-promise';

const outPath = "./dist/results/";

const jobs = {};

const changed = (key, suite) => {
  console.log(key)
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

[
  ['Rectangle', './dist/tests/Rectangle/Rectangle.test.js', 'RectangleTesteranto'],
  ['Redux', './dist/tests/Redux+Reselect+React/app.redux.test.js', 'AppReduxTesteranto']
].forEach(([key, sourcefile, className]) => {
  
  changed(key, new (fresh(sourcefile, require)[className])()[0])
  
  watchFile(sourcefile, async (curr, prev) => {
    changed(key, new (fresh(sourcefile, require)[className])()[0])
  });
})
