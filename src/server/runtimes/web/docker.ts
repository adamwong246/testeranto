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
      `TEST_NAME=allTests WS_PORT=${config.httpPort} yarn tsx dist/prebuild/server/runtimes/web/web.mjs allTests.ts '{"ports": [1111]}' || echo "Build process exited with code $?, but keeping container alive for health checks";`,
    ],
  };
};

export const webBddCommand = (port) => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  // The test should connect to chromium via remote debugging
  // We'll use a script that waits for chromium to be ready and then runs the tests
  return `
    # Wait for chromium to be ready
    until curl -f http://chromium:9222/json/version >/dev/null 2>&1; do
      echo "Waiting for chromium to be ready..."
      sleep 1
    done
    
    # Run the test
    TEST_NAME=allTests WS_PORT=${port} ENV=web node testeranto/bundles/allTests/web/example/Calculator.test.mjs allTests.ts '${jsonStr}'
  `;
}

export const webDockerFile = `

FROM node:20.19.4-alpine
WORKDIR /workspace
COPY ./tsconfig*.json ./
COPY ./package.json ./package.json
COPY ./.yarnrc.yml ./

RUN apk add --no-cache \
    --repository dl-cdn.alpinelinux.org \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    python3 make g++ libxml2-utils

RUN yarn install
`;

export default webDockerFile;
