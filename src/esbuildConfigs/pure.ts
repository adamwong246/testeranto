import { BuildOptions } from "esbuild";

import { ITestconfig } from "../lib/index.js";

import baseEsBuildConfig from "./index.js";
import inputFilesPlugin from "./inputFilesPlugin.js";
import featuresPlugin from "./featuresPlugin.js";

import { isBuiltin } from "node:module";
import { consoleDetectorPlugin } from "./consoleDetectorPlugin.js";
import rebuildPlugin from "./rebuildPlugin.js";
import { nativeImportDetectorPlugin } from "./nativeImportDetectorPlugin.js";

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

      // nativeImportDetectorPlugin,
      {
        name: "native-node-import-filter",
        setup(build) {
          build.onResolve({ filter: /fs/ }, (args) => {
            if (isBuiltin(args.path)) {
              throw new Error(
                `You attempted to import a node module "${args.path}" into a "pure" test, which is not allowed. If you really want to use this package, convert this test from "pure" to "node"`
              );
            }

            return { path: args.path };
          });
        },
      },

      rebuildPlugin("pure"),

      ...((config.nodePlugins || []).map((p) => p(register, entryPoints)) ||
        []),
    ],
  };
};
