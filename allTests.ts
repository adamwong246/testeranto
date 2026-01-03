import { ITestconfig } from "./src/Types";
import { createLangConfig } from "./allTestsUtils";

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
    "example/staticAnalysis/golang.go"
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
