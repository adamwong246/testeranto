import { BuildOptions } from "esbuild";
import featuresPlugin from "../../../esbuildConfigs/featuresPlugin.js";
import baseEsBuildConfig from "../../../esbuildConfigs/index.js";
import inputFilesPlugin from "../../../esbuildConfigs/inputFilesPlugin.js";
import rebuildPlugin from "../../../esbuildConfigs/rebuildPlugin.js";
import { ITestconfig } from "../../../Types.js";

const absoluteBundlesDir = (c: ITestconfig): string => {
  return "./testeranto/bundles/allTests/node/";
};

export default (
  config: ITestconfig,
  testName: string
): BuildOptions => {
  // Get entry points from config, or use a default
  let entrypoints: string[] = [];
  if (config.node?.tests) {
    entrypoints = Object.keys(config.node.tests);
  } else {
    // Fallback to a reasonable default
    entrypoints = ["./example/Calculator.test.ts"];
    console.warn(`No node.tests found in config, using default entry point: ${entrypoints[0]}`);
  }

  const { inputFilesPluginFactory, register } = inputFilesPlugin(
    "node",
    testName
  );

  return {
    ...baseEsBuildConfig(config),

    outdir: absoluteBundlesDir(config),
    outbase: ".", // Preserve directory structure relative to outdir
    metafile: true,
    supported: {
      "dynamic-import": true,
    },

    define: {
      "process.env.FLUENTFFMPEG_COV": "0",
      ENV: `"node"`,
    },

    bundle: true,
    format: "esm",

    absWorkingDir: process.cwd(),
    platform: "node",

    packages: "external",

    entryPoints: entrypoints,
    plugins: [
      featuresPlugin,
      inputFilesPluginFactory,
      rebuildPlugin("node"),
      ...(config.node?.plugins?.map((p) => p(register, entrypoints)) || []),
    ],
  };
};
