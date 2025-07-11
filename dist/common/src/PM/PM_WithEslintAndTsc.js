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
            this.typeCheckIsRunning(entrypoint);
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
            fs_1.default.writeFileSync((0, utils_1.lintPather)(entrypoint, platform, this.name), await formatter.format(results));
            this.lintIsNowDone(entrypoint, results.length);
        };
        this.makePrompt = async (entryPoint, addableFiles, platform) => {
            this.summary[entryPoint].prompt = "?";
            const promptPath = (0, utils_1.promptPather)(entryPoint, platform, this.name);
            const testPaths = path_1.default.join("testeranto", "reports", this.name, platform, entryPoint.split(".").slice(0, -1).join("."), `tests.json`);
            const featuresPath = path_1.default.join("testeranto", "reports", this.name, platform, entryPoint.split(".").slice(0, -1).join("."), `featurePrompt.txt`);
            fs_1.default.writeFileSync(promptPath, `
${addableFiles
                .map((x) => {
                return `/add ${x}`;
            })
                .join("\n")}

/read ${(0, utils_1.lintPather)(entryPoint, platform, this.name)}
/read ${(0, utils_1.tscPather)(entryPoint, platform, this.name)}
/read ${testPaths}

/load ${featuresPath}

/code Fix the failing tests described in ${testPaths}. Correct any type signature errors described in the files ${(0, utils_1.tscPather)(entryPoint, platform, this.name)}. Implement any method which throws "Function not implemented. Resolve the lint errors described in ${(0, utils_1.lintPather)(entryPoint, platform, this.name)}"
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
            fs_1.default.writeFileSync(`./testeranto/reports/${this.name}/summary.json`, JSON.stringify(this.summary, null, 2));
        };
        this.checkForShutdown = () => {
            console.log(ansi_colors_1.default.inverse(`checkForShutdown`));
            this.writeBigBoard();
            if (this.mode === "dev")
                return;
            let inflight = false;
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].prompt === "?") {
                    console.log(ansi_colors_1.default.blue(ansi_colors_1.default.inverse(`🕕 prompt ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].runTimeError === "?") {
                    console.log(ansi_colors_1.default.blue(ansi_colors_1.default.inverse(`🕕 runTimeError ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].staticErrors === "?") {
                    console.log(ansi_colors_1.default.blue(ansi_colors_1.default.inverse(`🕕 staticErrors ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].typeErrors === "?") {
                    console.log(ansi_colors_1.default.blue(ansi_colors_1.default.inverse(`🕕 typeErrors ${k}`)));
                    inflight = true;
                }
            });
            this.writeBigBoard();
            if (!inflight) {
                this.browser.disconnect().then(() => {
                    console.log(ansi_colors_1.default.inverse(`${this.name} has been tested. Goodbye.`));
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
exports.PM_WithEslintAndTsc = PM_WithEslintAndTsc;
