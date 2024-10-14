import { BuildOptions } from "esbuild";
import path from "path";

import { IBaseConfig } from "../Types";

import baseEsBuildConfig from "./index.js";


export default (
  config: IBaseConfig,
  entryPoints: Set<string> | string[]
): BuildOptions => {
  return {

    ...baseEsBuildConfig(config),

    // inject: ['./node_modules/testeranto/dist/cjs-shim.js'],
    // banner: {
    //   js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
    // },

    outdir: config.outdir + "/web",

    alias: {
      react: path.resolve("./node_modules/react")
    },

    external: [
      "tests.test.js",
      "features.test.js",
      // "url", 
      // "react",
      "electron",
      "path",
      "fs",
      "stream",
    ],

    platform: "browser",

    entryPoints: [...entryPoints],

    plugins: [
      ...(config.webPlugins || []),
      {
        name: 'rebuild-notify',
        setup(build) {
          build.onEnd(result => {
            console.log(`web build ended with ${result.errors.length} errors`);
            console.log(result)
            result.errors.length !== 0 && process.exit(-1);
          })
        }
      },
    ],
  };
}