/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITestconfig } from "./src/Types";
import {
  createGolangLangConfig,
  // CHECKS_CONFIG,
  createLangConfig,
  // SINGLE_PROD_BLOCK,
  // SINGLE_TEST_BLOCK,
} from "./allTestsUtils";
// import { golangConfig } from "./golangConfig";
// import { pythonConfig } from "./pythonConfig";
// import { webConfig } from "./webConfig";
// import { nodeConfig } from "./nodeConfig";

const config: ITestconfig = {
  featureIngestor: function (s: string): Promise<string> {
    throw new Error("Function not implemented.");
  },
  importPlugins: [],
  httpPort: 3456,
  chromiumPort: 4567,
  ports: ["3333", "3334"],
  src: "",

  // processPool: {
  //   maxConcurrent: 4,
  //   timeoutMs: 30000,
  // },

  // chrome: {
  //   sharedInstance: true,
  //   maxContexts: 6,
  //   memoryLimitMB: 512,
  // },

  golang: createLangConfig(
    "example/Calculator.golingvu.test.go",
    "example/staticAnalysis/golang.ts"
  ),

  python: createLangConfig(
    "example/Calculator.pitono.test.py",
    "example/staticAnalysis/python.py"
  ),

  web: createLangConfig(
    "example/Calculator.test.ts",
    "example/staticAnalysis/web.ts"
  ),

  node: createLangConfig(
    "example/Calculator.test.ts",
    "example/staticAnalysis/node.ts"
  ),
};

export default config;
