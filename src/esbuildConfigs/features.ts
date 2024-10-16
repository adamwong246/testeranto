import { IBaseConfig } from "../Types";

import { BuildOptions } from "esbuild";

export default (config: IBaseConfig): BuildOptions => {
  return {
    bundle: true,
    entryPoints: [config.features],
    minify: config.minify === true,
    outbase: config.outbase,
    write: true,

    outfile: `${config.outdir}/features.test.js`,
    // external: ["graphology"],

    format: "esm",
  }
}