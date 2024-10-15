import { jsonc } from "jsonc";

import { IBaseConfig, IJsonConfig } from "../Types";

import baseEsBuildConfig from "./index.js";

import fs from "fs"
import { BuildOptions } from "esbuild";

const jsonConfig = jsonc.parse((await fs.readFileSync("./testeranto.json")).toString()) as IJsonConfig;

export default (config: IBaseConfig): BuildOptions => {
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
  }
}