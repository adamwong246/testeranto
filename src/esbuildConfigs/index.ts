import { BuildOptions } from "esbuild";
import { ITestconfigV2Node } from "../Types";
// import { ITestconfig } from "../Types";

export default (config: object): BuildOptions => {
  return {
    // packages: "external",
    target: "esnext",
    format: "esm",
    splitting: true,
    outExtension: { ".js": ".mjs" },
    outbase: ".",
    jsx: "transform",
    bundle: true,
    // minify: config.minify === true,
    write: true,
    loader: {
      ".js": "jsx",
      ".png": "binary",
      ".jpg": "binary",
    },
  };
};
