/* eslint-disable @typescript-eslint/no-unused-vars */

import { BuildOptions } from "esbuild";
import featuresPlugin from "../../../esbuildConfigs/featuresPlugin.js";
import baseEsBuildConfig from "../../../esbuildConfigs/index.js";
import inputFilesPlugin from "../../../esbuildConfigs/inputFilesPlugin.js";
import rebuildPlugin from "../../../esbuildConfigs/rebuildPlugin.js";
import { ITestconfig } from "../../../Types.js";

const absoluteBundlesDir = (c: ITestconfig): string => {
  return "./testeranto/bundles/allTests/web/";
};

export default (config: ITestconfig, testName: string): BuildOptions => {
  // Use the same entry points as node tests for consistency
  const entrypoints = ["./example/Calculator.test.ts"];

  const { inputFilesPluginFactory, register } = inputFilesPlugin(
    "web",
    testName
  );

  return {
    ...baseEsBuildConfig(config),
    outdir: absoluteBundlesDir(config),
    outbase: ".",
    metafile: true,
    supported: {
      "dynamic-import": true,
    },
    define: {
      "process.env.FLUENTFFMPEG_COV": "0",
      ENV: `"web"`,
    },
    absWorkingDir: process.cwd(),
    platform: "browser",
    packages: "external",
    entryPoints: entrypoints,
    bundle: true,
    format: "esm",
    plugins: [
      featuresPlugin,
      inputFilesPluginFactory,
      rebuildPlugin("web"),
      ...(config.web?.plugins?.map((p) => p(register, entrypoints)) || []),
    ],
  };
};
