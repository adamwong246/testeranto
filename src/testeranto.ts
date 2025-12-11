import ansiC from "ansi-colors";
import fs from "fs";
import path from "path";
import readline from "readline";
// import { GolingvuBuild } from "./clients/golingvuBuild";
// import { PitonoBuild } from "./clients/pitonoBuild";
// import { AppHtml } from "./clients/utils/buildTemplates";
import { setupFileSystem } from "./server/serverClasees/utils/fileSystemSetup";
import { setupKeypressHandling } from "./server/keypressHandler";
import { Server } from "./server/serverClasees/Server";
import { getRunnables } from "./server/utils";
import { IBuiltConfig, IRunTime, ITestconfig } from "./Types";
import { makeHtmlTestFiles } from "./makeHtmlTestFiles";
import { makeHtmlReportFile } from "./makeHtmlReportFile";

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

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

  console.log(ansiC.inverse("Press 'q' to initiate a graceful shutdown."));
  console.log(ansiC.inverse("Press 'x' to quit forcefully."));

  setupKeypressHandling();
  setupFileSystem(config, testsName);

  let pm: Server | null = null;

  pm = new Server(config, testsName, mode);
  await pm.start();

  if (!fs.existsSync(`testeranto/reports/${testsName}`)) {
    fs.mkdirSync(`testeranto/reports/${testsName}`);
  }
  fs.writeFileSync(
    `testeranto/reports/${testsName}/config.json`,
    JSON.stringify(config, null, 2)
  );

  makeHtmlTestFiles(testsName);
  makeHtmlReportFile(testsName, config);

  const {
    nodeEntryPoints,
    // nodeEntryPointSidecars,
    webEntryPoints,
    // webEntryPointSidecars,
    // pureEntryPoints,
    // pureEntryPointSidecars,
    pythonEntryPoints,
    // pythonEntryPointSidecars,
    golangEntryPoints,
    // golangEntryPointSidecars,
  } = getRunnables(config, testsName);

  // Handle golang tests using GolingvuBuild
  // const golangTests = config.tests.filter((test) => test[1] === "golang");
  // const golangTests = config.golang.map((_, testName) => [
  // const hasGolangTests = Object.keys(config.golang).length > 0;
  // if (hasGolangTests) {
  //   const golingvuBuild = new GolingvuBuild(config, testsName);
  //   const golangEntryPoints = await golingvuBuild.build();
  //   golingvuBuild.onBundleChange(() => {
  //     Object.keys(golangEntryPoints).forEach((entryPoint) => {
  //       if (pm) {
  //         pm.addToQueue(entryPoint, "golang");
  //       }
  //     });
  //   });
  // }

  // // Handle pitono (Python) tests by generating their metafiles
  // // const pitonoTests = config.tests.filter((test) => test[1] === "python");
  // const hasPitonoTests = Object.keys(config.python).length > 0;
  // if (hasPitonoTests) {
  //   const pitonoBuild = new PitonoBuild(config, testsName);
  //   const pitonoEntryPoints = await pitonoBuild.build();
  //   pitonoBuild.onBundleChange(() => {
  //     Object.keys(pitonoEntryPoints).forEach((entryPoint) => {
  //       if (pm) {
  //         pm.addToQueue(entryPoint, "python");
  //       }
  //     });
  //   });
  // }

  // create the necessary folders for all tests
  [
    ["node", Object.keys(nodeEntryPoints)],
    ["web", Object.keys(webEntryPoints)],
    ["python", Object.keys(pythonEntryPoints)],
    ["golang", Object.keys(golangEntryPoints)],
  ].forEach(async ([runtime, keys]: [IRunTime, string[]]) => {
    keys.forEach(async (k) => {
      fs.mkdirSync(
        `testeranto/reports/${testsName}/${k
          .split(".")
          .slice(0, -1)
          .join(".")}/${runtime}`,
        { recursive: true }
      );
    });
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
      console.log("Testeranto is shutting down gracefully...");
      if (pm) {
        pm.stop();
      } else {
        process.exit();
      }
    }
  });
});
