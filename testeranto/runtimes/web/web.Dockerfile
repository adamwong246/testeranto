FROM node:20.19.4-alpine
WORKDIR /workspace
COPY ./tsconfig*.json ./
COPY ./package.json ./package.json
COPY ./.yarnrc.yml ./

RUN apk add --no-cache \
    --repository dl-cdn.alpinelinux.org \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    python3 make g++ libxml2-utils \
    net-tools curl

RUN yarn install

# Expose port for Chrome remote debugging
EXPOSE 9222
