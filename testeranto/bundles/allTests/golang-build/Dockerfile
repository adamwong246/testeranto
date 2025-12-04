FROM golang:1.21-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \
    build-base \
    git \
    nodejs \
    npm \
    && rm -rf /var/cache/apk/*
RUN npm install -g tsx
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY ./src ./src/
COPY allTests.ts .
# Copy builders source code
COPY ./src/builders ./src/builders/
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/golang
RUN mkdir -p /workspace/testeranto/bundles/golang/allTests
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/golang
ENV BUNDLES_DIR=/workspace/testeranto/bundles/golang/allTests
ENV METAFILES_DIR=/workspace/testeranto/metafiles/golang
ENV TESTERANTO_RUNTIME=golang
ENV GO111MODULE=on
# Run the golang builder using tsx
CMD ["tsx", "src/builders/golang.ts", "allTests.ts"]
