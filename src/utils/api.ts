/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISummary, IBuiltConfig } from "../Types";
import { getLogFilesForRuntime } from "./logFiles";

export const fetchProjectData = async (projectName: string) => {
  const [summaryRes, configRes] = await Promise.all([
    fetch(`reports/${projectName}/summary.json`),
    fetch("reports/config.json"),
  ]);

  return {
    summary: (await summaryRes.json()) as ISummary,
    config: (await configRes.json()) as IBuiltConfig,
  };
};

export const fetchTestData = async (
  projectName: string,
  filepath: string,
  runTime: string
): Promise<{
  // testData: any | null;
  logs: Record<string, string>;
  // typeErrors: string;
  // lintErrors: string;
  error: string | null;
}> => {
  const basePath = `reports/${projectName}/${filepath
    .split(".")
    .slice(0, -1)
    .join(".")}/${runTime}`;

  try {
    const logFiles = getLogFilesForRuntime(runTime);

    console.log("mark2", logFiles);

    const [testRes, ...logRes] = await Promise.all([
      fetch(`${basePath}/tests.json`),
      ...logFiles.map((f) => fetch(`${basePath}/${f}`)),
      fetch(`${basePath}/type_errors.txt`),
      fetch(`${basePath}/lint_errors.txt`),
    ]);

    const logs = {
      "tests.json": await (await fetch(`${basePath}/tests.json`)).json(),
      "type_errors.txt": await (
        await fetch(`${basePath}/type_errors.txt`)
      ).text(),
      "lint_errors.txt": await (
        await fetch(`${basePath}/lint_errors.txt`)
      ).text(),
      "exit.log": await (await fetch(`${basePath}/exit.log`)).text(),
    };

    if (runTime === "node") {
      logs["stdout.log"] = await (await fetch(`${basePath}/stdout.log`)).text();
      logs["stderr.log"] = await (await fetch(`${basePath}/stderr.log`)).text();
    }

    if (runTime === "web") {
      logs["info.log"] = await (await fetch(`${basePath}/info.log`)).text();
      logs["error.log"] = await (await fetch(`${basePath}/error.log`)).text();
      logs["debug.log"] = await (await fetch(`${basePath}/debug.log`)).text();
      logs["warn.log"] = await (await fetch(`${basePath}/warn.log`)).text();
    }

    // const logs = await logFiles.reduce(async (acc, file, i) => {
    //   acc[file.split(".")[0]] = await logRes[i].text();
    //   return acc;
    // }, {});

    if (!testRes.ok) {
      return {
        // testData: null,
        logs,
        // typeErrors: await logRes[logFiles.length].text(),
        // lintErrors: await logRes[logFiles.length + 1].text(),
        error:
          "Tests did not complete successfully. Please check the build and runtime logs for errors.",
      };
    }

    console.log("mark1", logs);
    return {
      // testData: await testRes.json(),
      logs,
      // typeErrors: await logRes[logFiles.length].text(),
      // lintErrors: await logRes[logFiles.length + 1].text(),
      error: null,
    };
  } catch (err) {
    return {
      // testData: null,
      logs: {},
      // typeErrors: "",
      // lintErrors: "",
      error: `Failed to load test data: ${
        err instanceof Error ? err.message : String(err)
      }`,
    };
  }
};
