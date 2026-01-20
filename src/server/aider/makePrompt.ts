import fs from "fs";
import path from "path";
import { ISummary, IRunTime } from "../../Types";

// import { promptPather } from "../utils";
// import { IRunTime, ISummary } from "../../Types";
// import { LOG_FILES, getLogFilesForRuntime } from "../../clients/utils/logFiles";

export type RuntimeName = "node" | "web" | "pure" | "python" | "golang";

export const STANDARD_LOGS = {
  TESTS: "tests.json",
  TYPE_ERRORS: "type_errors.txt",
  LINT_ERRORS: "lint_errors.txt",
  EXIT: "exit.log",
  MESSAGE: "message.txt",
  PROMPT: "prompt.txt",
  BUILD: "build.json",
} as const;

export const RUNTIME_SPECIFIC_LOGS = {
  node: {
    STDOUT: "stdout.log",
    STDERR: "stderr.log",
  },
  web: {
    INFO: "info.log",
    ERROR: "error.log",
    WARN: "warn.log",
    DEBUG: "debug.log",
  },
  pure: {}, // No runtime-specific logs for pure
  python: {
    STDOUT: "stdout.log",
    STDERR: "stderr.log",
  },
  golang: {
    STDOUT: "stdout.log",
    STDERR: "stderr.log",
  },
} as const;

export const ALL_LOGS = {
  ...STANDARD_LOGS,
  ...Object.values(RUNTIME_SPECIFIC_LOGS).reduce(
    (acc, logs) => ({ ...acc, ...logs }),
    {}
  ),
} as const;

export const getRuntimeLogs = (runtime: RuntimeName) => {
  return {
    standard: Object.values(STANDARD_LOGS),
    runtimeSpecific: Object.values(RUNTIME_SPECIFIC_LOGS[runtime]),
  };
};

export type RuntimeLogs = typeof RUNTIME_SPECIFIC_LOGS;
export type LogFileType<T extends RuntimeName> = keyof RuntimeLogs[T];

export function getLogFilesForRuntime(runtime: RuntimeName): string[] {
  const { standard, runtimeSpecific } = getRuntimeLogs(runtime);
  return [...standard, ...runtimeSpecific];
}

const LOG_FILES = {
  TESTS: "tests.json",
  TYPE_ERRORS: "type_errors.txt",
  LINT_ERRORS: "lint_errors.txt",
  EXIT: "exit.log",
  MESSAGE: "message.txt",
  PROMPT: "prompt.txt",
  STDOUT: "stdout.log",
  STDERR: "stderr.log",
  INFO: "info.log",
  ERROR: "error.log",
  WARN: "warn.log",
  DEBUG: "debug.log",
} as const;

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
