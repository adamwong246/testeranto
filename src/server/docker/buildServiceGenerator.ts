/* eslint-disable @typescript-eslint/no-explicit-any */

import { IRunTime } from "../../Types";

export function createBuildService(
  runtime: IRunTime,
  dockerfileDir: string,
  testsName: string
): Record<string, any> {
  // Determine the Dockerfile path based on runtime
  let dockerfilePath: string;

  if (runtime === "node") {
    dockerfilePath = `testeranto/bundles/allTests/node/node.Dockerfile`;
  } else if (runtime === "web") {
    dockerfilePath = `testeranto/bundles/allTests/web/web.Dockerfile`;
  } else if (runtime === "golang") {
    dockerfilePath = `testeranto/bundles/allTests/golang/golang.Dockerfile`;
  } else if (runtime === "python") {
    dockerfilePath = `testeranto/bundles/allTests/python/python.Dockerfile`;
  } else {
    dockerfilePath = `${dockerfileDir}/Dockerfile`;
  }

  // Build the service configuration matching the old format (context: /Users/adam/Code/testeranto)
  const serviceConfig: any = {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: dockerfilePath,
    },
    volumes: ["./testeranto/metafiles:/workspace/testeranto/metafiles"],
    image: `bundles-${runtime}-build:latest`,
    restart: "no",
  };

  return {
    [`${runtime}-build`]: serviceConfig,
  };
}
