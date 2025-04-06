import path from "path";

import { IRunTime, IBuiltConfig } from "./lib";

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
