import featuresPlugin from "../../../esbuildConfigs/featuresPlugin.js";
import baseEsBuildConfig from "../../../esbuildConfigs/index.js";
import inputFilesPlugin from "../../../esbuildConfigs/inputFilesPlugin.js";
import rebuildPlugin from "../../../esbuildConfigs/rebuildPlugin.js";
const absoluteBundlesDir = () => {
    return "./testeranto/bundles/allTests/node/";
};
export default (nodeConfig, testName, projectConfig) => {
    var _a;
    console.log("esbuild", testName, projectConfig);
    const entryPoints = projectConfig.runtimes[testName].tests;
    // Get entry points from config, or use a default
    // let entrypoints: string[] = [];
    // if (nodeConfig) {
    //   entrypoints = (projectConfig.tests);
    // } else {
    //   // console.log(projectConfig)
    //   throw "projectConfig.node.tests should exist"
    //   // Fallback to a reasonable default
    //   // entrypoints = ["./example/Calculator.test.ts"];
    //   // console.warn(`No node.tests found in config, using default entry point: ${entrypoints[0]}`);
    // }
    const { inputFilesPluginFactory, register } = inputFilesPlugin("node", testName);
    return Object.assign(Object.assign({}, baseEsBuildConfig(nodeConfig)), { outdir: absoluteBundlesDir(), outbase: ".", metafile: true, supported: {
            "dynamic-import": true,
        }, define: {
            "process.env.FLUENTFFMPEG_COV": "0",
            ENV: `"node"`,
        }, bundle: true, format: "esm", absWorkingDir: process.cwd(), platform: "node", packages: "external", entryPoints, plugins: [
            featuresPlugin,
            inputFilesPluginFactory,
            rebuildPlugin("node"),
            ...(((_a = nodeConfig.plugins) === null || _a === void 0 ? void 0 : _a.map((p) => p(register, entryPoints))) || []),
        ] });
};
