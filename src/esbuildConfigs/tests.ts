import { jsonc } from "jsonc";

import { IBaseConfig, IJsonConfig } from "../Types";

import fs from "fs"
import { BuildOptions } from "esbuild";

// const jsonConfig = jsonc.parse((await fs.readFileSync("./testeranto.json")).toString()) as IJsonConfig;

export default (config: IBaseConfig): BuildOptions => {
  return {
    bundle: true,
    entryPoints: [config.features],
    minify: config.minify === true,
    outbase: config.outbase,
    write: true,
    outfile: `${config.outdir}/tests.test.js`,
    // external: ["graphology"]
  }
}