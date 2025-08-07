/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITestconfig } from "./lib";

const config: ITestconfig = {
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
  webLoaders: {},

  featureIngestor: function (s: string): Promise<string> {
    throw new Error("Function not implemented.");
  },
};

export default config;
