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

  golang: createLangConfig("example/Calculator.golingvu.test.go", [
    (x) =>
      `cd /workspace/example && golangci-lint run ${x.replace("example/", "")}`,
  ]),

  python: createLangConfig("example/Calculator.pitono.test.py", [
    (x) => `pylint ${x}`,
  ]),

  web: createLangConfig("example/Calculator.test.ts", [
    (x) => `yarn eslint ${x}`,
    (x) => `yarn tsc --noEmit ${x}`,
  ]),

  node: createLangConfig("example/Calculator.test.ts", [
    (x) => `yarn eslint ${x}`,
    (x) => `yarn tsc --noEmit ${x}`,
  ]),
};

export default config;
