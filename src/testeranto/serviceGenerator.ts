/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { IBuiltConfig, IRunTime } from "../Types";
import { generateDockerfile } from "./dockerfileGenerator";
import {
  getCommandForRuntime,
  getCommandForBuildRuntime,
} from "./commandGenerator";

export function generateServices(
  c: IBuiltConfig,
  testsName: string
): Record<string, any> {
  const services: Record<string, any> = {};
  const runtimes: IRunTime[] = ["node", "web", "golang", "python"];

  console.log("generateServices", testsName);

  // First, always generate build services for all runtimes that have tests defined
  runtimes.forEach((runtime) => {
    if (
      c[runtime] &&
      c[runtime].tests &&
      Object.keys(c[runtime].tests).length > 0
    ) {
      // console.log(`Generating build service for runtime: ${runtime}`);

      // Generate build service
      const buildService = generateBuildServiceForRuntime(
        c,
        runtime,
        testsName
      );
      Object.assign(services, buildService);
    }
  });

  // Then generate test services
  runtimes.forEach((runtime) => {
    if (
      c[runtime] &&
      c[runtime].tests &&
      Object.keys(c[runtime].tests).length > 0
    ) {
      // console.log(`Generating test services for runtime: ${runtime}`);

      // Generate test services
      const runtimeServices = generateServicesForRuntime(c, runtime, testsName);
      Object.assign(services, runtimeServices);

      // console.log(
      //   `Generated ${
      //     Object.keys(runtimeServices).length
      //   } test services for ${runtime}`
      // );
    } else {
      console.log(`Skipping ${runtime} - no tests found`);
    }
  });

  // console.log(`Total services generated: ${Object.keys(services).length}`);
  // console.log(`Service names: ${Object.keys(services).join(", ")}`);

  return services;
}

function generateServicesForRuntime(
  c: IBuiltConfig,
  runtime: IRunTime,
  testsName: string
): Record<string, any> {
  const services: Record<string, any> = {};

  Object.keys(c[runtime].tests).forEach((testName) => {
    const serviceName = generateServiceName(runtime, testName);
    const dockerfileDir = setupDockerfileForTest(
      c,
      runtime,
      testName,
      testsName
    );
    const dockerfileName = "Dockerfile";

    console.log(`Setting up service ${serviceName}`);
    console.log(`  Dockerfile directory: ${dockerfileDir}`);
    console.log(`  Dockerfile name: ${dockerfileName}`);

    services[serviceName] = {
      build: {
        context: process.cwd(), // Use project root as context
        dockerfile: path.join(dockerfileDir, dockerfileName),
      },
      command: getCommandForRuntime(runtime, testName),
      volumes: [
        "./testeranto/metafiles:/workspace/testeranto/metafiles",
        "./src:/workspace/src", // Mount source code
      ],
      depends_on: [`${runtime}-build`],
      working_dir: "/workspace",
    };
  });

  return services;
}

function setupDockerfileForTest(
  c: IBuiltConfig,
  runtime: IRunTime,
  testName: string,
  testsName: string
): string {
  const dockerfileContent = generateDockerfile(c, runtime, testName);
  const dockerfileName = "Dockerfile";
  // The path should be relative to the current working directory
  const dockerfileDir = path.join(
    "testeranto",
    "bundles",
    testsName,
    runtime,
    testName
  );
  const dockerfilePath = path.join(dockerfileDir, dockerfileName);

  // Ensure we're not writing outside of testeranto/bundles
  const normalizedDir = path.normalize(dockerfileDir);
  if (!normalizedDir.startsWith(path.join("testeranto", "bundles"))) {
    throw new Error(`Invalid Dockerfile directory: ${dockerfileDir}. Must be under testeranto/bundles/`);
  }

  // Create the directory and write the file
  const fullDockerfileDir = path.join(process.cwd(), dockerfileDir);
  fs.mkdirSync(fullDockerfileDir, { recursive: true });
  const fullDockerfilePath = path.join(process.cwd(), dockerfilePath);
  fs.writeFileSync(fullDockerfilePath, dockerfileContent);

  // Verify the file exists
  if (!fs.existsSync(fullDockerfilePath)) {
    throw new Error(`Failed to create Dockerfile at ${fullDockerfilePath}`);
  }
  console.log(`  Verified Dockerfile exists at: ${fullDockerfilePath}`);

  // Return the directory containing the Dockerfile
  return dockerfileDir;
}

function generateServiceName(runtime: IRunTime, testName: string): string {
  let sanitizedTestName = testName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  sanitizedTestName = sanitizedTestName.replace(/-+/g, "-");
  sanitizedTestName = sanitizedTestName.replace(/^-+|-+$/g, "");
  return `${runtime}-${sanitizedTestName}`;
}

function generateBuildServiceForRuntime(
  c: IBuiltConfig,
  runtime: IRunTime,
  testsName: string
): Record<string, any> {
  const buildDockerfileDir = setupDockerfileForBuild(runtime, testsName);
  const buildDockerfileName = `${runtime}.Dockerfile`;

  // console.log(`Setting up build service for ${runtime}`);
  // console.log(`  Build Dockerfile directory: ${buildDockerfileDir}`);
  // console.log(`  Build Dockerfile name: ${buildDockerfileName}`);

  const serviceName = `${runtime}-build`;

  return {
    [serviceName]: {
      build: {
        context: process.cwd(),
        dockerfile: path.join(buildDockerfileDir, buildDockerfileName),
        tags: [`bundles-${runtime}-build:latest`],
      },
      volumes: ["./testeranto/metafiles:/workspace/testeranto/metafiles"],
      image: `bundles-${runtime}-build:latest`,
      restart: "no", // Don't restart after the build completes
    },
  };
}

