import fs from "fs";
import { ISummary } from "../Types.js";

export class SummaryManager {
  private summary: ISummary = {};

  constructor() {}

  ensureSummaryEntry(src: string, isSidecar = false) {
    if (!this.summary[src]) {
      this.summary[src] = {
        typeErrors: undefined,
        staticErrors: undefined,
        runTimeErrors: undefined,
        prompt: undefined,
        failingFeatures: {},
      };
      if (isSidecar) {
        // Sidecars don't need all fields
        // delete this.summary[src].runTimeError;
        // delete this.summary[src].prompt;
      }
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

  writeBigBoard(projectName: string, webSocketBroadcastMessage?: (message: any) => void) {
    const summaryPath = `./testeranto/reports/${projectName}/summary.json`;
    const summaryData = JSON.stringify(this.summary, null, 2);
    fs.writeFileSync(summaryPath, summaryData);

    // Broadcast the update if WebSocket is available
    if (webSocketBroadcastMessage) {
      webSocketBroadcastMessage({
        type: "summaryUpdate",
        data: this.summary,
      });
    }
  }

  bddTestIsRunning(src: string) {
    this.updateSummaryEntry(src, {
      prompt: "?",
      runTimeErrors: "?",
      staticErrors: "?",
      typeErrors: "?",
      failingFeatures: {},
    });
  }

  typeCheckIsRunning(src: string) {
    this.updateSummaryEntry(src, { typeErrors: "?" });
  }

  typeCheckIsNowDone(src: string, failures: number) {
    this.updateSummaryEntry(src, { typeErrors: failures });
  }

  lintIsRunning(src: string) {
    this.updateSummaryEntry(src, { staticErrors: "?" });
  }

  lintIsNowDone(src: string, failures: number) {
    this.updateSummaryEntry(src, { staticErrors: failures });
  }

  bddTestIsNowDone(src: string, failures: number) {
    this.updateSummaryEntry(src, { runTimeErrors: failures });
  }
}
