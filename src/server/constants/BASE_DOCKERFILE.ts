import { baseNodeImage } from "../nodeVersion";

export const BASE_DOCKERFILE = `FROM ${baseNodeImage}
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
    libxml2-utils \\
    netcat-openbsd \\
    make \\
    g++ \\
    linux-headers && \\
    rm -rf /var/cache/apk/*`;
