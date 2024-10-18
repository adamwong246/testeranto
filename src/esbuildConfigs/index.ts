import { BuildOptions } from "esbuild";

import { IBaseConfig } from "../lib/types";

export default (config: IBaseConfig): BuildOptions => {
  return {
    target: "esnext",
    format: "esm",
    splitting: true,
    outExtension: { ".js": ".mjs" },
    outbase: config.outbase,
    jsx: "transform",
    bundle: true,
    minify: config.minify === true,
    write: true,
    loader: {
      ".js": "jsx",
      ".png": "binary",
      ".jpg": "binary",
    },
  };
};
