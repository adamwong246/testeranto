import { COMMON_PACKAGE_INSTALL } from "./COMMON_PACKAGE_INSTALL";

export const setupDockerfileForBuildGolang = (config: string): string => {
  const goSpecificPackages = `\\
    wget`;

  return `FROM node:18-alpine
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
    libxml2-utils${goSpecificPackages} && \\
    rm -rf /var/cache/apk/*
# Install Go
RUN wget -q -O - https://go.dev/dl/go1.21.0.linux-amd64.tar.gz | tar -xz -C /usr/local
ENV GOROOT=/usr/local/go
ENV PATH=$PATH:$GOROOT/bin
${COMMON_PACKAGE_INSTALL}
COPY ${config} .
COPY dist/prebuild/builders/golang.mjs ./golang.mjs
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/golang.mjs ${config}"]
`;
};
