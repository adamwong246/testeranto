/* eslint-disable @typescript-eslint/no-explicit-any */
import { BuildOptions } from "esbuild";
import { polyfillNode } from "esbuild-plugin-polyfill-node";
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

    loader: config.webLoaders as any,

    plugins: [
      featuresPlugin,
      inputFilesPluginFactory,

      polyfillNode({
        // You might need to configure specific Node.js modules you want to polyfill
        // Example:
        // modules: {
        //   'util': true,
        //   'fs': false,
        // }
      }),

      rebuildPlugin("web"),

      ...((config.webPlugins || []).map((p) => p(register, entryPoints)) || []),
    ],
  };
};
