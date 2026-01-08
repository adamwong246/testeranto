import fs from "fs";
import path from "path";
import { IMode } from "../types";
import { IBuiltConfig, IRunTime } from "../../Types";
import { Server_MetafileWatcher } from "./Server_MetafileWatcher";
import { makeHtmlTestFiles } from "../../makeHtmlTestFiles";
import { makeHtmlReportFile } from "../../makeHtmlReportFile";
import { getRunnables } from "./utils/getRunnables";
import { ProcessMangerHtml, IndexHtml } from "./utils/Server_FS";

export class Server_FS extends Server_MetafileWatcher {
  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);

    fs.writeFileSync(
      path.join(process.cwd(), "testeranto", `${testName}.json`),
      JSON.stringify(configs, null, 2)
    );

    if (!fs.existsSync(`testeranto/reports/${testName}`)) {
      fs.mkdirSync(`testeranto/reports/${testName}`);
    }
    fs.writeFileSync(
      `testeranto/reports/${testName}/config.json`,
      JSON.stringify(configs, null, 2)
    );

    makeHtmlTestFiles(testName);
    makeHtmlReportFile(testName, configs);

    const {
      nodeEntryPoints,
      webEntryPoints,
      pythonEntryPoints,
      golangEntryPoints,
    } = getRunnables(configs, testName);

    // create the necessary folders for all tests
    [
      ["node", Object.keys(nodeEntryPoints)],
      ["web", Object.keys(webEntryPoints)],
      ["python", Object.keys(pythonEntryPoints)],
      ["golang", Object.keys(golangEntryPoints)],
    ].forEach(async ([runtime, keys]: [IRunTime, string[]]) => {
      keys.forEach(async (k) => {
        fs.mkdirSync(
          `testeranto/reports/${testName}/${k
            .split(".")
            .slice(0, -1)
            .join(".")}/${runtime}`,
          { recursive: true }
        );
      });
    });

    setupFileSystem(configs, testName);

    if (!fs.existsSync(`testeranto/reports/${this.projectName}`)) {
      fs.mkdirSync(`testeranto/reports/${this.projectName}`);
    }
  }
}

function setupFileSystem(config: IBuiltConfig, testsName: string) {
  fs.writeFileSync(
    `${process.cwd()}/testeranto/ProcessManger.html`,
    ProcessMangerHtml()
  );

  fs.writeFileSync(`${process.cwd()}/testeranto/index.html`, IndexHtml());

  // Create reports directory
  if (!fs.existsSync(`testeranto/reports/${testsName}`)) {
    fs.mkdirSync(`testeranto/reports/${testsName}`, { recursive: true });
  }

  // Write config to reports
  fs.writeFileSync(
    `testeranto/reports/${testsName}/config.json`,
    JSON.stringify(config, null, 2)
  );
}
