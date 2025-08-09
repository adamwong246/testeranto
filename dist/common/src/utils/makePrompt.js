"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePrompt = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
const makePrompt = async (summary, name, entryPoint, addableFiles, runtime) => {
    summary[entryPoint].prompt = "?";
    const promptPath = (0, utils_1.promptPather)(entryPoint, runtime, name);
    const testPaths = path_1.default.join("testeranto", "reports", name, entryPoint.split(".").slice(0, -1).join("."), runtime, `tests.json`);
    // const featuresPath = path.join(
    //   "testeranto",
    //   "reports",
    //   name,
    //   platform,
    //   entryPoint.split(".").slice(0, -1).join("."),
    //   `featurePrompt.txt`
    // );
    // const logPath = path.join(
    //   "testeranto",
    //   "reports",
    //   name,
    //   entryPoint.split(".").slice(0, -1).join("."),
    //   platform,
    //   `logs.txt`
    // );
    const lintPath = path_1.default.join("testeranto", "reports", name, entryPoint.split(".").slice(0, -1).join("."), runtime, `lint_errors.txt`);
    const typePath = path_1.default.join("testeranto", "reports", name, entryPoint.split(".").slice(0, -1).join("."), runtime, `type_errors.txt`);
    const messagePath = path_1.default.join("testeranto", "reports", name, entryPoint.split(".").slice(0, -1).join("."), runtime, `message.txt`);
    const p = path_1.default.join("testeranto", "reports", name, entryPoint.split(".").slice(0, -1).join("."), runtime);
    fs_1.default.writeFileSync(promptPath, `
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
/read ${typePath}
/read ${lintPath}

/read ${logsOfRuntime(runtime, p)}
`);
    fs_1.default.writeFileSync(messagePath, `
There are 3 types of test reports. 
1) bdd (highest priority)
2) type checker
3) static analysis (lowest priority)

"tests.json" is the detailed result of the bdd tests.
if these files do not exist, then something has gone badly wrong and needs to be addressed.

"type_errors.txt" is the result of the type checker.
if this file does not exist, then type check passed without errors;

"lint_errors.txt" is the result of the static analysis.
if this file does not exist, then static analysis passed without errors;

BDD failures are the highest priority. Focus on passing BDD tests before addressing other concerns.
Do not add error throwing/catching to the tests themselves. 
`);
    summary[entryPoint].prompt = `aider --model deepseek/deepseek-chat --load testeranto/${name}/reports/${runtime}/${entryPoint
        .split(".")
        .slice(0, -1)
        .join(".")}/prompt.txt`;
};
exports.makePrompt = makePrompt;
function logsOfRuntime(runtime, p) {
    if (runtime === "node") {
        return ["stdout.log", "stderr.log", "exit.log"]
            .map((f) => `${p}/${f}`)
            .join(" ");
    }
    if (runtime === "web") {
        return ["log.log", "debug.log", "info.log", "error.log"]
            .map((f) => `${p}/${f}`)
            .join(" ");
    }
    if (runtime === "pure") {
        return ["exit.log"].map((f) => `${p}/${f}`).join(" ");
    }
    throw new Error("unknown runtime");
}
