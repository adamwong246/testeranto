import path from "path";
import { Server } from "./server/serverClasees/Server";
import { IBuiltConfig, IRunTime, ITestconfig } from "./Types";

if (!process.argv[2]) {
  console.error(`The 2nd argument should be a testeranto config file name.`);
  process.exit(-1);
}

const configFilepath = process.argv[2];

const testsName = path
  .basename(configFilepath)
  .split(".")
  .slice(0, -1)
  .join(".");

const mode = process.argv[3] as "once" | "dev";
if (mode !== "once" && mode !== "dev") {
  console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
  process.exit(-1);
}

import(`${process.cwd()}/${configFilepath}`).then(async (module) => {
  const bigConfig: ITestconfig = module.default;

  const config: IBuiltConfig = {
    ...bigConfig,
    buildDir: process.cwd() + "/testeranto/bundles/" + testsName,
  };

  await new Server(config, testsName, mode).start();
});
