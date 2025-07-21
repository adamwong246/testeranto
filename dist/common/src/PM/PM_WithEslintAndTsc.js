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
const path_1 = __importDefault(require("path"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const eslint_1 = require("eslint");
const tsc_prog_1 = __importDefault(require("tsc-prog"));
const utils_1 = require("../utils");
const base_js_1 = require("./base.js");
const eslint = new eslint_1.ESLint();
const formatter = await eslint.loadFormatter("./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs");
class PM_WithEslintAndTsc extends base_js_1.PM_Base {
    constructor(configs, name, mode) {
        super(configs);
        this.summary = {};
        this.tscCheck = async ({ entrypoint, addableFiles, platform, }) => {
            console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`tsc < ${entrypoint}`)));
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
            const program = tsc_prog_1.default.createProgramFromConfig({
                basePath: process.cwd(), // always required, used for relative paths
                configFilePath: "tsconfig.json", // config to inherit from (optional)
                compilerOptions: {
                    outDir: (0, utils_1.tscPather)(entrypoint, platform, this.name),
                    // declaration: true,
                    // skipLibCheck: true,
                    noEmit: true,
                },
                include: addableFiles, //["src/**/*"],
                // exclude: ["node_modules", "../testeranto"],
                // exclude: ["**/*.test.ts", "**/*.spec.ts"],
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
        };
        this.eslintCheck = async (entrypoint, platform, addableFiles) => {
            console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`eslint < ${entrypoint}`)));
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
            const results = (await eslint.lintFiles(addableFiles))
                .filter((r) => r.messages.length)
                .filter((r) => {
                return r.messages[0].ruleId !== null;
            })
                .map((r) => {
                delete r.source;
                return r;
            });
            fs_1.default.writeFileSync((0, utils_1.lintPather)(entrypoint, platform, this.name), await formatter.format(results));
            this.lintIsNowDone(entrypoint, results.length);
        };
        this.makePrompt = async (entryPoint, addableFiles, platform) => {
            this.summary[entryPoint].prompt = "?";
            const promptPath = (0, utils_1.promptPather)(entryPoint, platform, this.name);
            const testPaths = path_1.default.join("testeranto", "reports", this.name, entryPoint.split(".").slice(0, -1).join("."), platform, `tests.json`);
            const featuresPath = path_1.default.join("testeranto", "reports", this.name, platform, entryPoint.split(".").slice(0, -1).join("."), `featurePrompt.txt`);
            const logPath = path_1.default.join("testeranto", "reports", this.name, entryPoint.split(".").slice(0, -1).join("."), platform, `logs.txt`);
            const lintPath = path_1.default.join("testeranto", "reports", this.name, entryPoint.split(".").slice(0, -1).join("."), platform, `lint_errors.txt`);
            const typePath = path_1.default.join("testeranto", "reports", this.name, entryPoint.split(".").slice(0, -1).join("."), platform, `type_errors.txt`);
            const messagePath = path_1.default.join("testeranto", "reports", this.name, entryPoint.split(".").slice(0, -1).join("."), platform, `message.txt`);
            fs_1.default.writeFileSync(promptPath, `
${addableFiles
                .map((x) => {
                return `/add ${x}`;
            })
                .join("\n")}

/read ${testPaths}
/read ${logPath}
/read ${typePath}
/read ${lintPath}
`);
            fs_1.default.writeFileSync(messagePath, `Fix the failing tests described in ${testPaths} and ${logPath}. DO NOT refactor beyond what is necessary. Always prefer minimal changes, focusing mostly on keeping the BDD tests passing`);
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
            fs_1.default.writeFileSync(`./testeranto/reports/${this.name}/summary.json`, JSON.stringify(this.summary, null, 2));
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
