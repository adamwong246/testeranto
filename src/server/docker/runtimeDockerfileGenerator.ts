/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";
import { baseNodeImage } from "../nodeVersion";
import { getStrategyForRuntime, getCategoryForRuntime } from "../strategies";

export async function generateRuntimeDockerfiles(
  config: IBuiltConfig,
  runtimes: IRunTime[],
  composeDir: string,
  log: (...args: any[]) => void,
  error: (...args: any[]) => void
) {
  for (const runtime of runtimes) {
    const hasTests =
      config[runtime]?.tests && Object.keys(config[runtime].tests).length > 0;
    if (!hasTests) continue;

    const runtimeDockerfilePath = path.join(
      composeDir,
      "allTests",
      runtime,
      `${runtime}.Dockerfile`
    );

    // Ensure directory exists
    fs.mkdirSync(path.dirname(runtimeDockerfilePath), { recursive: true });

    // const strategy = getStrategyForRuntime(runtime);
    // const category = getCategoryForRuntime(runtime);

    // log(`Generating Dockerfile for ${runtime} (${category}, ${strategy})`);

    let dockerfileContent = "";

    // Common header with strategy information
    //     const strategyHeader = `# Testeranto Dockerfile for ${runtime}
    // # Strategy: ${strategy} (${category})
    // # Generated: ${new Date().toISOString()}
    // `;

    if (runtime === "node") {
      dockerfileContent =
        // strategyHeader +
        `
FROM ${baseNodeImage}
# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/${runtime}
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}

# Install Node.js for running the builder
RUN apt-get update && apt-get install -y nodejs npm
RUN rm -f .npmrc .npmrc.* || true && \
    npm cache clean --force && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set always-auth false && \
    npm config delete _auth 2>/dev/null || true && \
    npm config delete _authToken 2>/dev/null || true && \
    npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true && \
    npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true
RUN npm install -g tsx --no-audit --no-fund --ignore-scripts --no-optional

# Install esbuild for the correct platform (Linux)
RUN npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional

COPY dist/prebuild/server/builders/${runtime}.mjs ./${runtime}.mjs
WORKDIR /workspace

    `;
    } else if (runtime === "web") {
      return ``;
    } else if (runtime === "python") {
      return ``;
    } else if (runtime === "golang") {
      return ``;
    }

    fs.writeFileSync(runtimeDockerfilePath, dockerfileContent);
  }
}
