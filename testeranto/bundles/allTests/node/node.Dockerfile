
FROM node:20.19.4-alpine
WORKDIR /workspace
COPY ./tsconfig*.json ./
COPY ./package.json ./package.json
COPY ./.yarnrc.yml ./

RUN apk add --no-cache python3 make g++ libxml2-utils

RUN yarn install

