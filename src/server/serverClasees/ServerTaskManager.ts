/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from "fs";
import { IBuiltConfig, ISummary } from "../../Types";
import { ServerTaskManagerBase } from "./ServerTaskManagerBase";
import { IMode } from "../types";

export class ServerTaskManager extends ServerTaskManagerBase {
  currentBuildResolve: (() => void) | null = null;
  currentBuildReject: ((error: any) => void) | null = null;

  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);
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
    if (this.webSocketBroadcastMessage) {
      this.webSocketBroadcastMessage({
        type: "summaryUpdate",
        data: this.summary,
      });
    }
  };

  // deprecated
  // typeCheckIsRunning(src: string) {
  //   this.updateSummaryEntry(src, { typeErrors: "?" });
  // }

  // typeCheckIsNowDone(src: string, failures: number) {
  //   this.updateSummaryEntry(src, { typeErrors: failures });
  // }

  // lintIsRunning(src: string) {
  //   this.updateSummaryEntry(src, { staticErrors: "?" });
  // }

  // lintIsNowDone(src: string, failures: number) {
  //   this.updateSummaryEntry(src, { staticErrors: failures });
  // }

  // bddTestIsNowDone(src: string, failures: number) {
  //   this.updateSummaryEntry(src, { runTimeErrors: failures });
  //   this.writeBigBoard();
  //   this.checkForShutdown();
  // }

  async stop() {
    Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());

    // Safely close WebSocket server if it exists
    if (this.wss) {
      this.wss.close(() => {
        console.log("WebSocket server closed");
      });
    }

    this.clients.forEach((client) => {
      // Check if client has a terminate method
      if (client.terminate) {
        client.terminate();
      }
    });
    this.clients.clear();

    // Safely close HTTP server if it exists
    if (this.httpServer) {
      this.httpServer.close(() => {
        console.log("HTTP server closed");
      });
    }
    this.checkForShutdown();
  }
}
