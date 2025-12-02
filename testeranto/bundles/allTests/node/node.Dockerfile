
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache     build-base     python3     py3-pip     cairo-dev     pango-dev     jpeg-dev     giflib-dev     librsvg-dev     libxml2-utils
RUN npm install -g node-gyp tsx
COPY package.json .
RUN yarn install --ignore-engines
RUN npm install -g tsx
COPY ./src ./src/
COPY allTests.ts .
COPY dist/prebuild/builders/node.mjs ./node.mjs
# Create the full metafiles directory structure before CMD
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/metafiles/node
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/node.mjs allTests.ts"]
