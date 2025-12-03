/* eslint-disable @typescript-eslint/no-unused-vars */
import { sassPlugin } from "esbuild-sass-plugin";
import { ITestconfig } from "./src/Types";

const config: ITestconfig = {
  featureIngestor: function (s: string): Promise<string> {
    throw new Error("Function not implemented.");
  },
  importPlugins: [],
  ports: ["3333"],
  src: "",
  golang: {
    plugins: [],
    loaders: {},
    tests: {
      "src/example/Calculator.golingvu.test.go": { ports: 0 },
    },
    dockerfile: [[["FROM", "golang:latest"]], "go"],
  },
  python: {
    plugins: [],
    loaders: {},
    tests: {
      "src/example/Calculator.pitono.test.py": { ports: 0 },
    },
    dockerfile: [[["FROM", "python:latest"]], "python"],
  },

  web: {
    plugins: [() => sassPlugin()],
    loaders: {
      ".ttf": "file",
    },
    tests: {
      "src/example/Calculator.test.ts": { ports: 0 },
    },
    externals: [],
    dockerfile: [
      [
        ["FROM", "node:18-alpine"],
        [
          "RUN",
          `
# Install Chromium and necessary dependencies for headless operation
RUN apk update && apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji \
    && rm -rf /var/cache/apk/*
          `,
        ],
        ["ENV", "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true"],
        ["ENV", "PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser"],
      ],
      "web",
    ],
  },

  node: {
    plugins: [],
    loaders: {},
    tests: {
      "src/example/Calculator.test.ts": { ports: 0 },
    },
    externals: [],
    dockerfile: [
      [
        ["FROM", "node:18-alpine"],
        [
          "RUN",
          "apk add --update make g++ linux-headers python3 libxml2-utils netcat-openbsd",
        ],
        ["COPY", "package*.json ./"],
        ["WORKDIR", "/workspace"],
        ["RUN", "npm install --legacy-peer-deps"],
        ["COPY", "./src ./src"],
        [
          "STATIC_ANALYSIS",
          (files) => ["tsc", "yarn tsc ./src --noEmit", ...files],
        ],
        ["STATIC_ANALYSIS", (files) => ["eslint", "yarn eslint", ...files]],
      ],
      "node",
    ],
  },
};

export default config;
