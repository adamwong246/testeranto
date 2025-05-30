"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    featureIngestor: function (s) {
        throw new Error("Function not implemented.");
    },
};
exports.default = config;
