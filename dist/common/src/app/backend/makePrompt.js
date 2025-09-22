"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePrompt = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const logFiles_1 = require("../../utils/logFiles");
const logFiles_2 = require("../../utils/logFiles");
const makePrompt = async (summary, name, entryPoint, addableFiles, runTime) => {
    summary[entryPoint].prompt = "?";
    const promptPath = (0, utils_1.promptPather)(entryPoint, runTime, name);
    // Correct directory structure: testeranto/reports/<name>/<testname>/<runtime>/
    const testDir = path_1.default.join("testeranto", "reports", name, entryPoint.split(".").slice(0, -1).join("."), runTime);
    const testPaths = path_1.default.join(testDir, logFiles_2.LOG_FILES.TESTS);
    const lintPath = path_1.default.join(testDir, logFiles_2.LOG_FILES.LINT_ERRORS);
    const typePath = path_1.default.join(testDir, logFiles_2.LOG_FILES.TYPE_ERRORS);
    const messagePath = path_1.default.join(testDir, logFiles_2.LOG_FILES.MESSAGE);
    try {
        await Promise.all([
            fs_1.default.promises.writeFile(promptPath, `
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

/read ${(0, logFiles_1.getLogFilesForRuntime)(runTime)
                .map((p) => `${testDir}/${p}`)
                .join("\n/read ")}
`),
            fs_1.default.promises.writeFile(messagePath, `
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
`),
        ]);
    }
    catch (e) {
        console.error(`Failed to write prompt files at ${testDir}`);
        console.error(e);
        throw e;
    }
    summary[entryPoint].prompt = `aider --model deepseek/deepseek-chat --load testeranto/${name}/reports/${runTime}/${entryPoint
        .split(".")
        .slice(0, -1)
        .join(".")}/prompt.txt`;
};
exports.makePrompt = makePrompt;
