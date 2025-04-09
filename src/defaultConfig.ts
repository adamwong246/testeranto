import { IBaseConfig } from "./lib";

const config: IBaseConfig = {
  src: "src",
  tests: [],
  debugger: true,
  clearScreen: false,
  minify: false,
  ports: ["3001"],
  externals: [],
  nodePlugins: [],
  webPlugins: [],
  importPlugins: [],
  featureIngestor: function (s: string): Promise<string> {
    throw new Error("Function not implemented.");
  },
};

export default config;
