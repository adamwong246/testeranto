import baseEsBuildConfig from "./index.js";
import inputFilesPlugin from "./inputFilesPlugin.js";
import featuresPlugin from "./featuresPlugin.js";
export default (config, entryPoints, testName) => {
    const { inputFilesPluginFactory, register } = inputFilesPlugin("pure", testName);
    return Object.assign(Object.assign({}, baseEsBuildConfig(config)), { drop: ["console", "debugger"], splitting: true, outdir: `testeranto/bundles/pure/${testName}/`, 
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
            {
                name: "rebuild-notify",
                setup: (build) => {
                    build.onStart(() => {
                        console.log(`> pure build starting...`);
                    });
                    build.onEnd((result) => {
                        console.log(`> pure build ended with ${result.errors.length} errors`);
                        if (result.errors.length > 0) {
                            console.log(result);
                        }
                        // console.log(result);
                        // result.errors.length !== 0 && process.exit(-1);
                    });
                },
            },
            ...((config.nodePlugins || []).map((p) => p(register, entryPoints)) ||
                []),
        ] });
};
