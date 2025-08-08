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
            try {
                this.typeCheckIsRunning(entrypoint);
            }
            catch (e) {
                console.error("error in tscCheck");
                console.error(e);
                console.error(entrypoint);
                console.error(JSON.stringify(this.summary, null, 2));
                process.exit(-1);
            }
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
            try {
                this.lintIsRunning(entrypoint);
            }
            catch (e) {
                console.error("error in eslintCheck");
                console.error(e);
                console.error(entrypoint);
                console.error(JSON.stringify(this.summary, null, 2));
                process.exit(-1);
            }
            const filepath = lintPather(entrypoint, platform, this.name);
            if (fs.existsSync(filepath))
                fs.rmSync(filepath);
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
        };
        this.makePrompt = async (entryPoint, addableFiles, platform) => {
            this.summary[entryPoint].prompt = "?";
            const promptPath = promptPather(entryPoint, platform, this.name);
            const testPaths = path.join("testeranto", "reports", this.name, entryPoint.split(".").slice(0, -1).join("."), platform, `tests.json`);
            const featuresPath = path.join("testeranto", "reports", this.name, platform, entryPoint.split(".").slice(0, -1).join("."), `featurePrompt.txt`);
            const logPath = path.join("testeranto", "reports", this.name, entryPoint.split(".").slice(0, -1).join("."), platform, `logs.txt`);
            const lintPath = path.join("testeranto", "reports", this.name, entryPoint.split(".").slice(0, -1).join("."), platform, `lint_errors.txt`);
            const typePath = path.join("testeranto", "reports", this.name, entryPoint.split(".").slice(0, -1).join("."), platform, `type_errors.txt`);
            const messagePath = path.join("testeranto", "reports", this.name, entryPoint.split(".").slice(0, -1).join("."), platform, `message.txt`);
            fs.writeFileSync(promptPath, `
${addableFiles
                .map((x) => {
                return `/add ${x}`;
            })
                .join("\n")}

/read node_modules/testeranto/docs/index.md
/read node_modules/testeranto/docs/style.md
/read node_modules/testeranto/docs/testing.ai.txt
/read node_modules/testeranto/src/CoreTypes.ts

/read ${testPaths}
/read ${logPath}
/read ${typePath}
/read ${lintPath}
`);
            fs.writeFileSync(messagePath, `

There are 3 types of test reports. 
1) bdd (highest priority)
2) type checker
3) static analysis (lowest priority)

"bdd_errors.txt" is the exit code of the bdd tests. Zero means all tests passed.
"tests.json" is the detailed result of the bdd tests.
"logs.txt" is the logging output of the bdd tests.
if these files do not exist, then something has gone badly wrong and needs to be addressed.

"type_errors.txt" is the result of the type checker.
if this file does not exist, then type check passed without errors;

"lint_errors.txt" is the result of the static analysis.
if this file does not exist, then static analysis passed without errors;

BDD failures are the highest priority. Focus on passing BDD tests before addressing other concerns. 
Do not add error checking to the tests themselves. 
`);
            this.summary[entryPoint].prompt = `aider --model deepseek/deepseek-chat --load testeranto/${this.name}/reports/${platform}/${entryPoint
                .split(".")
                .slice(0, -1)
                .join(".")}/prompt.txt`;
            this.checkForShutdown();
        };
        this.typeCheckIsRunning = (src) => {
            if (!this.summary[src]) {
                throw `this.summary[${src}] is undefined`;
            }
            this.summary[src].typeErrors = "?";
        };
        this.typeCheckIsNowDone = (src, failures) => {
            if (!this.summary[src]) {
                throw `this.summary[${src}] is undefined`;
            }
            if (failures === 0) {
                console.log(ansiC.green(ansiC.inverse(`tsc > ${src}`)));
            }
            else {
                console.log(ansiC.red(ansiC.inverse(`tsc > ${src} failed ${failures} times`)));
            }
            this.summary[src].typeErrors = failures;
            this.writeBigBoard();
            this.checkForShutdown();
        };
        this.lintIsRunning = (src) => {
            if (!this.summary[src]) {
                throw `this.summary[${src}] is undefined`;
            }
            this.summary[src].staticErrors = "?";
            this.writeBigBoard();
        };
        this.lintIsNowDone = (src, failures) => {
            if (!this.summary[src]) {
                throw `this.summary[${src}] is undefined`;
            }
            if (failures === 0) {
                console.log(ansiC.green(ansiC.inverse(`eslint > ${src}`)));
            }
            else {
                console.log(ansiC.red(ansiC.inverse(`eslint > ${src} failed ${failures} times`)));
            }
            this.summary[src].staticErrors = failures;
            this.writeBigBoard();
            this.checkForShutdown();
        };
        this.bddTestIsRunning = (src) => {
            if (!this.summary[src]) {
                throw `this.summary[${src}] is undefined`;
            }
            this.summary[src].runTimeErrors = "?";
            this.writeBigBoard();
        };
        this.bddTestIsNowDone = (src, failures) => {
            if (!this.summary[src]) {
                throw `this.summary[${src}] is undefined`;
            }
            this.summary[src].runTimeErrors = failures;
            this.writeBigBoard();
            this.checkForShutdown();
        };
        this.writeBigBoard = () => {
            fs.writeFileSync(`./testeranto/reports/${this.name}/summary.json`, JSON.stringify(this.summary, null, 2));
        };
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
    ensureSummaryEntry(src, isSidecar = false) {
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
}
