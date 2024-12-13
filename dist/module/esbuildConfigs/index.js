export default (config) => {
    return {
        // packages: "external",
        target: "esnext",
        format: "esm",
        splitting: true,
        outExtension: { ".js": ".mjs" },
        outbase: config.outbase,
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