// conf is the name of the testeranto config file. it's extension is ".ts", not ".json"
function setupDockerfileForBuildNode(config: string): string {
  return `
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \
    build-base \
    python3 \
    py3-pip \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    libxml2-utils
RUN npm install -g node-gyp tsx
COPY package.json .
RUN yarn install --ignore-engines
RUN npm install -g tsx
COPY ./src ./src/
COPY ${config} .
COPY dist/prebuild/builders/node.mjs ./node.mjs
# Create the full metafiles directory structure before CMD
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/metafiles/node
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/node.mjs ${config}"]
`;
}

function setupDockerfileForBuildWeb(config: string): string {
  return `
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \
    build-base \
    python3 \
    py3-pip \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    libxml2-utils \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji
RUN npm install -g node-gyp
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
COPY package.json .
RUN yarn install --ignore-engines
COPY ./src ./src/
COPY ${config} .
COPY dist/prebuild/builders/web.mjs ./web.mjs
# Create the full metafiles directory structure before CMD
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/metafiles/web
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/web.mjs ${config}"]
`;
}

function setupDockerfileForBuildPython(config: string): string {
  return `
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \
    build-base \
    python3 \
    py3-pip \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    libxml2-utils
# Ensure Python is properly installed and available
RUN python3 --version && pip3 --version
RUN npm install -g node-gyp
COPY package.json .
RUN yarn install --ignore-engines
COPY ./src ./src/
COPY ${config} .
COPY dist/prebuild/builders/python.mjs ./python.mjs
# Create the full metafiles directory structure before CMD
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/metafiles/python
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/python.mjs ${config}"]

`;
}
function setupDockerfileForBuildGolang(config: string): string {
  return `
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \
    build-base \
    python3 \
    py3-pip \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    libxml2-utils \
    wget
# Install Go
RUN wget -q -O - https://go.dev/dl/go1.21.0.linux-amd64.tar.gz | tar -xz -C /usr/local
ENV GOROOT=/usr/local/go
ENV PATH=$PATH:$GOROOT/bin
RUN npm install -g node-gyp
COPY package.json .
RUN yarn install --ignore-engines
COPY ./src ./src/
COPY ${config} .
COPY dist/prebuild/builders/golang.mjs ./golang.mjs
# Create the full metafiles directory structure before CMD
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/metafiles/golang
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/golang.mjs ${config}"]
`;
}

function setupDockerfileForBuild(runtime: IRunTime, testsName: string): string {
  const configFilePath = process.argv[2];
  // console.log(
  //   `Setting up build Dockerfile for ${runtime} with config: ${configFilePath}`
  // );

  let dockerfileContent: string;

  if (runtime === "node") {
    dockerfileContent = setupDockerfileForBuildNode(configFilePath);
  } else if (runtime === "web") {
    dockerfileContent = setupDockerfileForBuildWeb(configFilePath);
  } else if (runtime === "python") {
    dockerfileContent = setupDockerfileForBuildPython(configFilePath);
  } else if (runtime === "golang") {
    dockerfileContent = setupDockerfileForBuildGolang(configFilePath);
  } else {
    throw new Error(
      `Unsupported runtime for build Dockerfile generation: ${runtime}`
    );
  }

  // console.log(`Generated Build Dockerfile for ${runtime}:`);
  // console.log(dockerfileContent);
  // console.log("---");

  if (!dockerfileContent || dockerfileContent.trim().length === 0) {
    console.warn(
      `Generated empty Build Dockerfile for ${runtime}, using fallback`
    );
    dockerfileContent = `FROM ${
      runtime === "node"
        ? "node:18-alpine"
        : runtime === "python"
        ? "node:18-alpine"
        : runtime === "golang"
        ? "node:18-alpine"
        : "alpine:latest"
    }\nWORKDIR /app\nRUN mkdir -p /workspace/testeranto/metafiles\nCOPY . .\nRUN echo 'Build phase completed'\n`;
  }

  const dockerfileName = `${runtime}.Dockerfile`;
  const dockerfileDir = path.join("testeranto", "bundles", testsName, runtime);
  const dockerfilePath = path.join(dockerfileDir, dockerfileName);

  // Ensure we're not writing outside of testeranto/bundles
  const normalizedDir = path.normalize(dockerfileDir);
  if (!normalizedDir.startsWith(path.join("testeranto", "bundles"))) {
    throw new Error(`Invalid Dockerfile directory: ${dockerfileDir}. Must be under testeranto/bundles/`);
  }

  // Create the directory and write the file
  const fullDockerfileDir = path.join(process.cwd(), dockerfileDir);
  fs.mkdirSync(fullDockerfileDir, { recursive: true });
  const fullDockerfilePath = path.join(process.cwd(), dockerfilePath);
  fs.writeFileSync(fullDockerfilePath, dockerfileContent);

  // Verify the file exists
  if (!fs.existsSync(fullDockerfilePath)) {
    throw new Error(
      `Failed to create build Dockerfile at ${fullDockerfilePath}`
    );
  }
  // console.log(`  Verified build Dockerfile exists at: ${fullDockerfilePath}`);

  // Return the directory containing the Dockerfile
  return dockerfileDir;
}
