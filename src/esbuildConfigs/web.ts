import { BuildOptions } from "esbuild";
import path from "path";

import { IBaseConfig } from "../lib/index.js";

import baseEsBuildConfig from "./index.js";
import inputFilesPlugin from "./inputFilesPlugin.js";
import featuresPlugin from "./featuresPlugin.js";

export default (
  config: IBaseConfig,
  entryPoints: Set<string> | string[],
  testName: string
): BuildOptions => {
  const { inputFilesPluginFactory, register } = inputFilesPlugin(
    "web",
    testName
  );

  return {
    ...baseEsBuildConfig(config),

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

    plugins: [
      featuresPlugin,
      inputFilesPluginFactory,
      {
        name: "rebuild-notify",
        setup: (build: any) => {
          build.onEnd((result) => {
            console.log(
              `> web build ended with ${result.errors.length} errors`
            );
            if (result.errors.length > 0) {
              console.log(result);
            }
            // console.log(result);
            // result.errors.length !== 0 && process.exit(-1);
          });
        },
      },

      ...((config.webPlugins || []).map((p) => p(register, entryPoints)) || []),
    ],
  };
};
