import { ITProject } from "testeranto";
import baseConfig from "./base.config.js";
export default new ITProject({
    ...baseConfig,
    outdir: "js-bazel",
    buildMode: "on",
    runMode: true,
    collateMode: "off",
});
