import { IBuiltConfig, IRunTime } from "../../../Types";

export const pythonDockerFile = `FROM python:3.11-alpine
WORKDIR /workspace
RUN echo "Python environment ready"
`;

export const pythonDockerComposeFile = (config: IBuiltConfig) => {
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/python/python.Dockerfile`,
      tags: [`bundles-python-build:latest`],
    },
    volumes: [
      "/Users/adam/Code/testeranto:/workspace",
      // "node_modules:/workspace/node_modules",
    ],
    image: `bundles-python-build:latest`,
    restart: "unless-stopped",
    environment: {
      BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/python`,
      METAFILES_DIR: `/workspace/testeranto/metafiles/python`,
      ESBUILD_SERVE_PORT: "0",
      IN_DOCKER: "true",
    },
    extra_hosts: ["host.docker.internal:host-gateway"],
    command: [
      "sh",
      "-c",
      `echo 'Python service starting...';
       mkdir -p /workspace/testeranto/metafiles/python;
       # Run the pitono.py script with the allTests.json config
       cd /workspace && python src/server/runtimes/python/pitono.py /workspace/testeranto/allTests.json;
       echo 'Container staying alive...';
       # Keep the container alive
       while true; do sleep 3600; done`,
    ],
    healthcheck: {
      test: ["CMD-SHELL", "echo 'healthy' || exit 1"],
      interval: "10s",
      timeout: "30s",
      retries: 10,
      start_period: "60s",
    },
  };
};
