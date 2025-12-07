import { BASE_DOCKERFILE } from "./constants/BASE_DOCKERFILE";

export const setupDockerfileForBuildNode = (config) => {
  return `${BASE_DOCKERFILE}
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
COPY dist/prebuild/builders/node.mjs ./node.mjs
# The actual build command will be provided by the docker-compose service command
# No CMD here, let the service command override
`;
};
