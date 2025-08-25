/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import ansiC from "ansi-colors";
import fs from "fs";
import path from "path";
import readline from "readline";
import esbuild from "esbuild";

import { ITestconfig, IRunTime, ITestTypes, IBuiltConfig } from "./lib";
import { IProject } from "./Types";
import { getRunnables } from "./utils";
import { AppHtml } from "./utils/buildTemplates";

import esbuildNodeConfiger from "./esbuildConfigs/node";
import esbuildWebConfiger from "./esbuildConfigs/web";
import esbuildImportConfiger from "./esbuildConfigs/pure";
import webHtmlFrame from "./web.html";

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

const testName = process.argv[2];

const mode = process.argv[3] as "once" | "dev";
if (mode !== "once" && mode !== "dev") {
  console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
  process.exit(-1);
}

const f = process.cwd() + "/" + "testeranto.config.ts";

console.log("config file:", f);
console.log("WTF!!!!");
import(f).then(async (module) => {
  const pckge = (await import(`${process.cwd()}/package.json`)).default;
  const bigConfig: IProject = module.default;

  const project = bigConfig.projects[testName];
  if (!project) {
    console.error("no project found for", testName, "in testeranto.config.ts");
    process.exit(-1);
  }

  fs.writeFileSync(
    `${process.cwd()}/testeranto/projects.json`,
    JSON.stringify(Object.keys(bigConfig.projects), null, 2)
  );

  const rawConfig: ITestconfig = bigConfig.projects[testName];

  if (!rawConfig) {
    console.error(`Project "${testName}" does not exist in the configuration.`);
    console.error("Available projects:", Object.keys(bigConfig.projects));
    process.exit(-1);
  }

  if (!rawConfig.tests) {
    console.error(testName, "appears to have no tests: ", f);
    console.error(`here is the config:`);
    console.log(JSON.stringify(rawConfig));
    process.exit(-1);
  }

  const config: IBuiltConfig = {
    ...rawConfig,
    buildDir: process.cwd() + "/testeranto/bundles/" + testName,
  };

  console.log(ansiC.inverse("Press 'q' to initiate a graceful shutdown."));
  console.log(ansiC.inverse("Press 'x' to quit forcefully."));

  process.stdin.on("keypress", (str, key) => {
    if (key.name === "x") {
      console.log(ansiC.inverse("Shutting down forcefully..."));
      process.exit(-1);
    }
  });

  let nodeDone: boolean = false;
  let webDone: boolean = false;
  let importDone: boolean = false;

  let status: "build" | "built" = "build";

  const {
    nodeEntryPoints,
    nodeEntryPointSidecars,
    webEntryPoints,
    webEntryPointSidecars,
    pureEntryPoints,
    pureEntryPointSidecars,
  } = getRunnables(config.tests, testName);

  const onNodeDone = () => {
    nodeDone = true;
    onDone();
  };

  const onWebDone = () => {
    webDone = true;
    onDone();
  };

  const onImportDone = () => {
    importDone = true;
    onDone();
  };

  const onDone = async () => {
    if (nodeDone && webDone && importDone) {
      status = "built";

      // Collate errors and warnings per test and write to build.log
      try {
        const runtimesList: IRunTime[] = ["node", "web", "pure"];
        const testSourcesMap: Record<string, Set<string>> = {};
        const testBuildLogs: Record<
          string,
          { errors: any[]; warnings: any[] }
        > = {};

        // Process each runtime's metafile to get build errors and warnings
        for (const runtime of runtimesList) {
          const metafilePath = `${process.cwd()}/testeranto/metafiles/${runtime}/${testName}.json`;
          console.log(`Checking metafile path: ${metafilePath}`);
          
          if (!fs.existsSync(metafilePath)) {
            console.log(`Metafile does not exist for runtime ${runtime}`);
            continue;
          }
          
          const metafileData = JSON.parse(fs.readFileSync(metafilePath, "utf-8"));
          console.log(`Metafile data:`, JSON.stringify(metafileData, null, 2));
          
          // The metafile seems to have errors and warnings at the top level
          // Let's process them directly for each test
          if (Array.isArray(metafileData.errors)) {
            console.log(`Found ${metafileData.errors.length} errors in ${runtime} build`);
            
            // For now, let's associate all errors with their respective tests based on the test entry points
            // We'll create a build.json for each test in the config
            for (const test of config.tests) {
              const [entryPoint, testRuntime] = test;
              if (testRuntime !== runtime) continue;
              
              if (!testBuildLogs[entryPoint]) {
                testBuildLogs[entryPoint] = { errors: [], warnings: [] };
              }
              
              // Add all errors to this test's build log (this is a simple approach)
              // In a real implementation, we'd need to map errors to specific tests
              testBuildLogs[entryPoint].errors.push(...metafileData.errors);
            }
          }
          
          if (Array.isArray(metafileData.warnings)) {
            console.log(`Found ${metafileData.warnings.length} warnings in ${runtime} build`);
            
            for (const test of config.tests) {
              const [entryPoint, testRuntime] = test;
              if (testRuntime !== runtime) continue;
              
              if (!testBuildLogs[entryPoint]) {
                testBuildLogs[entryPoint] = { errors: [], warnings: [] };
              }
              
              testBuildLogs[entryPoint].warnings.push(...metafileData.warnings);
            }
          }
        }

        // Create build.json for each test in the configuration
        console.log(`Number of tests in config: ${config.tests.length}`);
        for (const test of config.tests) {
          const [entryPoint, runtime] = test;
          console.log(`Processing test: ${entryPoint} with runtime: ${runtime}`);
          
          // Get or create build info for this test
          if (!testBuildLogs[entryPoint]) {
            testBuildLogs[entryPoint] = { errors: [], warnings: [] };
          }
          const logs = testBuildLogs[entryPoint];
          
          // Write build.json directly to the path matching the test's folder structure
          const buildJsonDir = path.resolve(
            process.cwd(),
            "testeranto",
            "reports",
            testName,
            ...entryPoint.split("/").slice(0, -1), // Get directory path without filename
            runtime
          );
          
          console.log(`Target directory: ${buildJsonDir}`);
          
          try {
            fs.mkdirSync(buildJsonDir, { recursive: true });
            const buildJsonPath = path.join(buildJsonDir, "build.json");
            
            console.log(`Writing to: ${buildJsonPath}`);
            
            // Write the build info (errors and warnings)
            fs.writeFileSync(
              buildJsonPath,
              JSON.stringify(logs, null, 2),
              "utf-8"
            );
            
            console.log(`Successfully wrote build.json for ${entryPoint}`);
          } catch (error) {
            console.error(`Error writing build.json for ${entryPoint}:`, error);
          }
        }
      } catch (e) {
        console.error("Failed to collate build logs:", e);
      }
    }
    if (nodeDone && webDone && importDone && mode === "once") {
      console.log(
        ansiC.inverse(
          `${testName} was built and the builder exited successfully.`
        )
      );
      process.exit();
    }
  };

  fs.writeFileSync(`${process.cwd()}/testeranto/projects.html`, AppHtml());

  Object.keys(bigConfig.projects).forEach((projectName) => {
    console.log(`testeranto/reports/${projectName}`);
    if (!fs.existsSync(`testeranto/reports/${projectName}`)) {
      fs.mkdirSync(`testeranto/reports/${projectName}`);
    }

    fs.writeFileSync(
      `testeranto/reports/${projectName}/config.json`,
      JSON.stringify(config, null, 2)
    );
  });

  const getSecondaryEndpointsPoints = (runtime?: IRunTime): string[] => {
    const meta = (ts: ITestTypes[], st: Set<string>): Set<string> => {
      ts.forEach((t) => {
        if (t[1] === runtime) {
          st.add(t[0]);
        }
        if (Array.isArray(t[3])) {
          meta(t[3], st);
        }
      });
      return st;
    };
    return Array.from(meta(config.tests, new Set()));
  };

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
          `${process.cwd()}/testeranto/bundles/web/${testName}/${sourceDir.join(
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

  const x: [IRunTime, string[]][] = [
    ["pure", Object.keys(pureEntryPoints)],
    ["node", Object.keys(nodeEntryPoints)],
    ["web", Object.keys(webEntryPoints)],
  ];

  x.forEach(async ([runtime, keys]) => {
    keys.forEach(async (k) => {
      const folder = `testeranto/reports/${testName}/${k
        .split(".")
        .slice(0, -1)
        .join(".")}/${runtime}`;

      await fs.mkdirSync(folder, { recursive: true });
    });
  });

  [
    [pureEntryPoints, pureEntryPointSidecars, "pure"],
    [webEntryPoints, webEntryPointSidecars, "web"],
    [nodeEntryPoints, nodeEntryPointSidecars, "node"],
  ].forEach(
    ([eps, eps2, runtime]: [
      Record<string, string>,
      Record<string, string>,
      IRunTime
    ]) => {
      [...Object.keys(eps), ...Object.keys(eps2)].forEach((ep) => {
        const fp = path.resolve(
          `testeranto`,
          `reports`,
          testName,
          ep.split(".").slice(0, -1).join("."),
          runtime
        );
        fs.mkdirSync(fp, { recursive: true });
      });
    }
  );

  await Promise.all([
    ...(
      [
        [
          esbuildImportConfiger,
          pureEntryPoints,
          pureEntryPointSidecars,
          onImportDone,
        ],
        [
          esbuildNodeConfiger,
          nodeEntryPoints,
          nodeEntryPointSidecars,
          onNodeDone,
        ],
        [esbuildWebConfiger, webEntryPoints, webEntryPointSidecars, onWebDone],
      ] as [
        (a, b, c) => any,
        Record<string, string>,
        Record<string, string>,
        () => void
      ][]
    ).map(([configer, entryPoints, sidecars, done]) => {
      esbuild
        .context(
          configer(
            config,
            [...Object.keys(entryPoints), ...Object.keys(sidecars)],
            testName
          )
        )
        .then(async (ctx) => {
          if (mode === "dev") {
            await ctx.watch().then((v) => {
              done();
            });
          } else {
            ctx.rebuild().then((v) => {
              done();
            });
          }

          return ctx;
        });
    }),
  ]);

  // Start the PM_Main to run the tests after build
  const { PM_Main } = await import("./PM/main");
  const pm = new PM_Main(config, testName, mode);
  pm.start();

  process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
      console.log("Testeranto is shutting down gracefully...");
      pm.stop();
    }
  });
});
