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
const utils_1 = require("./utils");
const PM_WithBuild_1 = require("./PM_WithBuild");
const eslint = new eslint_1.ESLint();
const formatter = await eslint.loadFormatter("./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs");
class PM_WithEslintAndTsc extends PM_WithBuild_1.PM_WithBuild {
    constructor(configs, name, mode) {
        super(configs, name, mode);
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
                        outDir: (0, utils_1.tscPather)(entrypoint, platform, this.projectName),
                        noEmit: true,
                    },
                    include: addableFiles,
                });
                const tscPath = (0, utils_1.tscPather)(entrypoint, platform, this.projectName);
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
            this.addPromiseProcess(processId, tscPromise, command, "build-time", entrypoint);
        };
        this.eslintCheck = async ({ entrypoint, addableFiles, platform, }) => {
            const processId = `eslint-${entrypoint}-${Date.now()}`;
            const command = `eslint check for ${entrypoint}`;
            const eslintPromise = (async () => {
                try {
                    this.lintIsRunning(entrypoint);
                }
                catch (e) {
                    throw new Error(`Error in eslintCheck: ${e.message}`);
                }
                const filepath = (0, utils_1.lintPather)(entrypoint, platform, this.projectName);
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
            this.addPromiseProcess(processId, eslintPromise, command, "build-time", entrypoint);
        };
        this.typeCheckIsRunning = (src) => {
            if (!this.summary[src]) {
                throw `this.summary[${src}] is undefined`;
            }
            this.summary[src].typeErrors = "?";
        };
        this.typeCheckIsNowDone = (src, failures) => {
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
            this.summary[src].staticErrors = "?";
            this.writeBigBoard();
        };
        this.lintIsNowDone = (src, failures) => {
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
            this.summary[src].runTimeErrors = "?";
            this.writeBigBoard();
        };
        this.bddTestIsNowDone = (src, failures) => {
            this.summary[src].runTimeErrors = failures;
            this.writeBigBoard();
            this.checkForShutdown();
        };
    }
}
exports.PM_WithEslintAndTsc = PM_WithEslintAndTsc;
