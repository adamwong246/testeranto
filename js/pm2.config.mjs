import { ITProject } from "testeranto/src/Project";
import baseConfig from "./base.config.mjs";
new ITProject({
    ...baseConfig,
    outdir: "js-pm2",
    buildMode: "on",
    runMode: true,
    collateMode: "off",
});
