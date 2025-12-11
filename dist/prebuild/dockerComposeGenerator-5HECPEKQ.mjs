// src/server/docker/dockerComposeGenerator.ts
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

// src/server/nodeVersion.ts
var version = "20.19.4";
var baseNodeImage = `node:${version}-alpine`;

// src/server/runtimes/golang/golangDocker.ts
var golangDockerCmd = `FROM ${baseNodeImage}
WORKDIR /workspace
# Install libxml2-utils for xmllint and netcat-openbsd for network checks
RUN apk add --update --no-cache libxml2-utils netcat-openbsd
# Reinstall esbuild for Linux platform
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
`;
var golangDockerFile = (config) => {
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
      volumes: [
        "/Users/adam/Code/testeranto:/workspace",
        "node_modules:/workspace/node_modules",
        config.checks["golang"]
      ],
      image: `bundles-golang-build:latest`,
      restart: "unless-stopped",
      environment: {
        BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/golang`,
        METAFILES_DIR: `/workspace/testeranto/metafiles/golang`,
        // Don't serve files - Server_TCP will handle that
        ESBUILD_SERVE_PORT: "0",
        // Disable esbuild serve
        IN_DOCKER: "true"
        // Indicate we're running in Docker
      },
      extra_hosts: ["host.docker.internal:host-gateway"],
      command: [
        "sh",
        "-c",
        `echo 'Starting golang build in watch mode...'; 
                echo 'Installing dependencies in /workspace/node_modules...'; 
                cd /workspace &&                 # Remove any .npmrc files
                rm -f .npmrc .npmrc.* || true &&                 # Clear npm cache and authentication
                npm cache clean --force &&                 # Clear any npm authentication
                npm config delete _auth 2>/dev/null || true &&                 npm config delete _authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true &&                 npm config delete always-auth 2>/dev/null || true &&                 npm config delete registry 2>/dev/null || true &&                 npm config set registry https://registry.npmjs.org/ &&                 npm config set always-auth false &&                 npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo "npm install may have warnings";
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
                done`
      ],
      healthcheck: {
        test: [
          "CMD-SHELL",
          `[ -f /workspace/testeranto/metafiles/golang/allTests.json ] && echo "healthy" || exit 1`
        ],
        interval: "10s",
        timeout: "30s",
        retries: 10,
        start_period: "60s"
      }
    }
  };
};

// src/server/runtimes/node/nodeDocker.ts
var nodeDockerCmd = `FROM ${baseNodeImage}
WORKDIR /workspace
# Install libxml2-utils for xmllint and netcat-openbsd for network checks
RUN apk add --update --no-cache libxml2-utils netcat-openbsd
# Reinstall esbuild for Linux platform
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
`;
var nodeDockerFile = (config) => {
  console.log("nodeDockerFile", config);
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/node.Dockerfile`,
      tags: [`bundles-node-build:latest`],
      args: {
        NODE_MJS_HASH: "cab84cac12fc3913ce45e7e53425b8bb"
      }
    },
    volumes: [
      "/Users/adam/Code/testeranto:/workspace",
      "node_modules:/workspace/node_modules",
      config.checks["node"]
    ],
    image: `bundles-node-build:latest`,
    restart: "unless-stopped",
    environment: {
      BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/node`,
      METAFILES_DIR: `/workspace/testeranto/metafiles/node`,
      // Don't serve files - Server_TCP will handle that
      //   ESBUILD_SERVE_PORT: "0", // Disable esbuild serve
      IN_DOCKER: "true"
      // Indicate we're running in Docker
    },
    extra_hosts: ["host.docker.internal:host-gateway"],
    command: [
      "sh",
      "-c",
      `echo 'Starting node build in watch mode...'; 
                echo 'Installing dependencies in /workspace/node_modules...'; 
                cd /workspace &&                 # Remove any .npmrc files
                rm -f .npmrc .npmrc.* || true &&                 # Clear npm cache and authentication
                npm cache clean --force &&                 # Clear any npm authentication
                npm config delete _auth 2>/dev/null || true &&                 npm config delete _authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true &&                 npm config delete always-auth 2>/dev/null || true &&                 npm config delete registry 2>/dev/null || true &&                 npm config set registry https://registry.npmjs.org/ &&                 npm config set always-auth false &&                 npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo "npm install may have warnings";
                echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...';
                npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild installation may have issues";
                npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild-sass-plugin installation may have issues";
                echo 'Creating output directory...'; 
                mkdir -p /workspace/testeranto/bundles/allTests/node;
                mkdir -p /workspace/testeranto/metafiles/node;
                echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
                
                echo "Starting build process for node..."
                npx tsx dist/prebuild/server/runtimes/node/node.mjs allTests.ts dev || echo "Build process exited with code $?, but keeping container alive for health checks";
                `
    ],
    healthcheck: {
      test: [
        "CMD-SHELL",
        `[ -f /workspace/testeranto/metafiles/node/allTests.json ] && echo "healthy" || exit 1`
      ],
      interval: "10s",
      timeout: "30s",
      retries: 10,
      start_period: "60s"
    }
  };
};

// src/server/runtimes/python/pythonDocker.ts
var pythonDockerCmd = `FROM ${baseNodeImage}
WORKDIR /workspace
# Install libxml2-utils for xmllint and netcat-openbsd for network checks
RUN apk add --update --no-cache libxml2-utils netcat-openbsd
# Reinstall esbuild for Linux platform
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
`;
var pythonDockerFile = (config) => {
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/python.Dockerfile`,
      tags: [`bundles-python-build:latest`],
      //   args:
      //     runtime === "node"
      //       ? {
      //           NODE_MJS_HASH: "cab84cac12fc3913ce45e7e53425b8bb",
      //         }
      //       : {},
      // },
      volumes: [
        "/Users/adam/Code/testeranto:/workspace",
        "node_modules:/workspace/node_modules",
        config.checks["python"]
      ],
      image: `bundles-python-build:latest`,
      restart: "unless-stopped",
      environment: {
        BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/python`,
        METAFILES_DIR: `/workspace/testeranto/metafiles/python`,
        // Don't serve files - Server_TCP will handle that
        ESBUILD_SERVE_PORT: "0",
        // Disable esbuild serve
        IN_DOCKER: "true"
        // Indicate we're running in Docker
      },
      extra_hosts: ["host.docker.internal:host-gateway"],
      command: [
        "sh",
        "-c",
        `echo 'Starting python build in watch mode...'; 
                echo 'Installing dependencies in /workspace/node_modules...'; 
                cd /workspace &&                 # Remove any .npmrc files
                rm -f .npmrc .npmrc.* || true &&                 # Clear npm cache and authentication
                npm cache clean --force &&                 # Clear any npm authentication
                npm config delete _auth 2>/dev/null || true &&                 npm config delete _authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true &&                 npm config delete always-auth 2>/dev/null || true &&                 npm config delete registry 2>/dev/null || true &&                 npm config set registry https://registry.npmjs.org/ &&                 npm config set always-auth false &&                 npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo "npm install may have warnings";
                echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...';
                npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild installation may have issues";
                npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild-sass-plugin installation may have issues";
                echo 'Creating output directory...'; 
                mkdir -p /workspace/testeranto/bundles/allTests/python;
                mkdir -p /workspace/testeranto/metafiles/python;
                echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
                
                echo "Starting build process for python..."
                npx tsx dist/prebuild/server/builders/python.mjs allTests.ts dev || echo "Build process exited with code $?, but keeping container alive for health checks";
                
                echo "Build complete. Creating completion signal..."
                touch /workspace/testeranto/metafiles/python/build_complete
                
                echo "Build service ready. Keeping container alive..."
                while true; do
                  sleep 3600
                done`
      ],
      healthcheck: {
        test: [
          "CMD-SHELL",
          `[ -f /workspace/testeranto/metafiles/python/allTests.json ] && echo "healthy" || exit 1`
        ],
        interval: "10s",
        timeout: "30s",
        retries: 10,
        start_period: "60s"
      }
    }
  };
};

// src/server/runtimes/web/webDocker.ts
var webDockerCmd = `FROM ${baseNodeImage}
WORKDIR /workspace
# Install libxml2-utils for xmllint and netcat-openbsd for network checks
RUN apk add --update --no-cache libxml2-utils netcat-openbsd
# Reinstall esbuild for Linux platform
RUN rm -f .npmrc .npmrc.* || true &&     npm cache clean --force &&     npm config set registry https://registry.npmjs.org/ &&     npm config set always-auth false &&     npm config delete _auth 2>/dev/null || true &&     npm config delete _authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&     npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm uninstall esbuild @esbuild/darwin-arm64 @esbuild/darwin-x64 @esbuild/win32-x64 @esbuild/win32-arm64 2>/dev/null || true
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
`;
var webDockerFile = (config) => {
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/web/web.Dockerfile`,
      tags: [`bundles-web-build:latest`],
      //   args:
      //     runtime === "node"
      //       ? {
      //           NODE_MJS_HASH: "cab84cac12fc3913ce45e7e53425b8bb",
      //         }
      //       : {},
      // },
      volumes: [
        "/Users/adam/Code/testeranto:/workspace",
        "node_modules:/workspace/node_modules",
        config.checks["web"]
      ],
      image: `bundles-web-build:latest`,
      restart: "unless-stopped",
      environment: {
        BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/web`,
        METAFILES_DIR: `/workspace/testeranto/metafiles/web`,
        // Don't serve files - Server_TCP will handle that
        ESBUILD_SERVE_PORT: "0",
        // Disable esbuild serve
        IN_DOCKER: "true"
        // Indicate we're running in Docker
      },
      extra_hosts: ["host.docker.internal:host-gateway"],
      command: [
        "sh",
        "-c",
        `echo 'Starting web build in watch mode...'; 
                echo 'Installing dependencies in /workspace/node_modules...'; 
                cd /workspace &&                 # Remove any .npmrc files
                rm -f .npmrc .npmrc.* || true &&                 # Clear npm cache and authentication
                npm cache clean --force &&                 # Clear any npm authentication
                npm config delete _auth 2>/dev/null || true &&                 npm config delete _authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true &&                 npm config delete always-auth 2>/dev/null || true &&                 npm config delete registry 2>/dev/null || true &&                 npm config set registry https://registry.npmjs.org/ &&                 npm config set always-auth false &&                 npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo "npm install may have warnings";
                echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...';
                npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild installation may have issues";
                npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild-sass-plugin installation may have issues";
                echo 'Creating output directory...'; 
                mkdir -p /workspace/testeranto/bundles/allTests/web;
                mkdir -p /workspace/testeranto/metafiles/web;
                echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
                
                echo "Starting build process for web..."
                npx tsx dist/prebuild/server/builders/web.mjs allTests.ts dev || echo "Build process exited with code $?, but keeping container alive for health checks";
                
                echo "Build complete. Creating completion signal..."
                touch /workspace/testeranto/metafiles/web/build_complete
                
                echo "Build service ready. Keeping container alive..."
                while true; do
                  sleep 3600
                done`
      ],
      healthcheck: {
        test: [
          "CMD-SHELL",
          `[ -f /workspace/testeranto/metafiles/web/allTests.json ] && echo "healthy" || exit 1`
        ],
        interval: "10s",
        timeout: "30s",
        retries: 10,
        start_period: "60s"
      }
    }
  };
};

// src/server/docker/dockerComposeGenerator.ts
var runtimes = ["node", "web", "golang", "python"];
var dockerfiles = {
  node: nodeDockerFile,
  web: webDockerFile,
  golang: golangDockerFile,
  python: pythonDockerFile
};
async function generateRuntimeDockerfiles(config, runtimes2, composeDir, log, error) {
  for (const runtime of runtimes2) {
    const runtimeDockerfilePath = path.join(
      composeDir,
      "allTests",
      runtime,
      `${runtime}.Dockerfile`
    );
    fs.mkdirSync(path.dirname(runtimeDockerfilePath), { recursive: true });
    fs.writeFileSync(
      runtimeDockerfilePath,
      yaml.dump(dockerfiles[runtime](runtime), {
        lineWidth: -1,
        noRefs: true
      })
    );
  }
}
async function setupDockerCompose(config, testsName, options) {
  console.log("mark6", config);
  const logger = options?.logger;
  const webSocketPort = options?.webSocketPort;
  const log = logger?.log || console.log;
  const error = logger?.error || console.error;
  if (!testsName || testsName.trim() === "") {
    testsName = "allTests";
    log(`WARNING: testsName was empty, using default: ${testsName}`);
  }
  const composeDir = path.join(process.cwd(), "testeranto", "bundles");
  console.log("mark7");
  try {
    console.log("mark10", testsName);
    fs.mkdirSync(composeDir, { recursive: true });
    await generateRuntimeDockerfiles(config, runtimes, composeDir, log, error);
    console.log("mark5", testsName);
    console.log("mark9", testsName);
  } catch (err) {
    error(`Error in setupDockerCompose:`, err);
    throw err;
  }
}
export {
  setupDockerCompose
};
