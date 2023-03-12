import { ITProject } from "testeranto/src/Project";
import baseConfig from "./base.config.mjs";
export default new ITProject({
    ...baseConfig,
    outdir: "js-bazel",
    buildMode: "on",
    runMode: true,
    collateMode: "off"
});
