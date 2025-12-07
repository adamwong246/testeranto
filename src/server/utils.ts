/* eslint-disable @typescript-eslint/no-unused-vars */
import path from "path";
import { IRunnables } from "../lib";
import { IRunTime, IBuiltConfig, ITestTypes, ITestconfig } from "../Types";

export const webEvaluator = (d, webArgz) => {
  return `
import('${d}').then(async (x) => {
  try {
    return await (await x.default).receiveTestResourceConfig(${webArgz})
  } catch (e) {
    console.log("web run failure", e.toString())
  }
})
`;
};
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
  platform: IRunTime,
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
  platform: IRunTime,
  projectName: string
) => {
  return path.join(
    "testeranto",
    "reports",
    projectName,
    entryPoint.split(".").slice(0, -1).join("."),
    platform,
    `lint_errors.txt`
  );
};

export const bddPather = (
  entryPoint: string,
  platform: IRunTime,
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
  platform: IRunTime,
  projectName: string
) => {
  const e = entryPoint.split(".").slice(0, -1).join(".");
  return path.join(
    "testeranto",
    "reports",
    projectName,
    e,
    platform,
    `prompt.txt`
  );
};

export const getRunnables = (
  config: ITestconfig,
  projectName: string
  // payload = {
  //   nodeEntryPoints: {},
  //   nodeEntryPointSidecars: {},
  //   webEntryPoints: {},
  //   webEntryPointSidecars: {},
  //   pureEntryPoints: {},
  //   pureEntryPointSidecars: {},
  //   golangEntryPoints: {},
  //   golangEntryPointSidecars: {},
  //   pythonEntryPoints: {},
  //   pythonEntryPointSidecars: {},
  // }
): IRunnables => {
  // Ensure all properties are properly initialized
  return {
    // pureEntryPoints: payload.pureEntryPoints || {},
    golangEntryPoints: Object.entries(config.golang.tests).reduce((pt, cv) => {
      pt[cv[0]] = path.resolve(cv[0]);
      return pt;
    }, {}),
    // golangEntryPointSidecars: payload.golangEntryPointSidecars || {},
    nodeEntryPoints: Object.entries(config.node.tests).reduce((pt, cv) => {
      pt[cv[0]] = path.resolve(
        `./testeranto/bundles/node/${projectName}/${cv[0]
          .split(".")
          .slice(0, -1)
          .concat("mjs")
          .join(".")}`
      );
      return pt;
    }, {} as Record<string, string>),
    // nodeEntryPointSidecars: payload.nodeEntryPointSidecars || {},
    pythonEntryPoints: Object.entries(config.python.tests).reduce((pt, cv) => {
      pt[cv[0]] = path.resolve(cv[0]);
      return pt;
    }, {}),
    // pythonEntryPointSidecars: payload.pythonEntryPointSidecars || {},
    webEntryPoints: Object.entries(config.web.tests).reduce((pt, cv) => {
      pt[cv[0]] = path.resolve(
        `./testeranto/bundles/web/${projectName}/${cv[0]
          .split(".")
          .slice(0, -1)
          .concat("mjs")
          .join(".")}`
      );
      return pt;
    }, {} as Record<string, string>),
    // webEntryPointSidecars: payload.webEntryPointSidecars || {},
  };
};
