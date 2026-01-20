"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeImportDetectorPlugin = void 0;
const node_module_1 = require("node:module");
exports.nativeImportDetectorPlugin = {
    name: "native-node-import-filter",
    setup(build) {
        build.onResolve({ filter: /fs/ }, (args) => {
            if ((0, node_module_1.isBuiltin)(args.path)) {
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
