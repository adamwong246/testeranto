const config = {
    outdir: "docs",
    tests: [],
    debugger: true,
    clearScreen: false,
    devMode: true,
    minify: false,
    outbase: ".",
    ports: ["3001"],
    externals: [],
    nodePlugins: [],
    webPlugins: [],
    featureIngestor: function (s) {
        throw new Error("Function not implemented.");
    },
};
export default config;
