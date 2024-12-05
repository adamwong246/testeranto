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
