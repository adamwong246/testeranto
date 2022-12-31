import fs from "fs";
import { watchFile } from 'node:fs';
import testerantoConfig from "../testeranto.config";
import { TestResourceManager } from "./TestResourceManager";

const TRM = new TestResourceManager(['3001', '3002']);

(async function () {
  for await (const [ndx, [key, sourcefile, className]] of testerantoConfig.tests.entries()) {
    const distFile = "../dist/" + sourcefile.split(".ts")[0] + ".js";
    const md5File = "./dist/" + sourcefile.split(".ts")[0] + ".md5";

    fs.readFile(md5File, 'utf-8', (err, firstmd5hash) => {
      TRM.changed(key, distFile, className, firstmd5hash);

      watchFile(md5File, () => {
        fs.readFile(md5File, 'utf-8', (err, newmd5Hash) => {
          if (err) {
            console.error(err)
            process.exit(-1)
          }

          TRM.changed(key, distFile, className, newmd5Hash);
        })
      });
    });
  }

  TRM.launch();

})();
