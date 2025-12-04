/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBuiltConfig, IRunTime } from "../../Types";
import fs from "fs";
import path from "path";
import { generateDockerfile } from "../configuration/dockerfileGenerator";

// Build services should create proper Dockerfiles
function setupDockerfileForBuild(runtime: IRunTime, testsName: string, logger?: {
  log: (...args: any[]) => void;
}): string {
  const log = logger?.log || (() => {}); // Use logger or no-op function
  log(`Creating Dockerfile for ${runtime} build service`);
  
  // Generate the correct Dockerfile content based on runtime
  let dockerfileContent = '';
  
  if (runtime === 'node') {
    // Check if files exist
    const packageJsonExists = fs.existsSync(path.join(process.cwd(), 'package.json'));
    const srcExists = fs.existsSync(path.join(process.cwd(), 'src'));
    const testsFileExists = fs.existsSync(path.join(process.cwd(), `${testsName}.ts`));
    const nodeMjsExists = fs.existsSync(path.join(process.cwd(), 'dist/prebuild/builders/node.mjs'));
    
    dockerfileContent = `FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \\
    build-base \\
    python3 \\
    py3-pip \\
    cairo-dev \\
    pango-dev \\
    jpeg-dev \\
    giflib-dev \\
    librsvg-dev \\
    libxml2-utils && \\
    rm -rf /var/cache/apk/*
RUN npm install -g node-gyp tsx
${packageJsonExists ? 'COPY package.json .' : '# package.json not found'}
# Try yarn install, fallback to npm install if it fails
ENV npm_config_build_from_source=false
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN (yarn install --ignore-engines || npm install --legacy-peer-deps) && \\
    npm install -g tsx && \\
    npm cache clean --force && \\
    yarn cache clean || true
${srcExists ? 'COPY ./src ./src/' : '# src directory not found'}
${testsFileExists ? `COPY ${testsName}.ts .` : `# ${testsName}.ts not found`}
# Copy builders source code
COPY ./src/builders ./src/builders/
# Create the full directory structure before CMD
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/${runtime}
RUN mkdir -p /workspace/testeranto/bundles/${runtime}/${testsName}
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}
# Set environment variables for output directories
ENV BUNDLES_DIR=/workspace/testeranto/bundles/${runtime}/${testsName}
ENV METAFILES_DIR=/workspace/testeranto/metafiles/${runtime}
ENV TESTERANTO_RUNTIME=${runtime}
# Run the node builder using tsx
CMD ["tsx", "src/builders/node.ts", "${testsName}.ts"]
`;
  } else if (runtime === 'web') {
    // Check if files exist
    const packageJsonExists = fs.existsSync(path.join(process.cwd(), 'package.json'));
    const srcExists = fs.existsSync(path.join(process.cwd(), 'src'));
    const testsFileExists = fs.existsSync(path.join(process.cwd(), `${testsName}.ts`));
    const webMjsExists = fs.existsSync(path.join(process.cwd(), 'dist/prebuild/builders/web.mjs'));
    
    dockerfileContent = `FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \\
    chromium \\
    nss \\
    freetype \\
    freetype-dev \\
    harfbuzz \\
    ca-certificates \\
    ttf-freefont \\
    font-noto-emoji \\
    build-base \\
    python3 \\
    py3-pip \\
    cairo-dev \\
    pango-dev \\
    jpeg-dev \\
    giflib-dev \\
    librsvg-dev \\
    libxml2-utils && \\
    rm -rf /var/cache/apk/*
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
RUN npm install -g node-gyp tsx
${packageJsonExists ? 'COPY package.json .' : '# package.json not found'}
ENV npm_config_build_from_source=false
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN (yarn install --ignore-engines || npm install --legacy-peer-deps) && \\
    npm install -g tsx && \\
    npm cache clean --force && \\
    yarn cache clean || true
${srcExists ? 'COPY ./src ./src/' : '# src directory not found'}
${testsFileExists ? `COPY ${testsName}.ts .` : `# ${testsName}.ts not found`}
# Copy builders source code
COPY ./src/builders ./src/builders/
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/${runtime}
RUN mkdir -p /workspace/testeranto/bundles/${runtime}/${testsName}
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}
ENV BUNDLES_DIR=/workspace/testeranto/bundles/${runtime}/${testsName}
ENV METAFILES_DIR=/workspace/testeranto/metafiles/${runtime}
ENV TESTERANTO_RUNTIME=${runtime}
# Run the web builder using tsx
CMD ["tsx", "src/builders/web.ts", "${testsName}.ts"]
`;
  } else if (runtime === 'python') {
    // Check if files exist
    const requirementsExists = fs.existsSync(path.join(process.cwd(), 'requirements.txt'));
    const srcExists = fs.existsSync(path.join(process.cwd(), 'src'));
    const testsFileExists = fs.existsSync(path.join(process.cwd(), `${testsName}.ts`));
    const pythonMjsExists = fs.existsSync(path.join(process.cwd(), 'dist/prebuild/builders/python.mjs'));
    
    dockerfileContent = `FROM python:3.11-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \\
    build-base \\
    libffi-dev \\
    openssl-dev \\
    cargo \\
    nodejs \\
    npm \\
    && rm -rf /var/cache/apk/*
RUN npm install -g tsx
${requirementsExists ? 'COPY requirements.txt .' : '# requirements.txt not found'}
${requirementsExists ? 'RUN pip install --no-cache-dir -r requirements.txt' : '# Skipping pip install'}
${srcExists ? 'COPY ./src ./src/' : '# src directory not found'}
${testsFileExists ? `COPY ${testsName}.ts .` : `# ${testsName}.ts not found`}
# Copy builders source code
COPY ./src/builders ./src/builders/
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/${runtime}
RUN mkdir -p /workspace/testeranto/bundles/${runtime}/${testsName}
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}
ENV BUNDLES_DIR=/workspace/testeranto/bundles/${runtime}/${testsName}
ENV METAFILES_DIR=/workspace/testeranto/metafiles/${runtime}
ENV TESTERANTO_RUNTIME=${runtime}
# Run the python builder using tsx
CMD ["tsx", "src/builders/python.ts", "${testsName}.ts"]
`;
  } else if (runtime === 'golang') {
    // Check if files exist
    const goModExists = fs.existsSync(path.join(process.cwd(), 'go.mod'));
    const goSumExists = fs.existsSync(path.join(process.cwd(), 'go.sum'));
    const srcExists = fs.existsSync(path.join(process.cwd(), 'src'));
    const testsFileExists = fs.existsSync(path.join(process.cwd(), `${testsName}.ts`));
    const golangMjsExists = fs.existsSync(path.join(process.cwd(), 'dist/prebuild/builders/golang.mjs'));
    
    dockerfileContent = `FROM golang:1.21-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \\
    build-base \\
    git \\
    nodejs \\
    npm \\
    && rm -rf /var/cache/apk/*
RUN npm install -g tsx
${goModExists ? 'COPY go.mod .' : '# go.mod not found'}
${goSumExists ? 'COPY go.sum .' : '# go.sum not found'}
${goModExists || goSumExists ? 'RUN go mod download' : '# Skipping go mod download'}
${srcExists ? 'COPY ./src ./src/' : '# src directory not found'}
${testsFileExists ? `COPY ${testsName}.ts .` : `# ${testsName}.ts not found`}
# Copy builders source code
COPY ./src/builders ./src/builders/
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/${runtime}
RUN mkdir -p /workspace/testeranto/bundles/${runtime}/${testsName}
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}
ENV BUNDLES_DIR=/workspace/testeranto/bundles/${runtime}/${testsName}
ENV METAFILES_DIR=/workspace/testeranto/metafiles/${runtime}
ENV TESTERANTO_RUNTIME=${runtime}
ENV GO111MODULE=on
# Run the golang builder using tsx
CMD ["tsx", "src/builders/golang.ts", "${testsName}.ts"]
`;
  } else {
    // Default fallback
    dockerfileContent = `FROM alpine:latest
WORKDIR /workspace
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/${runtime}
RUN mkdir -p /workspace/testeranto/bundles/${runtime}/${testsName}
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/${runtime}
ENV BUNDLES_DIR=/workspace/testeranto/bundles/${runtime}/${testsName}
ENV METAFILES_DIR=/workspace/testeranto/metafiles/${runtime}
ENV TESTERANTO_RUNTIME=${runtime}
`;
  }
  
  // Create the directory for the build Dockerfile
  const dockerfileDir = path.join(
    process.cwd(),
    "testeranto",
    "bundles",
    testsName,
    `${runtime}-build`
  );
  
  fs.mkdirSync(dockerfileDir, { recursive: true });
  const dockerfilePath = path.join(dockerfileDir, "Dockerfile");
  fs.writeFileSync(dockerfilePath, dockerfileContent);
  
  log(`Created build Dockerfile at ${dockerfilePath}`);
  
  // Return relative path from process.cwd() for use in docker-compose.yml
  // dockerfileDir is already an absolute path, make it relative
  const relativePath = path.relative(process.cwd(), dockerfileDir);
  // Ensure it uses forward slashes for Docker compatibility
  return relativePath.split(path.sep).join('/');
}

function getBaseImage(runtime: IRunTime): string {
  switch (runtime) {
    case "node":
      return "node:18-alpine";
    case "web":
      return "node:18-alpine";
    case "python":
      return "python:3.11-alpine";
    case "golang":
      return "golang:1.21-alpine";
    default:
      return "alpine:latest";
  }
}

// Import the real implementation for test Dockerfiles
import { setupDockerfileForTest as realSetupDockerfileForTest } from "./serviceGenerator/testDockerfiles";

function setupDockerfileForTest(
  c: IBuiltConfig,
  runtime: IRunTime,
  testPath: string,
  testsName: string,
  logger?: {
    log: (...args: any[]) => void;
  }
): string {
  const log = logger?.log || (() => {});
  log(`Setting up Dockerfile for ${runtime} test ${testPath}`);
  
  // Use the real implementation
  return realSetupDockerfileForTest(c, runtime, testPath, testsName);
}

function generateServiceName(runtime: IRunTime, testPath: string): string {
  // Extract filename without extension
  const basename = path.basename(testPath);
  const nameWithoutExt = basename.replace(/\.[^/.]+$/, '');
  // Sanitize to only allow alphanumeric and hyphens
  const sanitized = nameWithoutExt.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `${runtime}-${sanitized}`;
}

function validateServiceNames(serviceNames: string[], logger?: {
  error: (...args: any[]) => void;
}): void {
  const error = logger?.error || (() => {});
  const invalid = serviceNames.filter(name => !/^[a-z][a-z0-9-]*$/.test(name));
  if (invalid.length > 0) {
    error(`Invalid service names: ${invalid.join(', ')}`);
    throw new Error(`Invalid service names: ${invalid.join(', ')}`);
  }
}

function createTestService(
  runtime: IRunTime,
  serviceName: string,
  dockerfileDir: string,
  testsName: string
): Record<string, any> {
  // dockerfileDir is a relative path from process.cwd() to the directory containing Dockerfile
  // For example: "testeranto/bundles/testsName/runtime/testName"
  // The build context should be the directory containing the Dockerfile
  // So context is dockerfileDir, and dockerfile is "Dockerfile"
  // Ensure forward slashes for Docker compatibility
  const context = dockerfileDir.split(path.sep).join('/');
  
  return {
    [serviceName]: {
      build: {
        context: context,
        dockerfile: "Dockerfile",
      },
    },
  };
}

function createBuildService(
  runtime: IRunTime,
  dockerfileDir: string,
  testsName: string
): Record<string, any> {
  // dockerfileDir is a relative path from process.cwd() to the directory containing Dockerfile
  // For example: "testeranto/bundles/testsName/runtime-build"
  // The build context should be the project root (where package.json, src/, etc. are)
  // So we need to compute the Dockerfile path relative to the context
  const context = "."; // Project root
  // dockerfileDir is already relative to process.cwd(), so join with "Dockerfile"
  const dockerfilePath = path.join(dockerfileDir, "Dockerfile");
  
  return {
    [`${runtime}-build`]: {
      build: {
        context: context,
        dockerfile: dockerfilePath,
      },
    },
  };
}

export function generateServices(
  c: IBuiltConfig,
  testsName: string,
  logger?: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
  }
): Record<string, any> {
  const log = logger?.log || (() => {});
  const error = logger?.error || (() => {});
  
  const services: Record<string, any> = {};
  const runtimes: IRunTime[] = ["node", "web", "golang", "python"];

  // First, always generate build services for all runtimes that have tests defined
  runtimes.forEach((runtime) => {
    if (
      c[runtime] &&
      c[runtime].tests &&
      Object.keys(c[runtime].tests).length > 0
    ) {
      const buildService = generateBuildServiceForRuntime(
        c,
        runtime,
        testsName,
        logger
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
      const runtimeServices = generateServicesForRuntime(c, runtime, testsName, logger);
      Object.assign(services, runtimeServices);
    } else {
      log(`Skipping ${runtime} - no tests found`);
    }
  });

  // Validate all service names
  validateServiceNames(Object.keys(services), logger);

  log(`Generated ${Object.keys(services).length} services for ${testsName}`);
  return services;
}

function generateServicesForRuntime(
  c: IBuiltConfig,
  runtime: IRunTime,
  testsName: string,
  logger?: {
    log: (...args: any[]) => void;
  }
): Record<string, any> {
  const log = logger?.log || (() => {});
  const services: Record<string, any> = {};

  Object.keys(c[runtime].tests).forEach((testPath) => {
    const dockerfileDir = setupDockerfileForTest(
      c,
      runtime,
      testPath,
      testsName,
      logger
    );
    // For service name, use a sanitized version of the test path
    const serviceName = generateServiceName(runtime, testPath);
    const service = createTestService(runtime, serviceName, dockerfileDir, testsName);
    Object.assign(services, service);
    log(`Created service for ${runtime} test: ${testPath}`);
  });

  return services;
}

function generateBuildServiceForRuntime(
  c: IBuiltConfig,
  runtime: IRunTime,
  testsName: string,
  logger?: {
    log: (...args: any[]) => void;
  }
): Record<string, any> {
  const buildDockerfileDir = setupDockerfileForBuild(runtime, testsName, logger);
  return createBuildService(runtime, buildDockerfileDir, testsName);
}
