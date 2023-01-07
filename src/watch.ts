import fs from "fs";
import { watchFile } from 'node:fs';
import testerantoConfig from "../testeranto.config";
import { Scheduler } from "./lib/Scheduler";

const TRM = new Scheduler(testerantoConfig.ports);

(async function () {
  for await (const [ndx, [key, sourcefile, className]] of testerantoConfig.tests.entries()) {
    const distFile = "../dist/" + sourcefile.split(".ts")[0] + ".js";
    const md5File = "./dist/" + sourcefile.split(".ts")[0] + ".md5";

    fs.readFile(md5File, 'utf-8', (err, firstmd5hash) => {
      TRM.testFileTouched(key, distFile, className, firstmd5hash);

      watchFile(md5File, () => {
        fs.readFile(md5File, 'utf-8', (err, newmd5Hash) => {
          if (err) {
            console.error(err)
            process.exit(-1)
          }

          TRM.testFileTouched(key, distFile, className, newmd5Hash);
        })
      });
    });
  }

  const featureFile = testerantoConfig.features;
  const distFile = "../dist/" + featureFile.split(".ts")[0] + ".js";
  const md5File = "./dist/" + featureFile.split(".ts")[0] + ".md5";

  fs.readFile(featureFile, 'utf-8', (err, featuresFileContents) => {
    TRM.featureFileTouched(distFile, featuresFileContents);

    watchFile(md5File, () => {
      fs.readFile(md5File, 'utf-8', (err, newmd5Hash) => {
        if (err) {
          console.error(err)
          process.exit(-1)
        }

        TRM.featureFileTouched(distFile, newmd5Hash);
      })
    });
  });



  TRM.launch();

})();
