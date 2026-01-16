FROM golang:1.22
WORKDIR /workspace/example

RUN go mod download
