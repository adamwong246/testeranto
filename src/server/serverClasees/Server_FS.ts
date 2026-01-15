import fs from "fs";
import path from "path";
import { IMode } from "../types";
import { IBuiltConfig, IRunTime, ISummary } from "../../Types";
import { makeHtmlTestFiles } from "../../makeHtmlTestFiles";
import { makeHtmlReportFile } from "../../makeHtmlReportFile";
import { Server_WS } from "./Server_WS";
import { getRunnables } from "../getRunnables";
import { ProcessMangerHtml, IndexHtml } from "../serverManagers/fs";


export class Server_FS extends Server_WS {
  summary: ISummary = {};

  currentBuildResolve: (() => void) | null = null;
  currentBuildReject: ((error: any) => void) | null = null;

  constructor(configs: IBuiltConfig, testName: string, mode: IMode, routes) {
    super(configs, testName, mode, routes);

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

  ensureSummaryEntry(src: string, isSidecar = false) {
    if (!this.summary[src]) {
      this.summary[src] = {
        runTimeTests: undefined,
        runTimeErrors: undefined,
        typeErrors: undefined,
        staticErrors: undefined,
        prompt: undefined,
        failingFeatures: undefined,
      };
    }
    return this.summary[src];
  }

  getSummary() {
    return this.summary;
  }

  setSummary(summary: ISummary) {
    this.summary = summary;
  }

  updateSummaryEntry(
    src: string,
    updates: Partial<{
      typeErrors: number | "?" | undefined;
      staticErrors: number | "?" | undefined;
      runTimeErrors: number | "?" | undefined;
      prompt: string | "?" | undefined;
      failingFeatures: object | undefined;
    }>
  ) {
    if (!this.summary[src]) {
      this.ensureSummaryEntry(src);
    }
    this.summary[src] = { ...this.summary[src], ...updates };
  }

  writeBigBoard = () => {
    const summaryPath = `./testeranto/reports/${this.projectName}/summary.json`;
    const summaryData = JSON.stringify(this.summary, null, 2);
    fs.writeFileSync(summaryPath, summaryData);

    // Broadcast the update if WebSocket is available
    // if (this.webSocketBroadcastMessage) {
    //   this.webSocketBroadcastMessage({
    //     type: "summaryUpdate",
    //     data: this.summary,
    //   });
    // }
  };

  async stop() {
    await super.stop();
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
