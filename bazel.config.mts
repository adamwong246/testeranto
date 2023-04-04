import { ITProject } from "testeranto/src/Project";
import path from "path";
// import { fileURLToPath } from 'url';

import baseConfig from "./base.config.mjs";


const __dirname = new URL(import.meta.url + '/..').pathname

export default new ITProject({
  ...baseConfig,
  outdir: "js-bazel",
  buildMode: "watch",
  runMode: true,
  collateMode: "off",
  __dirname: `~/Code/kokomoBay`
});
