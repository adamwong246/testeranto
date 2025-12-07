/* eslint-disable @typescript-eslint/no-explicit-any */

import { IRunTime } from "../Types.js";
import fs from "fs";
import { getRunnables, tscPather, lintPather } from "./utils.js";
import { tscCheck as tscCheckFn } from "./node+web/tscCheck";
import { lintCheck } from "./node+web/lintCheck.js";

export interface TestExecutorConfig {
  projectName: string;
  configs: any;
  summary: any;
  summaryManager: any;
  processManager: any;
  portManager: any;
  browser: any;
  webSocketBroadcastMessage: (message: any) => void;
  // Methods from Server that we need
  typeCheckIsRunning: (src: string) => void;
  typeCheckIsNowDone: (src: string, failures: number) => void;
  lintIsRunning: (src: string) => void;
  lintIsNowDone: (src: string, failures: number) => void;
  bddTestIsRunning: (src: string) => void;
  bddTestIsNowDone: (src: string, failures: number) => void;
  launchNode: (src: string, dest: string) => Promise<void>;
  launchWeb: (src: string, dest: string) => Promise<void>;
  launchPython: (src: string, dest: string) => Promise<void>;
  launchGolang: (src: string, dest: string) => Promise<void>;
  addPromiseProcess: (
    processId: string,
    promise: Promise<any>,
    command: string,
    category: "aider" | "bdd-test" | "build-time" | "other",
    testName: string,
    platform: IRunTime,
    onResolve?: (result: any) => void,
    onReject?: (error: any) => void
  ) => string;
  // Python check methods
  pythonLintCheck: (entrypoint: string, addableFiles: string[]) => Promise<any>;
  pythonTypeCheck: (entrypoint: string, addableFiles: string[]) => Promise<any>;
}

export class TestExecutor {
  private config: TestExecutorConfig;

  constructor(config: TestExecutorConfig) {
    this.config = config;
  }

  async executeTest(
    src: string,
    runtime: IRunTime,
    addableFiles?: string[]
  ): Promise<void> {
    // Get the entry point for the test
    const runnables = getRunnables(
      this.config.configs,
      this.config.projectName
    );
    let dest: string;

    switch (runtime) {
      case "node":
        dest = runnables.nodeEntryPoints[src];
        break;
      case "web":
        dest = runnables.webEntryPoints[src];
        break;
      case "python":
        dest = runnables.pythonEntryPoints[src];
        break;
      case "golang":
        dest = runnables.golangEntryPoints[src];
        break;
      default:
        throw new Error(`Unsupported runtime: ${runtime}`);
    }

    if (!dest) {
      console.error(`No destination found for test: ${src} (${runtime})`);
      return;
    }

    // Run static analysis based on runtime
    if (runtime === "node" || runtime === "web") {
      await this.runTscCheck(src, runtime, addableFiles);
      await this.runEslintCheck(src, runtime, addableFiles);
    } else if (runtime === "python") {
      // For Python, run lint and type checks
      await this.runPythonLintCheck(src, runtime, addableFiles);
      await this.runPythonTypeCheck(src, runtime, addableFiles);
    }
    // For golang, there's no static analysis in this system

    // Run the BDD test
    await this.runBddTest(src, runtime, dest);
  }

  private async runTscCheck(
    src: string,
    runtime: IRunTime,
    addableFiles?: string[]
  ): Promise<void> {
    const processId = `tsc-${src}-${Date.now()}`;
    const command = `tsc check for ${src}`;

    const tscPromise = (async () => {
      try {
        this.config.typeCheckIsRunning(src);
      } catch (e: any) {
        throw new Error(`Error in tscCheck: ${e.message}`);
      }

      const tscPath = tscPather(src, runtime, this.config.projectName);
      const filesToUse = addableFiles || [];
      const results = tscCheckFn({
        entrypoint: src,
        addableFiles: filesToUse,
        platform: runtime,
        projectName: this.config.projectName,
      });

      fs.writeFileSync(tscPath, results.join("\n"));
      this.config.typeCheckIsNowDone(src, results.length);
      return results.length;
    })();

    this.config.addPromiseProcess(
      processId,
      tscPromise,
      command,
      "build-time",
      src,
      runtime
    );

    // Wait for tsc check to complete
    await tscPromise;
  }

  private async runEslintCheck(
    src: string,
    runtime: IRunTime,
    addableFiles?: string[]
  ): Promise<void> {
    const processId = `eslint-${src}-${Date.now()}`;
    const command = `eslint check for ${src}`;

    const eslintPromise = (async () => {
      try {
        this.config.lintIsRunning(src);
      } catch (e: any) {
        throw new Error(`Error in eslintCheck: ${e.message}`);
      }
      const filepath = lintPather(src, runtime, this.config.projectName);
      if (fs.existsSync(filepath)) fs.rmSync(filepath);
      const filesToUse = addableFiles || [];
      const results = await lintCheck(filesToUse);
      fs.writeFileSync(filepath, results);
      this.config.lintIsNowDone(src, results.length);
      return results.length;
    })();

    this.config.addPromiseProcess(
      processId,
      eslintPromise,
      command,
      "build-time",
      src,
      runtime
    );

    // Wait for eslint check to complete
    await eslintPromise;
  }

  private async runPythonLintCheck(
    src: string,
    runtime: IRunTime,
    addableFiles?: string[]
  ): Promise<void> {
    const processId = `python-lint-${src}-${Date.now()}`;
    const command = `python lint check for ${src}`;

    const filesToUse = addableFiles || [];
    const promise = this.config.pythonLintCheck(src, filesToUse);

    this.config.addPromiseProcess(
      processId,
      promise,
      command,
      "build-time",
      src,
      runtime
    );

    await promise;
  }

  private async runPythonTypeCheck(
    src: string,
    runtime: IRunTime,
    addableFiles?: string[]
  ): Promise<void> {
    const processId = `python-type-${src}-${Date.now()}`;
    const command = `python type check for ${src}`;

    const filesToUse = addableFiles || [];
    const promise = this.config.pythonTypeCheck(src, filesToUse);

    this.config.addPromiseProcess(
      processId,
      promise,
      command,
      "build-time",
      src,
      runtime
    );

    await promise;
  }

  private async runBddTest(
    src: string,
    runtime: IRunTime,
    dest: string
  ): Promise<void> {
    // Mark BDD test as running
    this.config.bddTestIsRunning(src);

    // Launch the appropriate test based on runtime
    switch (runtime) {
      case "node":
        await this.config.launchNode(src, dest);
        break;
      case "web":
        await this.config.launchWeb(src, dest);
        break;
      case "python":
        await this.config.launchPython(src, dest);
        break;
      case "golang":
        await this.config.launchGolang(src, dest);
        break;
      default:
        throw new Error(`Unsupported runtime for BDD test: ${runtime}`);
    }
  }
}
