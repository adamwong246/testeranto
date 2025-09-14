const config = {
    src: "src",
    tests: [],
    debugger: true,
    clearScreen: false,
    minify: false,
    ports: ["3001"],
    externals: [],
    nodePlugins: [],
    webPlugins: [],
    importPlugins: [],
    webLoaders: {},
    featureIngestor: function (s) {
        throw new Error("Function not implemented.");
    },
};
export default config;
