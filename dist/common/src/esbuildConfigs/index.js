"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (config) => {
    return {
        // packages: "external",
        target: "esnext",
        format: "esm",
        splitting: true,
        outExtension: { ".js": ".mjs" },
        outbase: ".",
        jsx: "transform",
        bundle: true,
        minify: config.minify === true,
        write: true,
        loader: {
            ".js": "jsx",
            ".png": "binary",
            ".jpg": "binary",
        },
    };
};
