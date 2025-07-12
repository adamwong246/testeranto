/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import ts from "typescript";
import fs from "fs";
import path from "path";
import ansiC from "ansi-colors";
import { ESLint } from "eslint";
import tsc from "tsc-prog";

import { lintPather, promptPather, tscPather } from "../utils";
import { IBuiltConfig, IRunTime, ISummary } from "../Types.js";

import { PM_Base } from "./base.js";

const eslint = new ESLint();
const formatter = await eslint.loadFormatter(
  "./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs"
);

export abstract class PM_WithEslintAndTsc extends PM_Base {
  name: string;
  mode: "once" | "dev";
  summary: ISummary = {};

  constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev") {
    super(configs);

    this.name = name;
    this.mode = mode;

    this.configs.tests.forEach(([t, rt, tr, sidecars]) => {
      this.summary[t] = {
        runTimeError: "?",
        typeErrors: "?",
        staticErrors: "?",
        prompt: "?",
        failingFeatures: {},
      };
      sidecars.forEach(([t]) => {
        this.summary[t] = {
          // runTimeError: "?",
          typeErrors: "?",
          staticErrors: "?",
          // prompt: "?",
          // failingFeatures: {},
        };
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
    console.log(ansiC.green(ansiC.inverse(`tsc < ${entrypoint}`)));
    this.typeCheckIsRunning(entrypoint);

    const program = tsc.createProgramFromConfig({
      basePath: process.cwd(), // always required, used for relative paths
      configFilePath: "tsconfig.json", // config to inherit from (optional)
      compilerOptions: {
        outDir: tscPather(entrypoint, platform, this.name),
        // declaration: true,
        // skipLibCheck: true,
        noEmit: true,
      },
      include: addableFiles, //["src/**/*"],
      // exclude: ["node_modules", "../testeranto"],
      // exclude: ["**/*.test.ts", "**/*.spec.ts"],
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
  };

  eslintCheck = async (
    entrypoint: string,
    platform: IRunTime,
    addableFiles: string[]
  ) => {
    console.log(ansiC.green(ansiC.inverse(`eslint < ${entrypoint}`)));
    this.lintIsRunning(entrypoint);

    const results = (await eslint.lintFiles(addableFiles))
      .filter((r) => r.messages.length)
      .filter((r) => {
        return r.messages[0].ruleId !== null;
      })
      .map((r) => {
        delete r.source;
        return r;
      });

    fs.writeFileSync(
      lintPather(entrypoint, platform, this.name),
      await formatter.format(results)
    );
    this.lintIsNowDone(entrypoint, results.length);
  };

  makePrompt = async (
    entryPoint: string,
    addableFiles: string[],
    platform: IRunTime
  ) => {
    this.summary[entryPoint].prompt = "?";
    const promptPath = promptPather(entryPoint, platform, this.name);

    const testPaths = path.join(
      "testeranto",
      "reports",
      this.name,
      entryPoint.split(".").slice(0, -1).join("."),
      platform,
      `tests.json`
    );

    const featuresPath = path.join(
      "testeranto",
      "reports",
      this.name,
      platform,
      entryPoint.split(".").slice(0, -1).join("."),
      `featurePrompt.txt`
    );

    const logPath = path.join(
      "testeranto",
      "reports",
      this.name,
      entryPoint.split(".").slice(0, -1).join("."),
      platform,
      `console_log.txt`
    );

    const lintPath = path.join(
      "testeranto",
      "reports",
      this.name,
      entryPoint.split(".").slice(0, -1).join("."),
      platform,
      `lint_errors.json`
    );

    const typePath = path.join(
      "testeranto",
      "reports",
      this.name,
      entryPoint.split(".").slice(0, -1).join("."),
      platform,
      `type_errors.txt`
    );

    const messagePath = path.join(
      "testeranto",
      "reports",
      this.name,
      entryPoint.split(".").slice(0, -1).join("."),
      platform,
      `message`
    );

    fs.writeFileSync(
      promptPath,
      `
${addableFiles
  .map((x) => {
    return `/add ${x}`;
  })
  .join("\n")}

/read ${testPaths}
/read ${logPath}
/read ${typePath}
/read ${lintPath}
`
    );

    fs.writeFileSync(
      messagePath,
      `Fix the failing tests described in ${testPaths} and ${logPath}. DO NOT refactor beyond what is necessary. Always prefer minimal changes, focusing mostly on keeping the BDD tests passing`
    );

    this.summary[
      entryPoint
    ].prompt = `aider --model deepseek/deepseek-chat --load testeranto/${
      this.name
    }/reports/${platform}/${entryPoint
      .split(".")
      .slice(0, -1)
      .join(".")}/prompt.txt`;
    this.checkForShutdown();
  };

  typeCheckIsRunning = (src: string) => {
    this.summary[src].typeErrors = "?";
  };

  typeCheckIsNowDone = (src: string, failures: number) => {
    this.summary[src].typeErrors = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  };

  lintIsRunning = (src: string) => {
    this.summary[src].staticErrors = "?";
    this.writeBigBoard();
  };

  lintIsNowDone = (src: string, failures: number) => {
    this.summary[src].staticErrors = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  };

  bddTestIsRunning = (src: string) => {
    this.summary[src].runTimeError = "?";
    this.writeBigBoard();
  };

  bddTestIsNowDone = (src: string, failures: number) => {
    this.summary[src].runTimeError = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  };

  writeBigBoard = () => {
    fs.writeFileSync(
      `./testeranto/reports/${this.name}/summary.json`,
      JSON.stringify(this.summary, null, 2)
    );
  };

  checkForShutdown = () => {
    console.log(ansiC.inverse(`checkForShutdown`));

    this.writeBigBoard();

    if (this.mode === "dev") return;

    let inflight = false;

    Object.keys(this.summary).forEach((k) => {
      if (this.summary[k].prompt === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 prompt ${k}`)));
        inflight = true;
      }
    });

    Object.keys(this.summary).forEach((k) => {
      if (this.summary[k].runTimeError === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 runTimeError ${k}`)));
        inflight = true;
      }
    });

    Object.keys(this.summary).forEach((k) => {
      if (this.summary[k].staticErrors === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 staticErrors ${k}`)));
        inflight = true;
      }
    });

    Object.keys(this.summary).forEach((k) => {
      if (this.summary[k].typeErrors === "?") {
        console.log(ansiC.blue(ansiC.inverse(`🕕 typeErrors ${k}`)));
        inflight = true;
      }
    });

    this.writeBigBoard();

    if (!inflight) {
      this.browser.disconnect().then(() => {
        console.log(ansiC.inverse(`${this.name} has been tested. Goodbye.`));
        process.exit();
      });
    }
  };
}
