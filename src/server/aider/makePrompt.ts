import fs from "fs";
import path from "path";

import { promptPather } from "../utils";
import { IRunTime, ISummary } from "../../Types";
import { LOG_FILES, getLogFilesForRuntime } from "../../clients/utils/logFiles";

export const makePrompt = async (
  summary: ISummary,
  name: string,
  entryPoint: string,
  addableFiles: string[],
  runTime: IRunTime
) => {
  if (summary) {
    summary[entryPoint].prompt = "?";
  } else {
    console.error("summary is wrong?");
  }

  const promptPath = promptPather(entryPoint, runTime, name);

  // Correct directory structure: testeranto/reports/<name>/<testname>/<runtime>/
  const testDir = path.join(
    "testeranto",
    "reports",
    name,
    entryPoint.split(".").slice(0, -1).join("."),
    runTime
  );

  const testPaths = path.join(testDir, LOG_FILES.TESTS);
  const lintPath = path.join(testDir, LOG_FILES.LINT_ERRORS);
  const typePath = path.join(testDir, LOG_FILES.TYPE_ERRORS);
  const messagePath = path.join(testDir, LOG_FILES.MESSAGE);

  try {
    await Promise.all([
      fs.promises.writeFile(
        promptPath,
        `
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

/read ${getLogFilesForRuntime(runTime)
          .map((p) => `${testDir}/${p}`)
          .join("\n/read ")}
`
      ),
      fs.promises.writeFile(
        messagePath,
        `
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
`
      ),
    ]);
  } catch (e) {
    console.error(`Failed to write prompt files at ${testDir}`);
    console.error(e);
    throw e;
  }

  summary[
    entryPoint
  ].prompt = `aider --model deepseek/deepseek-chat --load testeranto/${name}/reports/${runTime}/${entryPoint
    .split(".")
    .slice(0, -1)
    .join(".")}/prompt.txt`;
};
