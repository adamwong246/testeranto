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

// CMD ["sh", "-c", "echo 'Starting web build in watch mode...'; \
//   echo 'Installing dependencies in /workspace/node_modules...'; \
//   cd /workspace && \
//   rm -f .npmrc .npmrc.* || true && \
//   npm cache clean --force && \
//   npm config delete _auth 2>/dev/null || true && \
//   npm config delete _authToken 2>/dev/null || true && \
//   npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true && \
//   npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true && \
//   npm config delete always-auth 2>/dev/null || true && \
//   npm config delete registry 2>/dev/null || true && \
//   npm config set registry https://registry.npmjs.org/ && \
//   npm config set always-auth false && \
//   npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts || echo 'npm install may have warnings'; \
//   echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...'; \
//   npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts || echo 'esbuild installation may have issues'; \
//   npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts || echo 'esbuild-sass-plugin installation may have issues'; \
//   echo 'Creating output directory...'; \
//   mkdir -p /workspace/testeranto/bundles/allTests/web; \
//   mkdir -p /workspace/testeranto/metafiles/web; \
//   echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; \
//   echo 'Starting build process for web...'; \
//   TEST_NAME=allTests WS_PORT=3456 yarn tsx dist/prebuild/server/runtimes/web/web.mjs allTests.ts dev || echo 'Build process exited with code $?, but keeping container alive for health checks'"]
