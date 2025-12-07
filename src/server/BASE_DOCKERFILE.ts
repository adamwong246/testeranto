export const BASE_DOCKERFILE = `// Common base Dockerfile content
FROM node:18-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \\
    build-base \\
    python3 \\
    py3-pip \\
    cairo-dev \\
    pango-dev \\
    jpeg-dev \\
    giflib-dev \\
    librsvg-dev \\
    libxml2-utils && \\
    rm -rf /var/cache/apk/*`;
