FROM node:20.19.4-alpine
WORKDIR /workspace
COPY ./tsconfig*.json ./
COPY package.json /workspace
COPY ./.yarnrc.yml ./
RUN apk add --no-cache python3 libxml2-utils make build-base g++ git pkgconfig
RUN ln -sf python3 /usr/bin/python
ENV npm_config_python=/usr/bin/python3
ENV PYTHON=/usr/bin/python3
RUN yarn install --immutable
