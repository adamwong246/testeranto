import type { Plugin } from "esbuild";

import { isBuiltin } from "node:module";

export const nativeImportDetectorPlugin: Plugin = {
  name: "native-node-import-filter",
  setup(build) {
    build.onResolve({ filter: /fs/ }, (args) => {
      if (isBuiltin(args.path)) {
        return {
          warnings: [
            {
              text: `cannot use native node package "${args.path}" in a "pure" test. If you really want to use this package, convert this test from "pure" to "node"`,
            },
          ],
        };

        // throw new Error(
        //   `cannot use native node package "${args.path}" in a "pure" test. If you really want to use this package, convert this test from "pure" to "node"`
        // );
      }

      return { path: args.path };
    });
  },
};
