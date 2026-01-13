import { IBuiltConfig } from "../../../Types";

export const golangDockerComposeFile = (config: IBuiltConfig) => {
  return {
    build: {
      context: "/Users/adam/Code/testeranto",
      dockerfile: `testeranto/bundles/allTests/golang/golang.Dockerfile`,
      tags: [`bundles-golang-build:latest`],
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
      `echo 'Starting Go metafile generator...';
      
      cd /workspace/src/server/runtimes/golang;
      
      # Build the metafile generator
      go build -buildvcs=false -o /usr/local/bin/golang-main .;
      
      # Run the metafile generator
      /usr/local/bin/golang-main /workspace/testeranto/allTests.json;
      
      echo 'Go metafile generator completed. Keeping container alive...';
      while true; do
        sleep 3600
      done`
    ],
    healthcheck: {
      test: [
        "CMD-SHELL",
        `if [ -f /workspace/testeranto/metafiles/golang/allTests.json ]; then
           echo "healthy - metafile exists"
           exit 0
         else
           echo "unhealthy - no metafile found"
           exit 1
         fi`,
      ],
      interval: "10s",
      timeout: "30s",
      retries: 10,
      start_period: "60s",
    },
  };
};

export const golangBddCommand = (port) => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `cd /workspace/example && go run example/Calculator.golingvu.test.go '${jsonStr}'`;
}

export const golangDockerFile = `FROM golang:1.21-alpine
WORKDIR /workspace

# Install git for Go modules and golangci-lint
RUN apk add --no-cache git curl
# Install golangci-lint
RUN curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b /usr/local/bin v1.60.3

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/golang && \
    mkdir -p /workspace/testeranto/metafiles/golang

# Copy all Go source files for the metafile generator
COPY src/server/runtimes/golang/ /workspace/src/server/runtimes/golang/

# Create a go.mod file for the metafile generator if it doesn't exist
RUN cd /workspace/src/server/runtimes/golang && \
    if [ ! -f go.mod ]; then \
        go mod init golang-metafile-generator && \
        echo "Created new go.mod file"; \
    else \
        echo "go.mod already exists, skipping initialization"; \
    fi && \
    echo "=== Go files present: ===" && \
    ls *.go

# Download dependencies for the metafile generator
RUN cd /workspace/src/server/runtimes/golang && \
    echo "=== Downloading dependencies ===" && \
    go mod download

# Compile the Go metafile generator (build with all Go files)
RUN cd /workspace/src/server/runtimes/golang && \
    echo "=== Building in directory: \$(pwd) ===" && \
    go build -buildvcs=false -o /usr/local/bin/golang-main .


`;




// echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
       
//        # Create necessary directories
// mkdir - p / workspace / testeranto / bundles / allTests / golang
// mkdir - p / workspace / testeranto / metafiles / golang
       
//        # The Go metafile generator should already be built in the Dockerfile
//        echo "Checking for Go metafile generator...";
// if [-f / usr / local / bin / golang - main]; then
//          echo "✅ Go metafile generator found at /usr/local/bin/golang-main";
//        else
//          echo "❌ Go metafile generator not found at /usr/local/bin/golang-main";
//          echo "Trying to build it...";
// cd / workspace / src / server / runtimes / golang && \
//          go build - buildvcs=false - o / usr / local / bin / golang - main.
//   if[$ ? -eq 0 ]; then
//            echo "✅ Go metafile generator built successfully";
//          else
//            echo "❌ Failed to build Go metafile generator";
//            exit 1
// fi
// fi
       
//        # If example directory exists, download its dependencies
// if [-f / workspace / example / go.mod]; then
//          echo "Example project found, downloading dependencies...";
// cd / workspace / example && go mod download
// fi
       
//        # Check if allTests.json exists
// if [-f / workspace / testeranto / allTests.json]; then
//          echo "Config file found at /workspace/testeranto/allTests.json";
//          echo "Contents of config file (first 200 chars):";
// head - c 200 / workspace / testeranto / allTests.json;
//          echo "";
//          # Run the Go metafile generator
//          echo "Running Go metafile generator...";
// set + e
//   / usr / local / bin / golang - main / workspace / testeranto / allTests.json
// EXIT_CODE = $ ?
//   set - e
         
//          echo "Go metafile generator exited with code: $EXIT_CODE";
//          echo "Checking generated metafile:";
// ls - la / workspace / testeranto / metafiles / golang / 2 > /dev/null || echo "Go metafiles directory not found";
// if [-f / workspace / testeranto / metafiles / golang / allTests.json]; then
//            echo "Metafile exists at /workspace/testeranto/metafiles/golang/allTests.json";
//            echo "Metafile size:";
// wc - c / workspace / testeranto / metafiles / golang / allTests.json;
//            echo "Metafile contents (first 500 chars):";
// head - c 500 / workspace / testeranto / metafiles / golang / allTests.json;
//            echo "";
//          else
//            echo "❌ Metafile not generated!";
//            # Create an empty metafile to satisfy healthcheck
//            echo "Creating empty metafile...";
// mkdir - p / workspace / testeranto / metafiles / golang
//            echo '{"binaries":[]}' > /workspace/testeranto / metafiles / golang / allTests.json
// fi
//          echo "Checking generated binaries:";
// ls - la / workspace / testeranto / bundles / allTests / golang / 2 > /dev/null || echo "Bundles directory not found";
//          echo "Listing all files in bundles directory:";
// find / workspace / testeranto / bundles / allTests / golang - type f 2 > /dev/null || echo "No files found";
//        else
//          echo "Config file NOT found at /workspace/testeranto/allTests.json";
//          echo "Creating empty metafile to satisfy healthcheck...";
// mkdir - p / workspace / testeranto / metafiles / golang
//          echo '{"binaries":[]}' > /workspace/testeranto / metafiles / golang / allTests.json
//          echo "Searching for config files...";
// find / workspace - name "allTests.json" - type f 2 > /dev/null | head - 10;
// fi
       
//        echo "Go build service ready. Keeping container alive...";
// while true; do
//          sleep 3600
//        done`,
