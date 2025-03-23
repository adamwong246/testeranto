import { IBaseConfig } from "testeranto/src/lib/types.js";

const config: IBaseConfig = {
  outdir: "docs",
  tests: [],
  debugger: true,
  clearScreen: false,
  devMode: true,
  minify: false,
  outbase: ".",
  ports: ["3001"],
  externals: [],
  nodePlugins: [],
  webPlugins: [],
  featureIngestor: function (s: string): Promise<string> {
    throw new Error("Function not implemented.");
  },
};

export default config;
