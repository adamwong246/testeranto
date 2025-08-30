/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import ts from "typescript";
import fs from "fs";
import ansiC from "ansi-colors";
import { ESLint } from "eslint";
import tsc from "tsc-prog";

import { lintPather, tscPather } from "../utils";
import { IBuiltConfig, IRunTime, ISummary } from "../Types.js";

import { PM_WithWebSocket } from "./PM_WithWebSocket.js";
import { makePromptInternal } from "../utils/makePrompt";

const eslint = new ESLint();
const formatter = await eslint.loadFormatter(
  "./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs"
);

export abstract class PM_WithEslintAndTsc extends PM_WithWebSocket {
  name: string;
  mode: "once" | "dev";
  summary: ISummary = {};

  constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev") {
    super(configs);

    this.name = name;
    this.mode = mode;
    this.summary = {};

    // Initialize all test entries first
    this.configs.tests.forEach(([t, rt, tr, sidecars]) => {
      this.ensureSummaryEntry(t);
      sidecars.forEach(([sidecarName]) => {
        this.ensureSummaryEntry(sidecarName, true);
      });
    });
  }

  tscCheck = async ({
    entrypoint,
    addableFiles,
    platform,
  }: {
    platform: IRunTime;
    entrypoint: string;
    addableFiles: string[];
  }) => {
    const processId = `tsc-${entrypoint}-${Date.now()}`;
    const command = `tsc check for ${entrypoint}`;

    const tscPromise = (async () => {
      try {
        this.typeCheckIsRunning(entrypoint);
      } catch (e) {
        // Log error through process manager
        throw new Error(`Error in tscCheck: ${e.message}`);
      }

      const program = tsc.createProgramFromConfig({
        basePath: process.cwd(),
        configFilePath: "tsconfig.json",
        compilerOptions: {
          outDir: tscPather(entrypoint, platform, this.name),
          noEmit: true,
        },
        include: addableFiles,
      });
      const tscPath = tscPather(entrypoint, platform, this.name);

      const allDiagnostics = program.getSemanticDiagnostics();

      const results: string[] = [];
      allDiagnostics.forEach((diagnostic) => {
        if (diagnostic.file) {
          const { line, character } = ts.getLineAndCharacterOfPosition(
            diagnostic.file,
            diagnostic.start!
          );
          const message = ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            "\n"
          );
          results.push(
            `${diagnostic.file.fileName} (${line + 1},${
              character + 1
            }): ${message}`
          );
        } else {
          results.push(
            ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
          );
        }
      });

      fs.writeFileSync(tscPath, results.join("\n"));
      this.typeCheckIsNowDone(entrypoint, results.length);
      return results.length;
    })();

    // Add to process manager if available
    if (this.addPromiseProcess) {
      this.addPromiseProcess(processId, tscPromise, command);
    } else {
      // Fallback to just running the promise
      await tscPromise;
    }
  };

  eslintCheck = async (
    entrypoint: string,
    platform: IRunTime,
    addableFiles: string[]
  ) => {
    const processId = `eslint-${entrypoint}-${Date.now()}`;
    const command = `eslint check for ${entrypoint}`;

    const eslintPromise = (async () => {
      try {
        this.lintIsRunning(entrypoint);
      } catch (e) {
        throw new Error(`Error in eslintCheck: ${e.message}`);
      }

      const filepath = lintPather(entrypoint, platform, this.name);
      if (fs.existsSync(filepath)) fs.rmSync(filepath);
      const results = (await eslint.lintFiles(addableFiles))
        .filter((r) => r.messages.length)
        .filter((r) => {
          return r.messages[0].ruleId !== null;
        })
        .map((r) => {
          delete r.source;
          return r;
        });

      fs.writeFileSync(filepath, await formatter.format(results));
      this.lintIsNowDone(entrypoint, results.length);
      return results.length;
    })();

    // Add to process manager if available
    if (this.addPromiseProcess) {
      this.addPromiseProcess(processId, eslintPromise, command);
    } else {
      // Fallback to just running the promise
      await eslintPromise;
    }
  };

  makePrompt = async (
    entryPoint: string,
    addableFiles: string[],
    platform: IRunTime
  ) => {
    await makePromptInternal(
      this.summary,
      this.name,
      entryPoint,
      addableFiles,
      platform
    );
    this.checkForShutdown();
  };

  private ensureSummaryEntry(src: string, isSidecar = false) {
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

  typeCheckIsRunning = (src: string) => {
    if (!this.summary[src]) {
      throw `this.summary[${src}] is undefined`;
    }

    this.summary[src].typeErrors = "?";
  };

  typeCheckIsNowDone = (src: string, failures: number) => {
    if (!this.summary[src]) {
      throw `this.summary[${src}] is undefined`;
    }

    if (failures === 0) {
      console.log(ansiC.green(ansiC.inverse(`tsc > ${src}`)));
    } else {
      console.log(
        ansiC.red(ansiC.inverse(`tsc > ${src} failed ${failures} times`))
      );
    }

    this.summary[src].typeErrors = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  };

  lintIsRunning = (src: string) => {
    if (!this.summary[src]) {
      throw `this.summary[${src}] is undefined`;
    }
    this.summary[src].staticErrors = "?";
    this.writeBigBoard();
  };

  lintIsNowDone = (src: string, failures: number) => {
    if (!this.summary[src]) {
      throw `this.summary[${src}] is undefined`;
    }

    if (failures === 0) {
      console.log(ansiC.green(ansiC.inverse(`eslint > ${src}`)));
    } else {
      console.log(
        ansiC.red(ansiC.inverse(`eslint > ${src} failed ${failures} times`))
      );
    }

    this.summary[src].staticErrors = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  };

  bddTestIsRunning = (src: string) => {
    if (!this.summary[src]) {
      throw `this.summary[${src}] is undefined`;
    }
    this.summary[src].runTimeErrors = "?";
    this.writeBigBoard();
  };

  bddTestIsNowDone = (src: string, failures: number) => {
    if (!this.summary[src]) {
      throw `this.summary[${src}] is undefined`;
    }
    this.summary[src].runTimeErrors = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  };

  writeBigBoard = () => {
    // note: this path is different from the one used by front end
    const summaryPath = `./testeranto/reports/${this.name}/summary.json`;
    const summaryData = JSON.stringify(this.summary, null, 2);
    fs.writeFileSync(summaryPath, summaryData);

    // Broadcast the update
    this.broadcast({
      type: "summaryUpdate",
      data: this.summary,
    });
  };

  abstract checkForShutdown();
}
