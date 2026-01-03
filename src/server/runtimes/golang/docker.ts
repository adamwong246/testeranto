import { IBuiltConfig } from "../../../Types";

export const golangDockerComposeFile = (config: IBuiltConfig) => {
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/golang.Dockerfile`,
      tags: [`bundles-golang-build:latest`],
      //   args:
      //     runtime === "node"
      //       ? {
      //           NODE_MJS_HASH: "cab84cac12fc3913ce45e7e53425b8bb",
      //         }
      //       : {},
      // },
    },
    volumes: [
      "/Users/adam/Code/testeranto:/workspace",
      "node_modules:/workspace/node_modules",
      // config.check["golang"],
    ],
    image: `bundles-golang-build:latest`,
    restart: "unless-stopped",
    environment: {
      BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/golang`,
      METAFILES_DIR: `/workspace/testeranto/metafiles/golang`,
      // Don't serve files - Server_TCP will handle that
      ESBUILD_SERVE_PORT: "0", // Disable esbuild serve
      IN_DOCKER: "true", // Indicate we're running in Docker
    },
    extra_hosts: ["host.docker.internal:host-gateway"],
    command: [
      "sh",
      "-c",
      `echo 'Starting golang build in watch mode...'; 
                echo 'Installing dependencies in /workspace/node_modules...'; 
                cd /workspace && \
                # Remove any .npmrc files
                rm -f .npmrc .npmrc.* || true && \
                # Clear npm cache and authentication
                npm cache clean --force && \
                # Clear any npm authentication
                npm config delete _auth 2>/dev/null || true && \
                npm config delete _authToken 2>/dev/null || true && \
                npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true && \
                npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true && \
                npm config delete always-auth 2>/dev/null || true && \
                npm config delete registry 2>/dev/null || true && \
                npm config set registry https://registry.npmjs.org/ && \
                npm config set always-auth false && \
                npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo "npm install may have warnings";
                echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...';
                npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild installation may have issues";
                npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild-sass-plugin installation may have issues";
                echo 'Creating output directory...'; 
                mkdir -p /workspace/testeranto/bundles/allTests/golang;
                mkdir -p /workspace/testeranto/metafiles/golang;
                echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
                
                echo "Starting build process for golang..."
                npx tsx dist/prebuild/server/builders/golang.mjs allTests.ts dev || echo "Build process exited with code $?, but keeping container alive for health checks";
                
                echo "Build complete. Creating completion signal..."
                touch /workspace/testeranto/metafiles/golang/build_complete
                
                echo "Build service ready. Keeping container alive..."
                while true; do
                  sleep 3600
                done`,
    ],
    healthcheck: {
      test: [
        "CMD-SHELL",
        `[ -f /workspace/testeranto/metafiles/golang/allTests.json ] && echo "healthy" || exit 1`,
      ],
      interval: "10s",
      timeout: "30s",
      retries: 10,
      start_period: "60s",
    },
  };
};

export const golangDockerFile = `FROM golang:1.21-alpine
WORKDIR /workspace
# Install libxml2-utils for xmllint and netcat-openbsd for network checks
RUN apk add --update --no-cache libxml2-utils netcat-openbsd
# Reinstall esbuild for Linux platform
RUN rm -f .npmrc .npmrc.* || true && \
    npm cache clean --force && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set always-auth false && \
    npm config delete _auth 2>/dev/null || true && \
    npm config delete _authToken 2>/dev/null || true && \
    npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true && \
    npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
`;
