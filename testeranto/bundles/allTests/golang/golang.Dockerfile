FROM golang:1.21-alpine
WORKDIR /workspace

# Install git for Go modules and golangci-lint
RUN apk add --no-cache git curl
# Install golangci-lint
RUN curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b /usr/local/bin v1.60.3

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/golang &&     mkdir -p /workspace/testeranto/metafiles/golang

# Copy all Go source files for the metafile generator
COPY src/server/runtimes/golang/ /workspace/src/server/runtimes/golang/

# Create a go.mod file for the metafile generator if it doesn't exist
RUN cd /workspace/src/server/runtimes/golang &&     if [ ! -f go.mod ]; then         go mod init golang-metafile-generator &&         echo "Created new go.mod file";     else         echo "go.mod already exists, skipping initialization";     fi &&     echo "=== Go files present: ===" &&     ls *.go

# Download dependencies for the metafile generator
RUN cd /workspace/src/server/runtimes/golang &&     echo "=== Downloading dependencies ===" &&     go mod download

# Compile the Go metafile generator (build with all Go files)
RUN cd /workspace/src/server/runtimes/golang &&     echo "=== Building in directory: $(pwd) ===" &&     go build -buildvcs=false -o /usr/local/bin/golang-main .


