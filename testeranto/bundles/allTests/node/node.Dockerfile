
FROM node:20-alpine
WORKDIR /workspace
COPY . .
RUN npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional
RUN npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional
RUN npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional
RUN mkdir -p /workspace/testeranto/bundles/allTests/node
RUN mkdir -p /workspace/testeranto/metafiles/node
EXPOSE 3456
ENV BUNDLES_DIR=/workspace/testeranto/bundles/allTests/node
ENV METAFILES_DIR=/workspace/testeranto/metafiles/node
ENV IN_DOCKER=true
HEALTHCHECK --interval=10s --timeout=30s --retries=10 --start-period=60s \
  CMD [ -f /workspace/testeranto/metafiles/node/allTests.json ] && echo "healthy" || exit 1
