/* eslint-disable @typescript-eslint/no-unused-vars */
import ansiC from "ansi-colors";
import fs from "fs";
import path from "path";
import readline from "readline";
import yaml from "js-yaml";
// import { PM_Main } from "./app/backend/main";
import DockerMan from "./DockerMan/index";
import { getRunnables } from "./app/backend/utils";
import { PitonoBuild } from "./PM/pitonoBuild";
import { IBuiltConfig, IRunTime, ITestconfig, ITests } from "./Types";
import { AppHtml } from "./utils/buildTemplates";
import webHtmlFrame from "./web.html";
import tiposkripto from "./lib/Node";
import { build } from "esbuild";
const { GolingvuBuild } = await import("./PM/golingvuBuild");

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

  process.stdin.on("keypress", (str, key) => {
    if (key.name === "x") {
      console.log(ansiC.inverse("Shutting down forcefully..."));
      process.exit(-1);
    }
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////

  // let pm: PM_Main | null = null;
  // Start PM_Main immediately - it will handle the build processes internally
  // const { PM_Main } = await import("./app/backend/main");
  // pm = new PM_Main(config, testsName, mode);
  // await pm.start();

  const dockerMan = new DockerMan();

  fs.writeFileSync(`${process.cwd()}/testeranto/index.html`, AppHtml());

  if (!fs.existsSync(`testeranto/reports/${testsName}`)) {
    fs.mkdirSync(`testeranto/reports/${testsName}`);
  }
  fs.writeFileSync(
    `testeranto/reports/${testsName}/config.json`,
    JSON.stringify(config, null, 2)
  );

  // Helper function to generate Dockerfile content for a specific runtime and test
  const generateDockerfile = (
    c: IBuiltConfig,
    runtime: IRunTime,
    testName: string
  ): string => {
    return c[runtime].dockerfile[0]
      .map((line) => {
        if (line[0] === "STATIC_ANALYSIS") {
          const cmdFx = line[1];
          return `RUN ${cmdFx("x").join(" ")}\n`;
        } else {
          return `${line[0]} ${line[0]}\n`;
        }
      })
      .join("");
  };

  // Helper function to get the appropriate command for a runtime
  const getCommandForRuntime = (runtime: IRunTime): string => {
    switch (runtime) {
      case "node":
        return "node";
      case "web":
        return "node";
      case "python":
        return "python3";
      case "golang":
        return "go";
      default:
        return "echo 'Unknown runtime'";
    }
  };

  // Generate services for all runtimes
  const generateServices = (c: IBuiltConfig): Record<string, any> => {
    const services: Record<string, any> = {};

    // Process each runtime
    const runtimes: IRunTime[] = ["node", "web", "golang", "python"];
    runtimes.forEach((runtime) => {
      // Check if the runtime has tests configured
      if (c[runtime] && c[runtime].tests) {
        Object.keys(c[runtime].tests).forEach((testName) => {
          const serviceName = `${runtime}-${testName}`;

          // Generate Dockerfile content
          const dockerfileContent = generateDockerfile(c, runtime, testName);

          // Write Dockerfile
          const dockerfilePath = `testeranto/bundles/${testsName}/${serviceName}.Dockerfile`;
          fs.mkdirSync(path.dirname(dockerfilePath), { recursive: true });
          fs.writeFileSync(dockerfilePath, dockerfileContent);

          // Add service configuration
          services[serviceName] = {
            build: {
              context: ".",
              dockerfile: `testeranto/bundles/${testsName}/Dockerfile.${serviceName}`,
            },
            command: getCommandForRuntime(runtime),
          };
        });
      }
    });

    return services;
  };

  const services = generateServices(config);

  const dump = {
    version: "3.8",
    services,
  };

  fs.writeFileSync(
    `testeranto/bundles/${testsName}-docker-compose.yml`,
    yaml.dump(dump)
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
    // const meta = (ts: ITestTypes[], st: Set<string>): Set<string> => {
    //   ts.forEach((t) => {
    //     if (t[1] === runtime) {
    //       st.add(t[0]);
    //     }
    //     if (Array.isArray(t[3])) {
    //       meta(t[3], st);
    //     }
    //   });
    //   return st;
    // };
    return Array.from((config[runtime].tests, new Set()));
  };

  // Also handle pitono endpoints for HTML generation if needed
  // [...getSecondaryEndpointsPoints("python")].forEach(async (sourceFilePath) => {
  //   // You might want to generate specific files for pitono tests here
  //   console.log(`Pitono test found: ${sourceFilePath}`);
  // });

  Promise.resolve(
    Promise.all(
      [...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
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

        return fs.promises
          .mkdir(path.dirname(htmlFilePath), { recursive: true })
          .then((x) =>
            fs.writeFileSync(
              htmlFilePath,
              webHtmlFrame(jsfilePath, htmlFilePath, cssFilePath)
            )
          );
      })
    )
  );

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

  // Handle golingvu (Golang) tests by generating their metafiles
  const hasGolangTests = Object.keys(config.golang).length > 0;
  if (hasGolangTests) {
    const golingvuBuild = new GolingvuBuild(config, testsName);
    const golangEntryPoints = await golingvuBuild.build();
    golingvuBuild.onBundleChange(() => {
      Object.keys(golangEntryPoints).forEach((entryPoint) => {
        dockerMan.onBundleChange(entryPoint, "golang");
      });
    });
  }

  // Handle pitono (Python) tests by generating their metafiles
  const hasPitonoTests = Object.keys(config.python).length > 0;
  if (hasPitonoTests) {
    const pitonoBuild = new PitonoBuild(config, testsName);
    const pitonoEntryPoints = await pitonoBuild.build();
    pitonoBuild.onBundleChange(() => {
      Object.keys(pitonoEntryPoints).forEach((entryPoint) => {
        dockerMan.onBundleChange(entryPoint, "python");
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
      dockerMan.stop();
      // if (pm) {
      //   pm.stop();
      // } else {
      //   process.exit();
      // }
    }
  });
});
