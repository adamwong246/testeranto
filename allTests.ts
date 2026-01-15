import { ITestconfig } from "./src/Types";
import { createLangConfig } from "./allTestsUtils";

const config: ITestconfig = {
  featureIngestor: function (s: string): Promise<string> {
    throw new Error("Function not implemented.");
  },
  importPlugins: [],
  httpPort: 3456,

  ports: ["3333", "3334"],
  src: "",

  golang: createLangConfig("example/Calculator.golingvu.test.go", [
    (x) => `cd /workspace/example && golangci-lint run ${x.replace("example/", "")}`,
  ], `golang.Dockerfile`
  ),

  python: createLangConfig("example/Calculator.pitono.test.py", [
    (x) => `pylint ${x.join(' ')}`,
  ], `python.Dockerfile`),

  web: createLangConfig("example/Calculator.test.ts", [
    (x) => `yarn eslint ${x.join(' ')}`,
    (x) => `yarn tsc --noEmit ${x.join(' ')}`,
  ], `web.Dockerfile`, { volumes: ['eslint.config.mjs'] }),

  node: createLangConfig("example/Calculator.test.ts", [
    (x) => `yarn eslint ${x.join(' ')}`,
    (x) => `yarn tsc --noEmit ${x.join(' ')}`,
  ], `node.Dockerfile`, { volumes: ['eslint.config.mjs'] }),
  check: ""
};

export default config;
