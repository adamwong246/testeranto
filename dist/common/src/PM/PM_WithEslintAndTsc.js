"use strict";
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_WithEslintAndTsc = void 0;
const typescript_1 = __importDefault(require("typescript"));
const fs_1 = __importDefault(require("fs"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const eslint_1 = require("eslint");
const tsc_prog_1 = __importDefault(require("tsc-prog"));
const utils_1 = require("../utils");
const PM_WithWebSocket_js_1 = require("./PM_WithWebSocket.js");
const makePrompt_1 = require("../utils/makePrompt");
const eslint = new eslint_1.ESLint();
const formatter = await eslint.loadFormatter("./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs");
class PM_WithEslintAndTsc extends PM_WithWebSocket_js_1.PM_WithWebSocket {
    constructor(configs, name, mode) {
        super(configs);
        this.summary = {};
        this.tscCheck = async ({ entrypoint, addableFiles, platform, }) => {
            const processId = `tsc-${entrypoint}-${Date.now()}`;
            const command = `tsc check for ${entrypoint}`;
            const tscPromise = (async () => {
                try {
                    this.typeCheckIsRunning(entrypoint);
                }
                catch (e) {
                    // Log error through process manager
                    throw new Error(`Error in tscCheck: ${e.message}`);
                }
                const program = tsc_prog_1.default.createProgramFromConfig({
                    basePath: process.cwd(),
                    configFilePath: "tsconfig.json",
                    compilerOptions: {
                        outDir: (0, utils_1.tscPather)(entrypoint, platform, this.name),
                        noEmit: true,
                    },
                    include: addableFiles,
                });
                const tscPath = (0, utils_1.tscPather)(entrypoint, platform, this.name);
                const allDiagnostics = program.getSemanticDiagnostics();
                const results = [];
                allDiagnostics.forEach((diagnostic) => {
                    if (diagnostic.file) {
                        const { line, character } = typescript_1.default.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
                        const message = typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                        results.push(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
                    }
                    else {
                        results.push(typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
                    }
                });
                fs_1.default.writeFileSync(tscPath, results.join("\n"));
                this.typeCheckIsNowDone(entrypoint, results.length);
                return results.length;
            })();
            // Add to process manager if available
            if (this.addPromiseProcess) {
                this.addPromiseProcess(processId, tscPromise, command);
            }
            else {
                // Fallback to just running the promise
                await tscPromise;
            }
        };
        this.eslintCheck = async (entrypoint, platform, addableFiles) => {
            const processId = `eslint-${entrypoint}-${Date.now()}`;
            const command = `eslint check for ${entrypoint}`;
            const eslintPromise = (async () => {
                try {
                    this.lintIsRunning(entrypoint);
                }
                catch (e) {
                    throw new Error(`Error in eslintCheck: ${e.message}`);
                }
                const filepath = (0, utils_1.lintPather)(entrypoint, platform, this.name);
                if (fs_1.default.existsSync(filepath))
                    fs_1.default.rmSync(filepath);
                const results = (await eslint.lintFiles(addableFiles))
                    .filter((r) => r.messages.length)
                    .filter((r) => {
                    return r.messages[0].ruleId !== null;
                })
                    .map((r) => {
                    delete r.source;
                    return r;
                });
                fs_1.default.writeFileSync(filepath, await formatter.format(results));
                this.lintIsNowDone(entrypoint, results.length);
                return results.length;
            })();
            // Add to process manager if available
            if (this.addPromiseProcess) {
                this.addPromiseProcess(processId, eslintPromise, command);
            }
            else {
                // Fallback to just running the promise
                await eslintPromise;
            }
        };
        this.makePrompt = async (entryPoint, addableFiles, platform) => {
            await (0, makePrompt_1.makePromptInternal)(this.summary, this.name, entryPoint, addableFiles, platform);
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
                console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`tsc > ${src}`)));
            }
            else {
                console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`tsc > ${src} failed ${failures} times`)));
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
                console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`eslint > ${src}`)));
            }
            else {
                console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`eslint > ${src} failed ${failures} times`)));
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
            // note: this path is different from the one used by front end
            const summaryPath = `./testeranto/reports/${this.name}/summary.json`;
            const summaryData = JSON.stringify(this.summary, null, 2);
            fs_1.default.writeFileSync(summaryPath, summaryData);
            // Broadcast the update
            this.broadcast({
                type: "summaryUpdate",
                data: this.summary,
            });
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
exports.PM_WithEslintAndTsc = PM_WithEslintAndTsc;
