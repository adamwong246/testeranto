FROM node:18-alpine
RUN apk add --update make g++ linux-headers python3 libxml2-utils
COPY package*.json ./
WORKDIR /workspace
RUN npm install --legacy-peer-deps
COPY ./src ./src
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/reports
