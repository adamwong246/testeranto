import path from "path";
import featuresPlugin from "./featuresPlugin.js";
import baseEsBuildConfig from "./index.js";
import inputFilesPlugin from "./inputFilesPlugin.js";
import rebuildPlugin from "./rebuildPlugin.js";
export default (config, entryPoints, testName, bundlesDir) => {
    const { inputFilesPluginFactory, register } = inputFilesPlugin("web", testName);
    return Object.assign(Object.assign({}, baseEsBuildConfig(config)), { define: {
            "process.env.FLUENTFFMPEG_COV": "0",
            ENV: `"web"`,
        }, treeShaking: true, outdir: bundlesDir || `testeranto/bundles/web/${testName}`, alias: {
            react: path.resolve("./node_modules/react"),
        }, metafile: true, external: [
            "path",
            "fs",
            "stream",
            "http",
            "constants",
            "net",
            "assert",
            "tls",
            "os",
            "child_process",
            "readline",
            "zlib",
            "crypto",
            "https",
            "util",
            "process",
            "dns",
        ], platform: "browser", entryPoints: [...entryPoints], loader: config.web.loaders, plugins: [
            featuresPlugin,
            inputFilesPluginFactory,
            rebuildPlugin("web"),
            ...((config.web.plugins || []).map((p) => p(register, entryPoints)) ||
                []),
        ] });
};
