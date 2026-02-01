import featuresPlugin from "../../../esbuildConfigs/featuresPlugin.js";
import baseEsBuildConfig from "../../../esbuildConfigs/index.js";
import inputFilesPlugin from "../../../esbuildConfigs/inputFilesPlugin.js";
import rebuildPlugin from "../../../esbuildConfigs/rebuildPlugin.js";
const absoluteBundlesDir = (c) => {
    return "./testeranto/bundles/allTests/web/";
};
export default (config, testName) => {
    var _a, _b;
    // Use the same entry points as node tests for consistency
    const entrypoints = ["./example/Calculator.test.ts"];
    const { inputFilesPluginFactory, register } = inputFilesPlugin("web", testName);
    return Object.assign(Object.assign({}, baseEsBuildConfig(config)), { outdir: absoluteBundlesDir(config), outbase: ".", metafile: true, supported: {
            "dynamic-import": true,
        }, define: {
            "process.env.FLUENTFFMPEG_COV": "0",
            ENV: `"web"`,
        }, absWorkingDir: process.cwd(), platform: "browser", packages: "external", entryPoints: entrypoints, bundle: true, format: "esm", plugins: [
            featuresPlugin,
            inputFilesPluginFactory,
            rebuildPlugin("web"),
            ...(((_b = (_a = config.web) === null || _a === void 0 ? void 0 : _a.plugins) === null || _b === void 0 ? void 0 : _b.map((p) => p(register, entrypoints))) || []),
        ] });
};
