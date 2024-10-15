import { jsonc } from "jsonc";
import fs from "fs";
const jsonConfig = jsonc.parse((await fs.readFileSync("./testeranto.json")).toString());
export default (config) => {
    return {
        bundle: true,
        entryPoints: [
            "./node_modules/testeranto/dist/module/Report.js",
            jsonConfig.features
        ],
        minify: config.minify === true,
        outbase: config.outbase,
        outdir: jsonConfig.outdir,
        write: true,
        // outfile: `${config.outdir}/Report.js`,
        external: [
            "features.test.js",
            "testeranto.json"
        ]
    };
};
