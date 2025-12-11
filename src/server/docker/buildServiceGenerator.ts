/* eslint-disable @typescript-eslint/no-explicit-any */

import { IRunTime } from "../../Types";

export function createBuildService(
  runtime: IRunTime,
  dockerfileDir: string,
  testsName: string
): Record<string, any> {
  // Import the buildService function
  const buildService = require("./buildService").default;
  return {
    [`${runtime}-build`]: buildService(runtime)
  };
}
