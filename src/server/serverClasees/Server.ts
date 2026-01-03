/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from "fs";
import { default as ansiC } from "ansi-colors";
// import fs, { watch } from "fs";
import path from "path";
// import { pollForFile } from "../../clients/utils";
// import {
//   generatePitonoMetafile,
//   writePitonoMetafile,
// } from "../../clients/utils/pitonoMetafile";
// import { IBuiltConfig, IRunTime } from "../../lib";
import { IMode } from "../types";
import { getRunnables } from "../utils";
// import { BuildProcessManager } from "./BuildProcessManager";
// import { BuildProcessStarter } from "./BuildProcessStarter";
// import { ServerTestExecutor } from "./ServerTestExecutor";
import { IBuiltConfig } from "../../Types";
import { ServerTaskCoordinator } from "./ServerTaskCoordinator";
import { TestEnvironmentSetup } from "./utils/TestEnvironmentSetup";
// import { TypeCheckNotifier } from "./TypeCheckNotifier";

export class Server extends ServerTaskCoordinator {
  // webMetafileWatcher: fs.FSWatcher;
  // nodeMetafileWatcher: fs.FSWatcher;
  // importMetafileWatcher: fs.FSWatcher;
  // pitonoMetafileWatcher: fs.FSWatcher;
  // golangMetafileWatcher: fs.FSWatcher;

