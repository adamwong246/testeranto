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


  ruby: createLangConfig("example/calculator-test-ruby.rb", [
    (x: string[]) => `rubocop `,
  ], `testeranto/runtimes/ruby/ruby.Dockerfile`
  ),

  golang: createLangConfig("example/cmd/calculator-test/main.go", [
    (x) => `golangci-lint run }`,
  ], `testeranto/runtimes/golang/golang.Dockerfile`
  ),

  python: createLangConfig("example/Calculator.pitono.test.py", [
    (x) => `pylint }`,
  ], `python.Dockerfile`),

  web: createLangConfig("example/Calculator.test.ts", [
    (x) => `yarn eslint}`,
    (x) => `yarn tsc --noEmit }`,
  ], `web.Dockerfile`, { volumes: ['eslint.config.mjs'] }),

  node: createLangConfig("example/Calculator.test.ts", [
    (x) => `yarn eslint }`,
    (x) => `yarn tsc --noEmit }`,
  ], `node.Dockerfile`, { volumes: ['eslint.config.mjs'] }),
  check: ""
};

export default config;
