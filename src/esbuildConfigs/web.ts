/* eslint-disable @typescript-eslint/no-explicit-any */
import { BuildOptions } from "esbuild";
import path from "path";
import { ITestconfig } from "../lib/index.js";
import featuresPlugin from "./featuresPlugin.js";
import baseEsBuildConfig from "./index.js";
import inputFilesPlugin from "./inputFilesPlugin.js";
import rebuildPlugin from "./rebuildPlugin.js";

export default (
  config: ITestconfig,
  entryPoints: string[],
  testName: string
): BuildOptions => {
  const { inputFilesPluginFactory, register } = inputFilesPlugin(
    "web",
    testName
  );

  return {
    ...baseEsBuildConfig(config),

    define: {
      "process.env.FLUENTFFMPEG_COV": "0",
      ENV: `"web"`,
    },

    treeShaking: true,
    outdir: `testeranto/bundles/web/${testName}`,

    alias: {
      react: path.resolve("./node_modules/react"),
    },

    metafile: true,

    external: [
      "path",
      "fs",
      "stream",
      "http",
      "constants",
      "net",
      "assert",
      "tls",
      "os",
      "child_process",
      "readline",
      "zlib",
      "crypto",
      "https",
      "util",
      "process",
      "dns",
    ],

    platform: "browser",

    entryPoints: [...entryPoints],

    loader: config.web.loaders as any,

    plugins: [
      featuresPlugin,
      inputFilesPluginFactory,

      rebuildPlugin("web"),

      ...((config.web.plugins || []).map((p) => p(register, entryPoints)) ||
        []),
    ],
  };
};
