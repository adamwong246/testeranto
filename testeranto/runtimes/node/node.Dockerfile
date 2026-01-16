# syntax=docker/dockerfile:1

FROM node:20.19.4-alpine as build
WORKDIR /workspace
COPY ./allTests.ts ./
COPY ./tsconfig*.json ./
COPY package.json /workspace
COPY ./.yarnrc.yml ./
RUN apk add --no-cache python3 libxml2-utils make build-base g++ git pkgconfig
RUN ln -sf python3 /usr/bin/python
ENV npm_config_python=/usr/bin/python3
ENV PYTHON=/usr/bin/python3
RUN yarn install 
# --immutable

# Resumbably, the user provides the but we ignore it
CMD yarn run

# FROM build as testeranto/lintcheck
# CMD yarn eslint

# FROM build as testeranto/typecheck
# CMD yarn tsc

# FROM build as testeranto
# CMD builder runs here


