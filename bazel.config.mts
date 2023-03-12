import { ITProject } from "testeranto/src/Project";

import baseConfig from "./base.config.mjs";

export default new ITProject({
  ...baseConfig,
  outdir: "js-bazel",
  buildMode: "off",
  runMode: false,
  collateMode: "watch+serve"
});
