import fs from "fs";
import { IBuiltConfig, ISummary } from "../../Types";
import { ServerProcessManager } from "./ServerProcessManager";
import { IMode } from "../types";

export class ServerWriter extends ServerProcessManager {
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

  async stop() {
    await super.stop();
  }
}
