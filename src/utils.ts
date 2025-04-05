import path from "path";

import { IRunTime, IBuiltConfig } from "./lib";

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

export const tscPather = (entryPoint: string, platform: "web" | "node") => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `type_errors.txt`
  );
};

export const tscExitCodePather = (
  entryPoint: string,
  platform: "web" | "node"
) => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `type_errors.txt`
  );
};

export const lintPather = (entryPoint: string, platform: "web" | "node") => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `lint_errors.json`
  );
};

export const lintExitCodePather = (
  entryPoint: string,
  platform: "web" | "node"
) => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `lint_errors.txt`
  );
};

export const bddPather = (entryPoint: string, platform: "web" | "node") => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `tests.json`
  );
};

export const bddExitCodePather = (
  entryPoint: string,
  platform: "web" | "node"
) => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `bdd_errors.txt`
  );
};

export const promptPather = (entryPoint: string, platform: "web" | "node") => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `prompt.txt`
  );
};
