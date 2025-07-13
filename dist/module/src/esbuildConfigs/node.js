import baseEsBuildConfig from "./index.js";
import inputFilesPlugin from "./inputFilesPlugin.js";
import featuresPlugin from "./featuresPlugin";
import rebuildPlugin from "./rebuildPlugin.js";
export default (config, entryPoints, testName) => {
    const { inputFilesPluginFactory, register } = inputFilesPlugin("node", testName);
    return Object.assign(Object.assign({}, baseEsBuildConfig(config)), { splitting: true, outdir: `testeranto/bundles/node/${testName}/`, 
        // inject: [`./node_modules/testeranto/dist/cjs-shim.js`],
        metafile: true, supported: {
            "dynamic-import": true,
        }, define: {
            "process.env.FLUENTFFMPEG_COV": "0",
        }, absWorkingDir: process.cwd(), banner: {
            js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
        }, platform: "node", external: ["react", ...config.externals], entryPoints: [...entryPoints], plugins: [
            featuresPlugin,
            inputFilesPluginFactory,
            rebuildPlugin("node"),
            ...(config.nodePlugins.map((p) => p(register, entryPoints)) || []),
        ] });
};
