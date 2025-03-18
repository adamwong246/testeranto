import baseEsBuildConfig from "./index.js";
import inputFilesPlugin from "./inputFilesPlugin.js";
export default (config, entryPoints) => {
    const { inputFilesPluginFactory, register } = inputFilesPlugin("node", entryPoints);
    // const inputFilesPluginFactory = inputFilesPlugin("node", entryPoints);
    // const register = (x) => x;
    return Object.assign(Object.assign({}, baseEsBuildConfig(config)), { splitting: true, outdir: config.outdir + "/node", 
        // inject: [`./node_modules/testeranto/dist/cjs-shim.js`],
        metafile: true, supported: {
            "dynamic-import": true,
        }, define: {
            "process.env.FLUENTFFMPEG_COV": "0",
        }, absWorkingDir: process.cwd(), banner: {
            js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
        }, platform: "node", external: [
            // "testeranto.json",
            // "features.test.js",
            "react",
            // "events",
            // "ganache"
            ...config.externals,
        ], entryPoints: [...entryPoints], plugins: [
            ...(config.nodePlugins.map((p) => p(register, entryPoints)) || []),
            inputFilesPluginFactory,
            // inputFilesPlugin("node", entryPoints),
            {
                name: "rebuild-notify",
                setup(build) {
                    build.onEnd((result) => {
                        console.log(`node build ended with ${result.errors.length} errors`);
                        if (result.errors.length > 0) {
                            console.log(result);
                        }
                        // console.log(result);
                        // result.errors.length !== 0 && process.exit(-1);
                    });
                },
            },
        ] });
};
