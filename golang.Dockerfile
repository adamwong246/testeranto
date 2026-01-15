FROM golang:1.22
WORKDIR /workspace

# Copy go.mod and go.sum from the example directory
COPY example/go.mod example/go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY example/ ./

# Build the main application
#  don't do this
# RUN go build -o main .
