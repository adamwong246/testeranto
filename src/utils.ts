// import { configs } from "eslint-plugin-react";
import path from "path";
import { IBuiltConfig, IRunTime } from "./lib/types";

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
    `type_errors.exitcode`
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
    `lint_errors.exitcode`
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
    `exitcode`
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
