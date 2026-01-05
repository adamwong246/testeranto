import { IBuiltConfig } from "../../../Types";

// echo "Starting build process for node...";
//
export const nodeDockerComposeFile = (config: IBuiltConfig) => {
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/node/node.Dockerfile`,
      tags: [`bundles-node-build:latest`],
      args: {
        NODE_MJS_HASH: "cab84cac12fc3913ce45e7e563425b8bb",
      },
    },
    volumes: [
      "/Users/adam/Code/testeranto/testeranto:/workspace/testeranto",
      "/Users/adam/Code/testeranto/src:/workspace/src",
      "/Users/adam/Code/testeranto/example:/workspace/example",
      "/Users/adam/Code/testeranto/dist:/workspace/dist",
      "/Users/adam/Code/testeranto/allTests.ts:/workspace/allTests.ts",
      "/Users/adam/Code/testeranto/allTestsUtils.ts:/workspace/allTestsUtils.ts",
      // "node_modules:/workspace/node_modules",
      // config.check["node"],
    ],
    image: `bundles-node-build:latest`,
    restart: "unless-stopped",
    environment: {
      BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/node`,
      METAFILES_DIR: `/workspace/testeranto/metafiles/node`,
      // Don't serve files - Server_TCP will handle that
      //   ESBUILD_SERVE_PORT: "0", // Disable esbuild serve
      IN_DOCKER: "true", // Indicate we're running in Dockerç
    },
    extra_hosts: ["host.docker.internal:host-gateway"],
    command: [
      "sh",
      "-c",
      `TEST_NAME=allTests WS_PORT=${config.httpPort} yarn tsx dist/prebuild/server/runtimes/node/node.mjs allTests.ts dev || echo "Build process exited with code $?, but keeping container alive for health checks";`,
    ],
    healthcheck: {
      test: [
        "CMD-SHELL",
        `[ -f /workspace/testeranto/metafiles/node/allTests.json ] && echo "healthy" || exit 1`,
      ],
      interval: "10s",
      timeout: "30s",
      retries: 10,
      start_period: "60s",
    },
  };
};

export const nodeDockerFile = `
FROM node:20.19.4-alpine
WORKDIR /workspace
COPY ./tsconfig*.json ./
COPY ./package.json ./package.json
COPY ./.yarnrc.yml ./

RUN ls -al

# Install system dependencies
RUN apk add --no-cache python3 make g++ libxml2-utils

# Install dependencies
RUN yarn install
`;

export default nodeDockerFile;

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

// import { baseNodeImage } from "../../nodeVersion";

// export const nodeDockerCmd = `FROM ${baseNodeImage}
// WORKDIR /workspace
// # Install libxml2-utils for xmllint and netcat-openbsd for network checks
// RUN apk add --update --no-cache libxml2-utils netcat-openbsd
// # Reinstall esbuild for Linux platform
// RUN rm -f .npmrc .npmrc.* || true && \
//     npm cache clean --force && \
//     npm config set registry https://registry.npmjs.org/ && \
//     npm config set always-auth false && \
//     npm config delete _auth 2>/dev/null || true && \
//     npm config delete _authToken 2>/dev/null || true && \
//     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true && \
//     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
// RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
// RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts
// `;

// # Remove any .npmrc files
//         rm -f .npmrc .npmrc.* || true && \
//         # Clear npm cache and authentication
//         npm cache clean --force && \
//         # Clear any npm authentication
//         npm config delete _auth 2>/dev/null || true && \
//         npm config delete _authToken 2>/dev/null || true && \
//         npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true && \
//         npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true && \
//         npm config delete always-auth 2>/dev/null || true && \
//         npm config delete registry 2>/dev/null || true && \
//         npm config set registry https://registry.npmjs.org/ && \
//         npm config set always-auth false && \
//         npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo "npm install may have warnings";
//         echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...';
//         npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts || echo "esbuild installation may have issues";
//         npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts || echo "esbuild-sass-plugin installation may have issues";
//         echo 'Creating output directory...';
//         mkdir -p /workspace/testeranto/bundles/allTests/node;
//         mkdir -p /workspace/testeranto/metafiles/node;
//         echo 'BUNDLES_DIR env:' "$BUNDLES_DIR";
