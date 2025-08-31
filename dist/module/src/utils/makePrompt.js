import fs from "fs";
import path from "path";
import { promptPather } from "../utils";
import { getLogFilesForRuntime } from "./logFiles";
import { LOG_FILES } from "./logFiles";
const makePrompt = async (summary, name, entryPoint, addableFiles, runtime) => {
    summary[entryPoint].prompt = "?";
    const promptPath = promptPather(entryPoint, runtime, name);
    // Correct directory structure: testeranto/reports/<name>/<testname>/<runtime>/
    const testDir = path.join("testeranto", "reports", name, entryPoint.split(".").slice(0, -1).join("."), runtime);
    // Ensure directory exists
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }
    // Test result files
    const testPaths = path.join(testDir, LOG_FILES.TESTS);
    const lintPath = path.join(testDir, LOG_FILES.LINT_ERRORS);
    const typePath = path.join(testDir, LOG_FILES.TYPE_ERRORS);
    const messagePath = path.join(testDir, LOG_FILES.MESSAGE);
    try {
        await Promise.all([
            fs.promises.writeFile(promptPath, `
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

/read ${getLogFilesForRuntime(runtime)
                .map((p) => `${testDir}/${p}`)
                .join(" ")}
`),
            fs.promises.writeFile(messagePath, `
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
    summary[entryPoint].prompt = `aider --model deepseek/deepseek-chat --load testeranto/${name}/reports/${runtime}/${entryPoint
        .split(".")
        .slice(0, -1)
        .join(".")}/prompt.txt`;
};
// function logs(r: IRunTime) {
//   return getLogFilesForRuntime(r);
// }
// async function logsOfRuntime(
//   runTime: IRunTime,
//   testDir: string
// ): Promise<string> {
//   try {
//     const fileChecks = await Promise.all(
//       getLogFilesForRuntime(runTime).map(async (f) => {
//         const filePath = path.join(testDir, f);
//         try {
//           await fs.promises.access(filePath);
//           const content = await fs.promises.readFile(filePath, "utf-8");
//           return content;
//         } catch {
//           return null;
//         }
//       })
//     );
//     return fileChecks.filter(Boolean).join("\n");
//   } catch (e) {
//     console.error(`Error checking log files in ${testDir}`);
//     console.error(e);
//     return "";
//   }
// }
export const makePromptInternal = (summary, name, entryPoint, addableFiles, runTime) => {
    if (runTime === "node") {
        return makePrompt(summary, name, entryPoint, addableFiles, "node");
    }
    if (runTime === "web") {
        return makePrompt(summary, name, entryPoint, addableFiles, "web");
    }
    if (runTime === "pure") {
        return makePrompt(summary, name, entryPoint, addableFiles, "pure");
    }
};
