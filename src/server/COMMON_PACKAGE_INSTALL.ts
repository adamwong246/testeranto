// Common package installation
export const COMMON_PACKAGE_INSTALL = `RUN npm install -g node-gyp
COPY package.json .
# Try yarn install, fallback to npm install if it fails
ENV npm_config_build_from_source=false
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN (yarn install --ignore-engines || npm install --legacy-peer-deps) && \\
    npm cache clean --force && \\
    yarn cache clean || true
COPY ./src ./src/`;
