FROM golang:1.21-alpine
WORKDIR /workspace

# Install git for Go modules
RUN apk add --no-cache git

# Create necessary directories
RUN mkdir -p /workspace/testeranto/bundles/allTests/golang &&     mkdir -p /workspace/testeranto/metafiles/golang

# Copy and compile the Go metafile generator
COPY src/server/runtimes/golang/main.go /workspace/src/server/runtimes/golang/main.go
RUN go build -o /usr/local/bin/golang-main src/server/runtimes/golang/main.go

# Install golangci-lint using the version from the example project
# First, create a temporary go.mod with golangci-lint dependency
RUN mkdir -p /tmp/golangci-install &&     cd /tmp/golangci-install &&     echo 'module temp' > go.mod &&     echo 'go 1.21' >> go.mod &&     echo 'require github.com/golangci/golangci-lint v1.60.3' >> go.mod &&     go mod download &&     go install github.com/golangci/golangci-lint/cmd/golangci-lint@v1.60.3

