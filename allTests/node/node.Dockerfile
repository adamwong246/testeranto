
  FROM node:latest
  WORKDIR /workspace
  COPY node_modules/testeranto/prebuilds/builds/node.mjs
  RUN build-node.mjs
  