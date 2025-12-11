import { COMMON_PACKAGE_INSTALL } from "../../constants/COMMON_PACKAGE_INSTALL";
import { baseNodeImage } from "../../nodeVersion";

export function setupDockerfileForBuildWeb(config: string): string {
  const webSpecificPackages = `\\
    chromium \\
    nss \\
    freetype \\
    freetype-dev \\
    harfbuzz \\
    ca-certificates \\
    ttf-freefont \\
    font-noto-emoji`;

  return `FROM ${baseNodeImage}
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
    libxml2-utils${webSpecificPackages} && \\
    rm -rf /var/cache/apk/*
RUN npm install -g node-gyp
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
${COMMON_PACKAGE_INSTALL}
COPY ${config} .
COPY dist/prebuild/server/builders/web.mjs ./web.mjs
# Default command that keeps the container alive
# The actual build command will be run by docker-compose
CMD ["sh", "-c", "echo 'Web build service started' && tail -f /dev/null"]
`;
}
