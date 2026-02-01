import { BuildOptions } from "esbuild";
import featuresPlugin from "../../../esbuildConfigs/featuresPlugin.js";
import baseEsBuildConfig from "../../../esbuildConfigs/index.js";
import inputFilesPlugin from "../../../esbuildConfigs/inputFilesPlugin.js";
import rebuildPlugin from "../../../esbuildConfigs/rebuildPlugin.js";
import { ITestconfigV2 } from "../../types.js";


const absoluteBundlesDir = (): string => {
  return "./testeranto/bundles/allTests/node/";
};

export default (
  nodeConfig: object,
  testName: string,
  projectConfig: ITestconfigV2
): BuildOptions => {

  console.log("esbuild", testName, projectConfig)

  const entryPoints = projectConfig.runtimes[testName].tests;
  // Get entry points from config, or use a default
  // let entrypoints: string[] = [];
  // if (nodeConfig) {
  //   entrypoints = (projectConfig.tests);
  // } else {
  //   // console.log(projectConfig)
  //   throw "projectConfig.node.tests should exist"
  //   // Fallback to a reasonable default
  //   // entrypoints = ["./example/Calculator.test.ts"];
  //   // console.warn(`No node.tests found in config, using default entry point: ${entrypoints[0]}`);
  // }

  const { inputFilesPluginFactory, register } = inputFilesPlugin(
    "node",
    testName
  );

  return {
    ...baseEsBuildConfig(nodeConfig),

    outdir: absoluteBundlesDir(),
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

    entryPoints,
    plugins: [
      featuresPlugin,
      inputFilesPluginFactory,
      rebuildPlugin("node"),
      ...(nodeConfig.plugins?.map((p) => p(register, entryPoints)) || []),
    ],
  };
};
