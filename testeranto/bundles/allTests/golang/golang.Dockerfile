
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache     build-base     python3     py3-pip     cairo-dev     pango-dev     jpeg-dev     giflib-dev     librsvg-dev     libxml2-utils     wget
# Install Go
RUN wget -q -O - https://go.dev/dl/go1.21.0.linux-amd64.tar.gz | tar -xz -C /usr/local
ENV GOROOT=/usr/local/go
ENV PATH=$PATH:$GOROOT/bin
RUN npm install -g node-gyp
COPY package.json .
RUN yarn install --ignore-engines
COPY ./src ./src/
COPY allTests.ts .
COPY dist/prebuild/builders/golang.mjs ./golang.mjs
# Create the full directory structure before CMD
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/allTests
RUN mkdir -p /workspace/testeranto/bundles/allTests/golang
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/golang
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/golang.mjs allTests.ts"]
