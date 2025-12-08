import { BASE_DOCKERFILE } from "../constants/BASE_DOCKERFILE";

export const setupDockerfileForBuildNode = (config) => {
  return `${BASE_DOCKERFILE}
# Create necessary directories for build service
RUN mkdir -p /workspace/testeranto/bundles/allTests/node
RUN mkdir -p /workspace/testeranto/metafiles/node

RUN npm install -g node-gyp tsx
COPY package.json .
# Try yarn install, fallback to npm install if it fails
ENV npm_config_build_from_source=false
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN (yarn install --ignore-engines || npm install --legacy-peer-deps) && \\
    npm install -g tsx && \\
    npm cache clean --force && \\
    yarn cache clean || true
COPY ./src ./src/
COPY ${config} .
ARG NODE_MJS_HASH
# Use the hash to bust cache for the node.mjs copy
RUN echo "Node.mjs hash: $NODE_MJS_HASH" > /tmp/node-mjs-hash.txt
COPY dist/prebuild/server/builders/node.mjs ./node.mjs

# Default command that keeps the container alive
# This will be overridden by docker-compose, but serves as a fallback
CMD ["sh", "-c", "echo 'Build service started' && tail -f /dev/null"]
`;
};
