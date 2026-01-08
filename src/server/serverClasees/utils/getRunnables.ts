import path from "path";
import { IRunnables } from "../../../lib/tiposkripto";
import { ITestconfig } from "../../../Types";

export const getRunnables = (
  config: ITestconfig,
  projectName: string
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
        `./testeranto/bundles/${projectName}/node/${cv[0]
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
        `./testeranto/bundles/${projectName}/web/${cv[0]
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
