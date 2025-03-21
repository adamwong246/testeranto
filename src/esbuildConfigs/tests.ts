import { BuildOptions } from "esbuild";
import { IBaseConfig } from "../lib/types";

export default (config: IBaseConfig): BuildOptions => {
  return {
    bundle: true,
    entryPoints: [config.features],
    minify: config.minify === true,
    outbase: config.outbase,
    write: true,
    outfile: `${config.outdir}/tests.test.js`,
    // external: ["graphology"]
  };
};
