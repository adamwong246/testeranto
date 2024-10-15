import path from "path";
import baseEsBuildConfig from "./index.js";
import { jsonc } from "jsonc";
import fs from "fs";
const jsonConfig = jsonc.parse((await fs.readFileSync("./testeranto.json")).toString());
export default (config, entryPoints) => {
    return Object.assign(Object.assign({}, baseEsBuildConfig(config)), { 
        // inject: ['./node_modules/testeranto/dist/cjs-shim.js'],
        // banner: {
        //   js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
        // },
        outdir: jsonConfig.outdir + "/web", alias: {
            react: path.resolve("./node_modules/react")
        }, external: [
            "testeranto.json",
            "features.test.js",
            // "url", 
            // "react",
            "electron",
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
            "https"
        ], platform: "browser", entryPoints: [...entryPoints], plugins: [
            ...(config.webPlugins || []),
            {
                name: 'rebuild-notify',
                setup(build) {
                    build.onEnd(result => {
                        console.log(`web build ended with ${result.errors.length} errors`);
                        console.log(result);
                        result.errors.length !== 0 && process.exit(-1);
                    });
                }
            },
        ] });
};
