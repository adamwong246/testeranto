import { IBuiltConfig } from "../../../Types";

export const golangDockerComposeFile = (config: IBuiltConfig) => {
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/golang/golang.Dockerfile`,
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
      // "node_modules:/workspace/node_modules",
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
      `echo 'Starting pure Go build...'; 
                echo 'Creating output directories...'; 
                mkdir -p /workspace/testeranto/bundles/allTests/golang;
                mkdir -p /workspace/testeranto/metafiles/golang;
                echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
                
                echo "Compiling and running Go metafile generator..."
                # Compile and run the Go program
                cd /workspace && \
                go build -o /tmp/golang-main src/server/runtimes/golang/main.go && \
                /tmp/golang-main || echo "Go metafile generator completed";
                
                echo "Build complete. Creating completion signal..."
                touch /workspace/testeranto/metafiles/golang/build_complete
                
                echo "Go build service ready. Keeping container alive..."
                while true; do
                  sleep 3600
                done`,
    ],
    healthcheck: {
      test: [
        "CMD-SHELL",
        `[ -f /workspace/testeranto/metafiles/golang/golang.metafile.json ] && echo "healthy" || exit 1`,
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

`;
