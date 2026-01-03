/* eslint-disable @typescript-eslint/no-unused-vars */
import { IBuiltConfig } from "../../../Types";

export const webDockerCompose = (config: IBuiltConfig) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: `testeranto/bundles/allTests/web/web.Dockerfile`,
      tags: [`bundles-web-build:latest`],
    },
    volumes: [
      `${process.cwd()}:/workspace`,
      "node_modules:/workspace/node_modules",
    ],
    image: `bundles-web-build:latest`,
    restart: "no",
    environment: {
      BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/web`,
      METAFILES_DIR: `/workspace/testeranto/metafiles/web`,
      ESBUILD_SERVE_PORT: "0",
      IN_DOCKER: "true",
      CHROMIUM_PATH: "/usr/bin/chromium-browser",
    },
    extra_hosts: ["host.docker.internal:host-gateway"],
    command: [
      "sh",
      "-c",
      "TEST_NAME=allTests WS_PORT=3456 node dist/prebuild/server/runtimes/web/web.mjs allTests.ts dev || echo 'Build process exited with code $?, but keeping container alive for health checks'"
    ],
  };
};
