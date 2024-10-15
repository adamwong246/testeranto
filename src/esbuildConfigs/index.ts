import { BuildOptions } from "esbuild";
import { config } from "process";
import { IBaseConfig } from "../Types";

export default (
  config: IBaseConfig,
): BuildOptions => {
  return {
    target: "esnext",
    format: "esm",
    splitting: true,
    outExtension: { '.js': '.mjs' },
    outbase: config.outbase,
    // outdir: config.outdir,
    jsx: 'transform',
    bundle: true,
    minify: config.minify === true,
    write: true,
    loader: {
      '.js': 'jsx',
      '.png': 'binary',
      '.jpg': 'binary',
    },
  };
}