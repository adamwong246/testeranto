import { ITestconfigV2 } from "../src/Types";

const config: ITestconfigV2 = {
  featureIngestor: function (s: string): Promise<string> {
    throw new Error("Function not implemented.");
  },

  runtimes: {
    nodeTests: (
      {
        runtime: "node",
        tests: ["example/Calculator.test.ts"],
        checks: [
          (x) => `yarn eslint`,
          (x) => `yarn tsc --noEmit`,
        ],
        dockerfile: `testeranto/runtimes/node/node.Dockerfile`,
        buildOptions: `testeranto/runtimes/node/node.ts`
      }
    ),

    webTests: (
      {
        runtime: "web",
        tests: ["example/Calculator.test.ts"],
        checks: [
          (x) => `yarn eslint`,
          (x) => `yarn tsc --noEmit`,
        ],
        dockerfile: `testeranto/runtimes/web/web.Dockerfile`,
        buildOptions: `testeranto/runtimes/web/web.ts`
      }
    ),

    pythonTests: (
      {
        runtime: "python",
        tests: ["example/Calculator.test.py"],
        checks: [
          (x) => `yarn eslint`,
          (x) => `yarn tsc --noEmit`,
        ],
        dockerfile: `testeranto/runtimes/python/python.Dockerfile`,
        buildOptions: `testeranto/runtimes/python/python.ts`
      }
    ),

    golangTests: (
      {
        runtime: "golang",
        tests: ["example/Calculator.test.go"],
        checks: [
          (x) => `yarn eslint`,
          (x) => `yarn tsc --noEmit`,
        ],
        dockerfile: `testeranto/runtimes/golang/golang.Dockerfile`,
        buildOptions: `testeranto/runtimes/golang/golang.ts`
      }
    ),

    rustTests: (
      {
        runtime: "rust",
        tests: ["example/Calculator.test.rs"],
        checks: [
          (x) => `yarn eslint`,
          (x) => `yarn tsc --noEmit`,
        ],
        dockerfile: `testeranto/runtimes/rust/rust.Dockerfile`,
        buildOptions: `testeranto/runtimes/rust/rust.ts`
      }
    ),

    rubyTests: (
      {
        runtime: "ruby",
        tests: ["example/Calculator.test.rb"],
        checks: [
          (x) => `yarn eslint`,
          (x) => `yarn tsc --noEmit`,
        ],
        dockerfile: `testeranto/runtimes/ruby/ruby.Dockerfile`,
        buildOptions: `testeranto/runtimes/ruby/ruby.ts`
      }
    ),
  },

};

export default config;
