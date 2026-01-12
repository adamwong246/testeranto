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
  // entryPoints: string[],
  testName: string
  // bundlesDir: string
): BuildOptions => {
  // const entrypoints: string[] = [];

  const entrypoints = ["./example/Calculator.test.ts"]; //Object.keys(config.node.tests);

  const { inputFilesPluginFactory, register } = inputFilesPlugin(
    "node",
    testName
  );

  return {
    ...baseEsBuildConfig(config),

    // splitting: false, // Disable splitting since each entry point is separate

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

    // external: ["react", ...config.node.externals],
    packages: "external",

    entryPoints: entrypoints,
    plugins: [
      featuresPlugin,
      inputFilesPluginFactory,
      rebuildPlugin("node"),
      ...(config.node.plugins.map((p) => p(register, entrypoints)) || []),
    ],
  };
};
