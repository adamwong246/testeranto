import { BuildOptions } from "esbuild";
import path from "path";

import { IBaseConfig } from "../lib/types.js";

import baseEsBuildConfig from "./index.js";

export default (
  config: IBaseConfig,
  entryPoints: Set<string> | string[]
): BuildOptions => {
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

    external: [
      "testeranto.json",
      "features.test.ts",
      // "url",
      "react",

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
      ...(config.webPlugins || []),
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
