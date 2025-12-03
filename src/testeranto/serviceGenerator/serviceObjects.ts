import path from "path";
import { IRunTime } from "../../Types";
import { generateServiceName } from "./serviceNames";
import { computeNodeMjsHash } from "./buildDockerfiles";

export function createTestService(
  runtime: IRunTime,
  testName: string,
  dockerfileDir: string,
  testsName: string
): Record<string, any> {
  const serviceName = generateServiceName(runtime, testName);
  const bundleFileName = testName.replace(/\.ts$/, ".mjs");
  const bundlePath = `testeranto/bundles/allTests/${runtime}/${bundleFileName}`;

  return {
    [serviceName]: {
      build: {
        context: process.cwd(),
        dockerfile: path.join(dockerfileDir, "Dockerfile"),
      },
      environment: {
        BUNDLES_DIR: `/testeranto/bundles/allTests/${runtime}`,
        METAFILES_DIR: `/testeranto/metafiles/${runtime}`,
      },
      command: [
        "sh",
        "-c",
        `echo "Test service starting for ${testName} ${bundlePath}"; 
        # Wait for the bundle file to exist
        # BUNDLE_PATH="/workspace/${bundlePath}"
        # echo "Looking for bundle at: $BUNDLE_PATH"
        while [ ! -f "${bundlePath}" ]; do
          echo "Bundle not ready yet, waiting...";
          sleep 2;
        done
        echo "Build is ready. Proceeding with test...";
        # List the directory to confirm
        # ls -la /workspace/testeranto/bundles/allTests/${runtime}/
        # Run the test
        node ${bundlePath}
        `,
      ],
      volumes: [
        "../../testeranto:/workspace/testeranto",
        "../../src:/workspace/src",
      ],
      depends_on: {
        [`${runtime}-build`]: {
          condition: "service_healthy",
        },
      },
      working_dir: "/workspace",
    },
  };
}

export function createBuildService(
  runtime: IRunTime,
  dockerfileDir: string,
  testsName: string
): Record<string, any> {
  const serviceName = `${runtime}-build`;
  const configFilePath = process.argv[2];

  // Prepare build arguments
  const buildArgs: Record<string, string> = {};
  if (runtime === "node") {
    buildArgs.NODE_MJS_HASH = computeNodeMjsHash();
  }

  return {
    [serviceName]: {
      build: {
        context: process.cwd(),
        dockerfile: path.join(dockerfileDir, `${runtime}.Dockerfile`),
        tags: [`bundles-${runtime}-build:latest`],
        args: buildArgs,
      },
      volumes: ["../../testeranto:/workspace/testeranto"],
      image: `bundles-${runtime}-build:latest`,
      restart: "unless-stopped",
      environment: {
        BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/${runtime}`,
        METAFILES_DIR: `/workspace/testeranto/metafiles/${runtime}`,
      },
      command: [
        "sh",
        "-c",
        `echo 'Starting ${runtime} build in watch mode...'; 
        echo 'Creating output directory...'; 
        mkdir -p /workspace/testeranto/bundles/allTests/${runtime};
        mkdir -p /workspace/testeranto/metafiles/${runtime};
        echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
        # Run in watch mode and keep the process alive
        npx tsx ./${runtime}.mjs ${path.basename(
          configFilePath
        )} dev || echo "Build process exited, but keeping container alive for health checks";
        # Keep the container running even if the build command exits
        while true; do
          sleep 3600
        done
`,
      ],
      healthcheck: {
        test: [
          "CMD-SHELL",
          `[ -f /workspace/testeranto/metafiles/${runtime}/allTests.json ] && echo "healthy" || exit 1`,
        ],
        interval: "5s",
        timeout: "10s",
        retries: 30,
        start_period: "10s",
      },
    },
  };
}
