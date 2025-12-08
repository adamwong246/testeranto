/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sassPlugin } from "esbuild-sass-plugin";
import { ITestconfig } from "./src/Types";

import {
  CHECKS_CONFIG,
  createLangConfig,
  DOUBLE_PROD_BLOCK,
  GOLANG_BUILD_STEPS,
  SINGLE_PROD_BLOCK,
  SINGLE_TEST_BLOCK,
  WEB_BUILD_STEPS,
} from "./allTestsUtils";

const config: ITestconfig = {
  featureIngestor: function (s: string): Promise<string> {
    throw new Error("Function not implemented.");
  },
  importPlugins: [],
  ports: ["3333", "3334"],
  src: "",
  test: SINGLE_TEST_BLOCK,
  prod: SINGLE_PROD_BLOCK,
  checks: CHECKS_CONFIG,
  build: [GOLANG_BUILD_STEPS],

  processPool: {
    maxConcurrent: 4,
    timeoutMs: 30000,
  },

  chrome: {
    sharedInstance: true,
    maxContexts: 6,
    memoryLimitMB: 512,
  },

  golang: createLangConfig(
    ["compiled", "golang:1.21-alpine"],
    "example/Calculator.golingvu.test.go",
    {
      prodBlocks: DOUBLE_PROD_BLOCK,
      build: [GOLANG_BUILD_STEPS],
      // For compiled languages, static analysis happens post-build
      // using the metafile generated during compilation
    }
  ),

  python: createLangConfig(
    ["interpreted", "python:3.11-alpine"],
    "example/Calculator.pitono.test.py",
    {
      processPool: {
        maxConcurrent: 3,
        timeoutMs: 20000,
      },
      // For interpreted languages, static analysis happens pre-test
      // in the same service before test execution
    }
  ),

  web: createLangConfig(
    ["chrome", "node:20.19.4-alpine-chrome"],
    "example/Calculator.test.ts",
    {
      plugins: [() => sassPlugin()],
      loaders: { ".ttf": "file" },
      chrome: {
        sharedInstance: true,
        maxContexts: 4,
        memoryLimitMB: 256,
      },
      // For web, static analysis happens pre-build
      // before bundling assets for the browser
      build: [WEB_BUILD_STEPS],
    }
  ),

  node: createLangConfig(
    ["interpreted", "node:20.19.4-alpine"],
    "example/Calculator.test.ts",
    {
      processPool: {
        maxConcurrent: 5,
        timeoutMs: 25000,
      },
      // For interpreted languages, static analysis happens pre-test
      // in the same service before test execution
    }
  ),
};

export default config;
