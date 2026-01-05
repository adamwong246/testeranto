

FROM node:20.19.4-alpine
WORKDIR /workspace

EXPOSE 3456
ENV BUNDLES_DIR=/workspace/testeranto/bundles/allTests/web
ENV METAFILES_DIR=/workspace/testeranto/metafiles/web
ENV IN_DOCKER=true

COPY ./src ./src

# Install system dependencies
RUN apk add --no-cache python3 make g++ libxml2-utils

# Install dependencies
RUN yarn install

