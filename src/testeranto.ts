import ansiC from "ansi-colors";
import fs from "fs";
import path from "path";
import readline from "readline";
// import { Server } from "./server/Server";
import { getRunnables } from "./server/utils";
import { PitonoBuild } from "./clients/pitonoBuild";
import { IBuiltConfig, IRunTime, ITestconfig } from "./Types";
import { Server } from "./server/Server";
import webHtmlFrame from "./web.html";
import { AppHtml } from "./clients/utils/buildTemplates";
const { GolingvuBuild } = await import("./clients/golingvuBuild");

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

// const configFilePath = process.cwd() + "/" + "testeranto.config.ts";

import(`${process.cwd()}/${configFilepath}`).then(async (module) => {
  // const pckge = (await import(`${process.cwd()}/package.json`)).default;
  const bigConfig: ITestconfig = module.default;

  // const project = bigConfig.projects[testName];
  // if (!project) {
  //   console.error("no project found for", testName, "in testeranto.config.ts");
  //   process.exit(-1);
  // }

  try {
    // fs.writeFileSync(
    //   `${process.cwd()}/testeranto/projects.json`,
    //   JSON.stringify(Object.keys(bigConfig.projects), null, 2)
    // );
  } catch (e) {
    console.error("there was a problem");
    console.error(e);
  }

  // const rawConfig: ITestconfig = bigConfig.projects[testName];

  // if (!rawConfig) {
  //   console.error(`Project "${testName}" does not exist in the configuration.`);
  //   console.error("Available projects:", Object.keys(bigConfig.projects));
  //   process.exit(-1);
  // }

  // if (!rawConfig.tests) {
  //   console.error(testName, "appears to have no tests: ", configFilePath);
  //   console.error(`here is the config:`);
  //   console.log(JSON.stringify(rawConfig));
  //   process.exit(-1);
  // }

  const config: IBuiltConfig = {
    ...bigConfig,
    buildDir: process.cwd() + "/testeranto/bundles/" + testsName,
  };

  console.log(ansiC.inverse("Press 'q' to initiate a graceful shutdown."));
  console.log(ansiC.inverse("Press 'x' to quit forcefully."));

  process.stdin.on("keypress", (str, key) => {
    if (key.name === "x") {
      console.log(ansiC.inverse("Shutting down forcefully..."));
      process.exit(-1);
    }
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////

  let pm: Server | null = null;
  // Start PM_4_Main immediately - it will handle the build processes internally

  pm = new Server(config, testsName, mode);
  await pm.start();

  fs.writeFileSync(`${process.cwd()}/testeranto/index.html`, AppHtml());

  if (!fs.existsSync(`testeranto/reports/${testsName}`)) {
    fs.mkdirSync(`testeranto/reports/${testsName}`);
  }
  fs.writeFileSync(
    `testeranto/reports/${testsName}/config.json`,
    JSON.stringify(config, null, 2)
  );

  // Object.keys(bigConfig.projects).forEach((projectName) => {
  //   // console.log(`testeranto/reports/${projectName}`);
  //   if (!fs.existsSync(`testeranto/reports/${projectName}`)) {
  //     fs.mkdirSync(`testeranto/reports/${projectName}`);
  //   }

  //   fs.writeFileSync(
  //     `testeranto/reports/${projectName}/config.json`,
  //     JSON.stringify(config, null, 2)
  //   );
  // });

  // the web runtime needs html, js and css files for support.
  const getSecondaryEndpointsPoints = (runtime: IRunTime): string[] => {
    return Object.keys(config[runtime].tests || {});
  };

  // Also handle pitono endpoints for HTML generation if needed
  // [...getSecondaryEndpointsPoints("python")].forEach(async (sourceFilePath) => {
  //   // You might want to generate specific files for pitono tests here
  //   console.log(`Pitono test found: ${sourceFilePath}`);
  // });

  // Generate HTML files for web tests synchronously
  const webTests = [...getSecondaryEndpointsPoints("web")];
  for (const sourceFilePath of webTests) {
    const sourceFileSplit = sourceFilePath.split("/");
    const sourceDir = sourceFileSplit.slice(0, -1);
    const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
    const sourceFileNameMinusJs = sourceFileName
      .split(".")
      .slice(0, -1)
      .join(".");

    const htmlFilePath = path.normalize(
      `${process.cwd()}/testeranto/bundles/web/${testsName}/${sourceDir.join(
        "/"
      )}/${sourceFileNameMinusJs}.html`
    );
    const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
    const cssFilePath = `./${sourceFileNameMinusJs}.css`;

    // Create directory if it doesn't exist
    fs.mkdirSync(path.dirname(htmlFilePath), { recursive: true });

    // Write HTML file
    fs.writeFileSync(
      htmlFilePath,
      webHtmlFrame(jsfilePath, htmlFilePath, cssFilePath)
    );
    console.log(`Generated HTML file: ${htmlFilePath}`);
  }

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

  // Debug logging to check if entry points are being found
  console.log("Node entry points:", Object.keys(nodeEntryPoints));
  console.log("Web entry points:", Object.keys(webEntryPoints));
  // console.log("Pure entry points:", Object.keys(pureEntryPoints));

  // Handle golang tests using GolingvuBuild
  // const golangTests = config.tests.filter((test) => test[1] === "golang");
  // const golangTests = config.golang.map((_, testName) => [
  const hasGolangTests = Object.keys(config.golang).length > 0;
  if (hasGolangTests) {
    const golingvuBuild = new GolingvuBuild(config, testsName);
    const golangEntryPoints = await golingvuBuild.build();
    golingvuBuild.onBundleChange(() => {
      Object.keys(golangEntryPoints).forEach((entryPoint) => {
        if (pm) {
          pm.addToQueue(entryPoint, "golang");
        }
      });
    });
  }

  // Handle pitono (Python) tests by generating their metafiles
  // const pitonoTests = config.tests.filter((test) => test[1] === "python");
  const hasPitonoTests = Object.keys(config.python).length > 0;
  if (hasPitonoTests) {
    const pitonoBuild = new PitonoBuild(config, testsName);
    const pitonoEntryPoints = await pitonoBuild.build();
    pitonoBuild.onBundleChange(() => {
      Object.keys(pitonoEntryPoints).forEach((entryPoint) => {
        if (pm) {
          pm.addToQueue(entryPoint, "python");
        }
      });
    });
  }

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
