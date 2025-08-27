/* eslint-disable @typescript-eslint/no-unused-vars */
import path from "path";

import { IBuiltConfig, IRunTime, ITestTypes } from "./Types";
import { IRunnables } from "./lib";

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
    pythonEntryPoints: {},
    nodeEntryPoints: {},
    nodeEntryPointSidecars: {},
    webEntryPoints: {},
    webEntryPointSidecars: {},
    pureEntryPoints: {},
    pureEntryPointSidecars: {},
    golangEntryPoints: {},
    golangEntryPointSidecars: {},
  }
): IRunnables => {
  // Ensure all properties are properly initialized
  const initializedPayload = {
    pythonEntryPoints: payload.pythonEntryPoints || {},
    nodeEntryPoints: payload.nodeEntryPoints || {},
    nodeEntryPointSidecars: payload.nodeEntryPointSidecars || {},
    webEntryPoints: payload.webEntryPoints || {},
    webEntryPointSidecars: payload.webEntryPointSidecars || {},
    pureEntryPoints: payload.pureEntryPoints || {},
    pureEntryPointSidecars: payload.pureEntryPointSidecars || {},
    golangEntryPoints: payload.golangEntryPoints || {},
    golangEntryPointSidecars: payload.golangEntryPointSidecars || {},
  };
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
      pt.pureEntryPoints[cv[0]] = path.resolve(
        `./testeranto/bundles/pure/${projectName}/${cv[0]
          .split(".")
          .slice(0, -1)
          .concat("mjs")
          .join(".")}`
      );
    } else if (cv[1] === "golang") {
      // For Go files, we'll use the original path since they're not compiled to JS
      pt.golangEntryPoints[cv[0]] = path.resolve(cv[0]);
    }

    //////////////////////////////////////////////////////////

    cv[3]
      .filter((t) => t[1] === "node")
      .forEach((t) => {
        pt.nodeEntryPointSidecars[`${t[0]}`] = path.resolve(
          `./testeranto/bundles/node/${projectName}/${cv[0]
            .split(".")
            .slice(0, -1)
            .concat("mjs")
            .join(".")}`
        );
      });
    cv[3]
      .filter((t) => t[1] === "web")
      .forEach((t) => {
        pt.webEntryPointSidecars[`${t[0]}`] = path.resolve(
          `./testeranto/bundles/web/${projectName}/${cv[0]
            .split(".")
            .slice(0, -1)
            .concat("mjs")
            .join(".")}`
        );
      });
    cv[3]
      .filter((t) => t[1] === "pure")
      .forEach((t) => {
        pt.pureEntryPointSidecars[`${t[0]}`] = path.resolve(
          `./testeranto/bundles/pure/${projectName}/${cv[0]
            .split(".")
            .slice(0, -1)
            .concat("mjs")
            .join(".")}`
        );
      });
    cv[3]
      .filter((t) => t[1] === "golang")
      .forEach((t) => {
        // For Go sidecars, use the original path
        pt.golangEntryPointSidecars[`${t[0]}`] = path.resolve(t[0]);
      });

    return pt;
  }, initializedPayload as IRunnables);
};
