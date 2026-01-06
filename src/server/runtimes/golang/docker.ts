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
      `echo 'Starting Go build service...'; 
       echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
       
       # If example directory exists, download its dependencies
       if [ -f /workspace/example/go.mod ]; then
         echo "Example project found, downloading dependencies...";
         cd /workspace/example && go mod download
       fi
       
       # Check if allTests.json exists
       if [ -f /workspace/testeranto/allTests.json ]; then
         echo "Config file found";
         # Run the pre-compiled Go metafile generator
         echo "Running Go metafile generator...";
         /usr/local/bin/golang-main /workspace/testeranto/allTests.json || echo "Go metafile generator completed";
         
         echo "Checking if metafile was generated:";
         ls -la /workspace/testeranto/metafiles/golang/ || echo "Go metafiles directory not found";
       else
         echo "Config file NOT found at /workspace/testeranto/allTests.json";
         ls -la /workspace/testeranto/ || true;
       fi
       
       echo "Go build service ready. Keeping container alive...";
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

# Install git for Go modules
RUN apk add --no-cache git

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/golang && \
    mkdir -p /workspace/testeranto/metafiles/golang

# Copy and compile the Go metafile generator
COPY src/server/runtimes/golang/main.go /workspace/src/server/runtimes/golang/main.go
RUN go build -o /usr/local/bin/golang-main src/server/runtimes/golang/main.go

# Install golangci-lint using the version from the example project
# First, create a temporary go.mod with golangci-lint dependency
RUN mkdir -p /tmp/golangci-install && \
    cd /tmp/golangci-install && \
    echo 'module temp' > go.mod && \
    echo 'go 1.21' >> go.mod && \
    echo 'require github.com/golangci/golangci-lint v1.60.3' >> go.mod && \
    go mod download && \
    go install github.com/golangci/golangci-lint/cmd/golangci-lint@v1.60.3

`;
