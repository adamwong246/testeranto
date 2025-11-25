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
      "example/Calculator.golingvu.test.go": { ports: 0 },
    },
    dockerfile: [["FROM", "golang:latest"]],
  },
  python: {
    plugins: [],
    loaders: {},
    tests: {
      "example/Calculator.pitono.test.py": { ports: 0 },
    },
    dockerfile: [["FROM", "python:latest"]],
  },

  web: {
    plugins: [() => sassPlugin()],
    loaders: {
      ".ttf": "file",
    },
    tests: {
      "example/Calculator.test.ts": { ports: 0 },
    },
    externals: [],
    dockerfile: [["FROM", "node:latest"]],
  },

  node: {
    plugins: [],
    loaders: {},
    tests: {
      "example/Calculator.test.ts": { ports: 0 },
    },
    externals: [],
    dockerfile: [
      [
        ["FROM", "node:latest"],
        [
          "RUN",
          "apk add --update make g++ linux-headers python3 libxml2-utils",
        ],
        ["COPY", "package*.json ./"],
        ["WORKDIR", "/workspace"],
        ["RUN", "yarn install install --legacy-peer-deps"],
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