  testName: string;
  private composeDir: string;

  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);

    fs.writeFileSync(
      path.join(process.cwd(), "testeranto", `${testName}.json`),
      JSON.stringify(configs, null, 2)
    );

    configs.ports.forEach((port) => {
      this.ports[port] = ""; // set ports as open
    });

    this.launchers = {};

    this.testName = testName;
    this.composeDir = process.cwd();
    this.composeFile = path.join(
      this.composeDir,
      "testeranto",
      "bundles",
      `${this.testName}-docker-compose.yml`
    );

    // Initialize TestEnvironmentSetup
    // Note: ports, browser, and queue will be set later
    // We'll need to update them when they're available
    this.testEnvironmentSetup = new TestEnvironmentSetup(
      this.ports,
      this.projectName,
      this.browser,
      this.queue
    );

    // Initialize BuildProcessManager
    // this.buildProcessManager = new BuildProcessManager(
    //   this.projectName,
    //   this.configs,
    //   this.mode,
    //   this.webSocketBroadcastMessage.bind(this),
    //   this.addPromiseProcess?.bind(this)
    // );
    // Initialize BuildProcessStarter
    // this.buildProcessStarter = new BuildProcessStarter(
    //   this.projectName,
    //   this.configs,
    //   this.buildProcessManager
    // );

    // Initialize TypeCheckNotifier
    // this.typeCheckNotifier = new TypeCheckNotifier(
    //   this.summary,
    //   this.writeBigBoard.bind(this),
    //   this.checkForShutdown.bind(this)
    // );
  }

  async start() {
    // Wait for build processes to complete first
    try {
      // await this.buildProcessStarter.startBuildProcesses();
      // Generate Python metafile if there are Python tests
      // const pythonTests = this.configTests().filter(
      //   (test) => test[1] === "python"
      // );
      // if (pythonTests.length > 0) {
      //   const entryPoints = pythonTests.map((test) => test[0]);
      //   const metafile = await generatePitonoMetafile(
      //     this.projectName,
      //     entryPoints
      //   );
      //   writePitonoMetafile(this.projectName, metafile);
      // }
      // this.onBuildDone();
    } catch (error) {
      console.error("Build processes failed:", error);
      return;
    }

    // Continue with the rest of the setup after builds are done
    this.mapping().forEach(async ([command, func]) => {
      globalThis[command] = func;
    });

    if (!fs.existsSync(`testeranto/reports/${this.projectName}`)) {
      fs.mkdirSync(`testeranto/reports/${this.projectName}`);
    }

    // In Docker, we don't launch Chrome directly - we connect to browserless/chrome service
    // So we don't need to initialize this.browser here
    // It will be created per test in WebLauncher
    // this.browser = null;

    // const runnables = getRunnables(this.configs, this.projectName);
    // const {
    //   nodeEntryPoints,
    //   webEntryPoints,
    //   // pureEntryPoints,
    //   pythonEntryPoints,
    //   golangEntryPoints,
    // } = runnables;

    // Add all tests to the queue
    // [
    //   ["node", nodeEntryPoints],
    //   ["web", webEntryPoints],
    //   // ["pure", pureEntryPoints],
    //   ["python", pythonEntryPoints],
    //   ["golang", golangEntryPoints],
    // ].forEach(([runtime, entryPoints]: [IRunTime, Record<string, string>]) => {
    //   Object.keys(entryPoints).forEach((entryPoint) => {
    //     // Create the report directory
    //     const reportDest = `testeranto/reports/${this.projectName}/${entryPoint
    //       .split(".")
    //       .slice(0, -1)
    //       .join(".")}/${runtime}`;
    //     if (!fs.existsSync(reportDest)) {
    //       fs.mkdirSync(reportDest, { recursive: true });
    //     }

    //     // Add to the processing queue
    //     // this.addToQueue(
    //     //   entryPoint,
    //     //   runtime,
    //     //   this.configs,
    //     //   this.projectName,
    //     //   this.cleanupTestProcessesInternal.bind(this),
    //     //   this.checkQueue.bind(this),
    //     //   undefined
    //     // );
    //   });
    // });

    // Start processing the queue after all tests have been added
    // this.checkQueue();

    // Set up metafile watchers for each runtime
    // const runtimeConfigs = [
    //   ["node", nodeEntryPoints],
    //   ["web", webEntryPoints],
    //   // ["pure", pureEntryPoints],
    //   ["python", pythonEntryPoints],
    //   ["golang", golangEntryPoints],
    // ];

    // for (const [runtime, entryPoints] of runtimeConfigs) {
    //   if (Object.keys(entryPoints).length === 0) continue;

    //   // For python, the metafile path is different
    //   let metafile: string;
    //   if (runtime === "python") {
    //     metafile = `./testeranto/metafiles/${runtime}/core.json`;
    //   } else {
    //     metafile = `./testeranto/metafiles/${runtime}/${this.projectName}.json`;
    //   }

    //   // Ensure the directory exists
    //   const metafileDir = metafile.split("/").slice(0, -1).join("/");
    //   if (!fs.existsSync(metafileDir)) {
    //     fs.mkdirSync(metafileDir, { recursive: true });
    //   }

    //   // Create an empty file if it doesn't exist to avoid watch errors
    //   if (!fs.existsSync(metafile)) {
    //     fs.writeFileSync(metafile, JSON.stringify({}));
    //   }

    //   try {
    //     // For python, we may need to generate the metafile first
    //     if (runtime === "python") {
    //       const entryPointList = Object.keys(entryPoints);
    //       if (entryPointList.length > 0) {
    //         const metafileData = await generatePitonoMetafile(
    //           this.projectName,
    //           entryPointList
    //         );
    //         writePitonoMetafile(this.projectName, metafileData);
    //       }
    //     }

    //     // Wait for the file to exist (it should now exist since we created it)
    //     await pollForFile(metafile);
    //     // console.log("Found metafile for", runtime, metafile);

    //     // Set up watcher for the metafile with debouncing
    //     let timeoutId: NodeJS.Timeout;
    //     const watcher = watch(metafile, async (e, filename) => {
    //       // Debounce to avoid multiple rapid triggers
    //       clearTimeout(timeoutId);
    //       timeoutId = setTimeout(async () => {
    //         console.log(
    //           ansiC.yellow(ansiC.inverse(`< ${e} ${filename} (${runtime})`))
    //         );
    //         try {
    //           // await this.metafileOutputs(runtime as IRunTime);
    //           // After processing metafile changes, check the queue to run tests
    //           console.log(
    //             ansiC.blue(
    //               `Metafile processed, checking queue for tests to run`
    //             )
    //           );
    //           // this.checkQueue();
    //         } catch (error) {
    //           console.error(`Error processing metafile changes:`, error);
    //         }
    //       }, 300); // 300ms debounce
    //     });

    //     // Store the watcher based on runtime
    //     // switch (runtime) {
    //     //   case "node":
    //     //     this.nodeMetafileWatcher = watcher;
    //     //     break;
    //     //   case "web":
    //     //     this.webMetafileWatcher = watcher;
    //     //     break;
    //     //   // case "pure":
    //     //   //   this.importMetafileWatcher = watcher;
    //     //   //   break;
    //     //   case "python":
    //     //     this.pitonoMetafileWatcher = watcher;
    //     //     break;
    //     //   case "golang":
    //     //     this.golangMetafileWatcher = watcher;
    //     //     break;
    //     // }

    //     // Read the metafile immediately
    //     // await this.metafileOutputs(runtime as IRunTime);
    //   } catch (error) {
    //     console.error(`Error setting up watcher for ${runtime}:`, error);
    //   }
    // }
  }

  async stop() {
    console.log(ansiC.inverse("Testeranto-Run is shutting down gracefully..."));
    this.mode = "once";
    // this.nodeMetafileWatcher.close();
    // this.webMetafileWatcher.close();
    // this.importMetafileWatcher.close();
    // if (this.pitonoMetafileWatcher) {
    //   this.pitonoMetafileWatcher.close();
    // }
    super.stop();
  }
}
