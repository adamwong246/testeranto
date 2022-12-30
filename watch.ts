import fs from "fs";
import fresh from 'fresh-require';
import { watchFile } from 'node:fs';
import { cancelable } from 'cancelable-promise';

const outPath = "./dist/results/";

const jobs = {};

const changed = (key, suite) => {
  if (jobs[key]) {
    jobs[key].cancel
  } 
  // eslint-disable-next-line no-async-promise-executor
  jobs[key] = cancelable(new Promise(async (resolve) => {    

    // return suite.runner({}).then(() => {
    //   console.log("mark0", result);
    //   // fs.writeFile(
    //   //   "./dist/testerantoResults.txt",
    //   //   JSON.stringify(result.toString(), null, 2),
    //   //   (err) => {
    //   //     if (err) {
    //   //       console.error(err);
    //   //       process.exit(-1)
    //   //     }
    //   //     // process.exit(0)
    //   //     resolve(result)
    //   //   }
    //   // );
    // })

    
    let result = {};
    
    fs.promises.mkdir(outPath, { recursive: true }) 

    try {
      console.log("mark0")
      await suite.runner({});
      console.log("mark1", suite.test)

      result = {
        test: suite.test,
        status: "pass",
      }
    } catch(e) {
      console.error(e)
      result = {
        test: suite.test,
        status: "fail",
      }
      
    } finally {
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
    }
  }));
  
};

[
  ['Rectangle', './dist/tests/Rectangle/Rectangle.test.js', 'RectangleTesteranto'],
  ['Redux', './dist/tests/Redux+Reselect+React/app.redux.test.js', 'AppReduxTesteranto']
].forEach(([key, sourcefile, className]) => {

  const X = fresh(sourcefile, require)[className];
  console.log("X", X)
  changed(
    key, new X()[0]
  )

  watchFile(sourcefile, async (curr, prev) => {
    const X = fresh(sourcefile, require)[className];
    changed(
      key, new X()[0]
    )
  });
})
