export const nodeDockerFile = `
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
HEALTHCHECK --interval=10s --timeout=30s --retries=10 --start-period=60s \\
  CMD [ -f /workspace/testeranto/metafiles/node/allTests.json ] && echo "healthy" || exit 1
CMD ["sh", "-c", "echo 'Starting node build in watch mode...'; \\
  echo 'Installing dependencies in /workspace/node_modules...'; \\
  cd /workspace && \\
  rm -f .npmrc .npmrc.* || true && \\
  npm cache clean --force && \\
  npm config delete _auth 2>/dev/null || true && \\
  npm config delete _authToken 2>/dev/null || true && \\
  npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true && \\
  npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true && \\
  npm config delete always-auth 2>/dev/null || true && \\
  npm config delete registry 2>/dev/null || true && \\
  npm config set registry https://registry.npmjs.org/ && \\
  npm config set always-auth false && \\
  npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo 'npm install may have warnings'; \\
  echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...'; \\
  npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional || echo 'esbuild installation may have issues'; \\
  npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional || echo 'esbuild-sass-plugin installation may have issues'; \\
  echo 'Creating output directory...'; \\
  mkdir -p /workspace/testeranto/bundles/allTests/node; \\
  mkdir -p /workspace/testeranto/metafiles/node; \\
  echo 'BUNDLES_DIR env:' \\"$BUNDLES_DIR\\"; \\
  echo 'Starting build process for node...'; \\
  TEST_NAME=allTests WS_PORT=3456 npx tsx dist/prebuild/server/runtimes/node/node.mjs allTests.ts dev || echo 'Build process exited with code $?, but keeping container alive for health checks'"]`;
export default nodeDockerFile;
