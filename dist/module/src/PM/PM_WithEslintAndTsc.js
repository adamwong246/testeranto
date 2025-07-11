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
import { PM_Base } from "./base.js";
const eslint = new ESLint();
const formatter = await eslint.loadFormatter("./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs");
export class PM_WithEslintAndTsc extends PM_Base {
    constructor(configs, name, mode) {
        super(configs);
        this.summary = {};
        this.tscCheck = async ({ entrypoint, addableFiles, platform, }) => {
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
            const results = [];
            allDiagnostics.forEach((diagnostic) => {
                if (diagnostic.file) {
                    const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
                    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                    results.push(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
                }
                else {
                    results.push(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
                }
            });
            fs.writeFileSync(tscPath, results.join("\n"));
            this.typeCheckIsNowDone(entrypoint, results.length);
        };
        this.eslintCheck = async (entrypoint, platform, addableFiles) => {
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
            fs.writeFileSync(lintPather(entrypoint, platform, this.name), await formatter.format(results));
            this.lintIsNowDone(entrypoint, results.length);
        };
        this.makePrompt = async (entryPoint, addableFiles, platform) => {
            this.summary[entryPoint].prompt = "?";
            const promptPath = promptPather(entryPoint, platform, this.name);
            const testPaths = path.join("testeranto", "reports", this.name, platform, entryPoint.split(".").slice(0, -1).join("."), `tests.json`);
            const featuresPath = path.join("testeranto", "reports", this.name, platform, entryPoint.split(".").slice(0, -1).join("."), `featurePrompt.txt`);
            fs.writeFileSync(promptPath, `
${addableFiles
                .map((x) => {
                return `/add ${x}`;
            })
                .join("\n")}

/read ${lintPather(entryPoint, platform, this.name)}
/read ${tscPather(entryPoint, platform, this.name)}
/read ${testPaths}

/load ${featuresPath}

/code Fix the failing tests described in ${testPaths}. Correct any type signature errors described in the files ${tscPather(entryPoint, platform, this.name)}. Implement any method which throws "Function not implemented. Resolve the lint errors described in ${lintPather(entryPoint, platform, this.name)}"
          `);
            this.summary[entryPoint].prompt = `aider --model deepseek/deepseek-chat --load testeranto/${this.name}/reports/${platform}/${entryPoint
                .split(".")
                .slice(0, -1)
                .join(".")}/prompt.txt`;
            this.checkForShutdown();
        };
        this.typeCheckIsRunning = (src) => {
            this.summary[src].typeErrors = "?";
        };
        this.typeCheckIsNowDone = (src, failures) => {
            this.summary[src].typeErrors = failures;
            this.writeBigBoard();
            this.checkForShutdown();
        };
        this.lintIsRunning = (src) => {
            this.summary[src].staticErrors = "?";
            this.writeBigBoard();
        };
        this.lintIsNowDone = (src, failures) => {
            this.summary[src].staticErrors = failures;
            this.writeBigBoard();
            this.checkForShutdown();
        };
        this.bddTestIsRunning = (src) => {
            this.summary[src].runTimeError = "?";
            this.writeBigBoard();
        };
        this.bddTestIsNowDone = (src, failures) => {
            this.summary[src].runTimeError = failures;
            this.writeBigBoard();
            this.checkForShutdown();
        };
        this.writeBigBoard = () => {
            fs.writeFileSync(`./testeranto/reports/${this.name}/summary.json`, JSON.stringify(this.summary, null, 2));
        };
        this.checkForShutdown = () => {
            console.log(ansiC.inverse(`checkForShutdown`));
            this.writeBigBoard();
            if (this.mode === "dev")
                return;
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
}
