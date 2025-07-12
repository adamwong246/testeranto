import { BuildOptions } from "esbuild";

import { ITestconfig } from "../lib/index.js";

import baseEsBuildConfig from "./index.js";
import inputFilesPlugin from "./inputFilesPlugin.js";
import featuresPlugin from "./featuresPlugin.js";

import { isBuiltin } from "node:module";
import { consoleDetectorPlugin } from "./consoleDetectorPlugin.js";

export default (
  config: ITestconfig,
  entryPoints: string[],
  testName: string
): BuildOptions => {
  const { inputFilesPluginFactory, register } = inputFilesPlugin(
    "pure",
    testName
  );
  return {
    ...baseEsBuildConfig(config),

    drop: [],

    splitting: true,

    outdir: `testeranto/bundles/pure/${testName}/`,

    // inject: [`./node_modules/testeranto/dist/cjs-shim.js`],
    metafile: true,
    supported: {
      "dynamic-import": true,
    },

    define: {
      "process.env.FLUENTFFMPEG_COV": "0",
    },
    absWorkingDir: process.cwd(),
    banner: {
      js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
    },
    platform: "node",

    external: ["react", ...config.externals],

    entryPoints: [...entryPoints],
    plugins: [
      featuresPlugin,

      inputFilesPluginFactory,

      consoleDetectorPlugin,

      {
        name: "native-node-import-filter",
        setup(build) {
          build.onResolve({ filter: /fs/ }, (args) => {
            if (isBuiltin(args.path)) {
              throw new Error(
                `cannot use native node package "${args.path}" in a "pure" test. If you really want to use this package, convert this test from "pure" to "node"`
              );
            }

            return { path: args.path };
          });
        },
      },

      {
        name: "rebuild-notify",
        setup: (build) => {
          build.onStart(() => {
            console.log(`> pure build starting...`);
          });
          build.onEnd((result) => {
            console.log(
              `> pure build ended with ${result.errors.length} errors`
            );
            if (result.errors.length > 0) {
              console.log(result);
            }
            // console.log(result);
            // result.errors.length !== 0 && process.exit(-1);
          });
        },
      },

      ...((config.nodePlugins || []).map((p) => p(register, entryPoints)) ||
        []),
    ],
  };
};
