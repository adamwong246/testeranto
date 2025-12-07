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

  // console.log("getRunnables", tests, projectName);

  // initializedPayload.nodeEntryPoints = {};
  // initializedPayload.nodeEntryPointSidecars = {};
  // initializedPayload.webEntryPoints = {};
  // initializedPayload.webEntryPointSidecars = {};
  // initializedPayload.pureEntryPoints = {};
  // initializedPayload.pureEntryPointSidecars = {};
  // initializedPayload.golangEntryPoints = {};
  // initializedPayload.golangEntryPointSidecars = {};
  // initializedPayload.pythonEntryPoints = {};
  // initializedPayload.pythonEntryPointSidecars = {};

  // return tests.reduce((pt, cv, cndx, cry) => {
  //   if (cv[1] === "node") {
  //     pt.nodeEntryPoints[cv[0]] = path.resolve(
  //       `./testeranto/bundles/node/${projectName}/${cv[0]
  //         .split(".")
  //         .slice(0, -1)
  //         .concat("mjs")
  //         .join(".")}`
  //     );
  //   } else if (cv[1] === "web") {
  //     pt.webEntryPoints[cv[0]] = path.resolve(
  //       `./testeranto/bundles/web/${projectName}/${cv[0]
  //         .split(".")
  //         .slice(0, -1)
  //         .concat("mjs")
  //         .join(".")}`
  //     );
  //   } else if (cv[1] === "pure") {
  //     pt.pureEntryPoints[cv[0]] = path.resolve(
  //       `./testeranto/bundles/pure/${projectName}/${cv[0]
  //         .split(".")
  //         .slice(0, -1)
  //         .concat("mjs")
  //         .join(".")}`
  //     );
  //   } else if (cv[1] === "golang") {
  //     // For Go files, we'll use the original path since they're not compiled to JS
  //     pt.golangEntryPoints[cv[0]] = path.resolve(cv[0]);
  //   } else if (cv[1] === "python") {
  //     // For python files, use the original Python file path
  //     pt.pythonEntryPoints[cv[0]] = path.resolve(cv[0]);
  //   }

  //   //////////////////////////////////////////////////////////

  //   cv[3]
  //     .filter((t) => t[1] === "node")
  //     .forEach((t) => {
  //       pt.nodeEntryPointSidecars[`${t[0]}`] = path.resolve(
  //         `./testeranto/bundles/node/${projectName}/${cv[0]
  //           .split(".")
  //           .slice(0, -1)
  //           .concat("mjs")
  //           .join(".")}`
  //       );
  //     });
  //   cv[3]
  //     .filter((t) => t[1] === "web")
  //     .forEach((t) => {
  //       pt.webEntryPointSidecars[`${t[0]}`] = path.resolve(
  //         `./testeranto/bundles/web/${projectName}/${cv[0]
  //           .split(".")
  //           .slice(0, -1)
  //           .concat("mjs")
  //           .join(".")}`
  //       );
  //     });
  //   cv[3]
  //     .filter((t) => t[1] === "pure")
  //     .forEach((t) => {
  //       pt.pureEntryPointSidecars[`${t[0]}`] = path.resolve(
  //         `./testeranto/bundles/pure/${projectName}/${cv[0]
  //           .split(".")
  //           .slice(0, -1)
  //           .concat("mjs")
  //           .join(".")}`
  //       );
  //     });
  //   cv[3]
  //     .filter((t) => t[1] === "golang")
  //     .forEach((t) => {
  //       // For Go sidecars, use the original path
  //       pt.golangEntryPointSidecars[`${t[0]}`] = path.resolve(t[0]);
  //     });
  //   cv[3]
  //     .filter((t) => t[1] === "python")
  //     .forEach((t) => {
  //       // For python sidecars, use the original Python file path
  //       pt.pythonEntryPointSidecars[`${t[0]}`] = path.resolve(t[0]);
  //     });

  //   return pt;
  // }, initializedPayload as IRunnables);
};
