import path from "path";

import { IRunTime, IBuiltConfig, IRunnables, ITestTypes } from "./lib";

export type ISummary = Record<
  string,
  {
    runTimeError?: number | "?";
    typeErrors?: number | "?";
    staticErrors?: number | "?";
    prompt?: string | "?";
  }
>;

export const destinationOfRuntime = (
  f: string,
  r: IRunTime,
  configs: IBuiltConfig
) => {
  return path
    .normalize(`${configs.buildDir}/${r}/${f}`)
    .split(".")
    .slice(0, -1)
    .join(".");
};

export const tscPather = (
  entryPoint: string,
  platform: "web" | "node",
  projectName: string
) => {
  return path.join(
    "testeranto",
    "reports",
    projectName,
    entryPoint.split(".").slice(0, -1).join("."),
    platform,
    `type_errors.txt`
  );
};

export const lintPather = (
  entryPoint: string,
  platform: "web" | "node",
  projectName: string
) => {
  return path.join(
    "testeranto",
    "reports",
    projectName,
    entryPoint.split(".").slice(0, -1).join("."),
    platform,
    `lint_errors.json`
  );
};

export const bddPather = (
  entryPoint: string,
  platform: "web" | "node",
  projectName: string
) => {
  return path.join(
    "testeranto",
    "reports",
    projectName,
    entryPoint.split(".").slice(0, -1).join("."),
    platform,
    `tests.json`
  );
};

export const promptPather = (
  entryPoint: string,
  platform: "web" | "node",
  projectName: string
) => {
  return path.join(
    "testeranto",
    "reports",
    projectName,
    entryPoint.split(".").slice(0, -1).join("."),
    platform,
    `prompt.txt`
  );
};

export const getRunnables = (
  tests: ITestTypes[],
  projectName: string,
  payload = {
    nodeEntryPoints: {},
    webEntryPoints: {},
    importEntryPoints: {},
  }
): IRunnables => {
  return tests.reduce((pt, cv, cndx, cry) => {
    if (cv[1] === "node") {
      pt.nodeEntryPoints[cv[0]] = path.resolve(
        `./testeranto/bundles/node/${projectName}/${cv[0]
          .split(".")
          .slice(0, -1)
          .concat("mjs")
          .join(".")}`
      );
    } else if (cv[1] === "web") {
      pt.webEntryPoints[cv[0]] = path.resolve(
        `./testeranto/bundles/web/${projectName}/${cv[0]
          .split(".")
          .slice(0, -1)
          .concat("mjs")
          .join(".")}`
      );
    } else if (cv[1] === "pure") {
      pt.importEntryPoints[cv[0]] = path.resolve(
        `./testeranto/bundles/pure/${projectName}/${cv[0]
          .split(".")
          .slice(0, -1)
          .concat("mjs")
          .join(".")}`
      );
    }

    if (cv[3].length) {
      getRunnables(cv[3], testName, payload);
    }

    return pt;
  }, payload as IRunnables);
};
