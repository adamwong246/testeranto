import { IBuiltConfig } from "../../../Types";

export const webDockerCompose = (config: IBuiltConfig) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: `testeranto/bundles/allTests/web/web.Dockerfile`,
      tags: [`bundles-web-build:latest`],
    },
    volumes: [
      "/Users/adam/Code/testeranto/testeranto:/workspace/testeranto",
      "/Users/adam/Code/testeranto/src:/workspace/src",
      "/Users/adam/Code/testeranto/example:/workspace/example",
      "/Users/adam/Code/testeranto/dist:/workspace/dist",
      "/Users/adam/Code/testeranto/allTests.ts:/workspace/allTests.ts",
      "/Users/adam/Code/testeranto/allTestsUtils.ts:/workspace/allTestsUtils.ts",
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
    ports: [
      "9222:9222", // Expose Chrome's remote debugging port
    ],
    command: [
      "sh",
      "-c",
      `TEST_NAME=allTests WS_PORT=${config.httpPort} yarn tsx dist/prebuild/server/runtimes/web/web.mjs allTests.ts dev || echo "Build process exited with code $?, but keeping container alive for health checks";`,
    ],
  };
};

export const webDockerFile = `

FROM node:20.19.4-alpine
WORKDIR /workspace
COPY ./tsconfig*.json ./
COPY ./package.json ./package.json
COPY ./.yarnrc.yml ./

# Install system dependencies
RUN apk add --no-cache python3 make g++ libxml2-utils

# Install dependencies
RUN yarn install

`;

export default webDockerFile;
