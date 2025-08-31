import { polyfillNode } from "esbuild-plugin-polyfill-node";
import path from "path";
import baseEsBuildConfig from "./index.js";
import inputFilesPlugin from "./inputFilesPlugin.js";
import featuresPlugin from "./featuresPlugin.js";
import rebuildPlugin from "./rebuildPlugin.js";
export default (config, entryPoints, testName) => {
    const { inputFilesPluginFactory, register } = inputFilesPlugin("web", testName);
    return Object.assign(Object.assign({}, baseEsBuildConfig(config)), { treeShaking: true, outdir: `testeranto/bundles/web/${testName}`, alias: {
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
        ], platform: "browser", entryPoints: [...entryPoints], loader: config.webLoaders, plugins: [
            featuresPlugin,
            inputFilesPluginFactory,
            polyfillNode({
            // You might need to configure specific Node.js modules you want to polyfill
            // Example:
            // modules: {
            //   'util': true,
            //   'fs': false,
            // }
            }),
            rebuildPlugin("web"),
            ...((config.webPlugins || []).map((p) => p(register, entryPoints)) || []),
        ] });
};
