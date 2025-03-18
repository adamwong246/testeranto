import { BuildOptions } from "esbuild";
import path from "path";

// import pkg from "esbuild-plugin-markdown";
// const { markdownPlugin } = pkg;

import { IBaseConfig } from "../lib/types.js";

import baseEsBuildConfig from "./index.js";
import inputFilesPlugin from "./inputFilesPlugin.js";
import featuresPlugin from "./featuresPlugin.js";

export default (
  config: IBaseConfig,
  entryPoints: Set<string> | string[]
): BuildOptions => {
  const { inputFilesPluginFactory, register } = inputFilesPlugin(
    "web",
    entryPoints
  );

  return {
    ...baseEsBuildConfig(config),

    // inject: ["./node_modules/testeranto/dist/cjs-shim.js"],
    // banner: {
    //   js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
    // },

    // splitting: true,

    outdir: config.outdir + "/web",

    alias: {
      react: path.resolve("./node_modules/react"),
    },

    metafile: true,

    external: [
      // "testeranto.json",
      // "features.test.ts",
      // "url",
      // "react",

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

      // markdownPlugin({}),
      ...(config.nodePlugins.map((p) => p(register, entryPoints)) || []),
      inputFilesPluginFactory,
      {
        name: "rebuild-notify",
        setup(build) {
          build.onEnd((result) => {
            console.log(`web build ended with ${result.errors.length} errors`);
            if (result.errors.length > 0) {
              console.log(result);
            }
            // console.log(result);
            // result.errors.length !== 0 && process.exit(-1);
          });
        },
      },
    ],
  };
};
