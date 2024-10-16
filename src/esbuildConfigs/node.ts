import { BuildOptions } from "esbuild";

import { IBaseConfig, IJsonConfig } from "../Types";

import baseEsBuildConfig from "./index.js";
import { jsonc } from "jsonc";
import fs from "fs"

// const jsonConfig = jsonc.parse((await fs.readFileSync("./testeranto.json")).toString()) as IJsonConfig;

export default (
  config: IBaseConfig,
  entryPoints: Set<string> | string[]
): BuildOptions => {
  return {
    ...baseEsBuildConfig(config),

    outdir: config.outdir + "/node",

    inject: [`./node_modules/testeranto/dist/cjs-shim.js`],

    supported: {
      "dynamic-import": true
    },

    define: {
      "process.env.FLUENTFFMPEG_COV": "0"
    },
    absWorkingDir: process.cwd(),
    banner: {
      js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
    },
    platform: "node",

    external: [
      "testeranto.json",
      "features.test.js",
      "react",
      "events",
      // "ganache"
      ...config.externals
    ],

    entryPoints: [...entryPoints],
    plugins: [
      ...(config.nodePlugins || []),
      {
        name: 'rebuild-notify',
        setup(build) {
          build.onEnd(result => {
            console.log(`node build ended with ${result.errors.length} errors`);
            console.log(result)
            result.errors.length !== 0 && process.exit(-1);
          })
        }
      },
    ],
  };
}