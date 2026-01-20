const config = {
    featureIngestor: function (s) {
        throw new Error("Function not implemented.");
    },
    runtimes: {
        nodetests: ({
            runtime: "node",
            tests: ["example/Calculator.test.ts"],
            checks: [
                (x) => `yarn eslint`,
                (x) => `yarn tsc --noEmit`,
            ],
            dockerfile: `testeranto/runtimes/node/node.Dockerfile`,
            buildOptions: `testeranto/runtimes/node/node.ts`
        }),
        // webtests: (
        //   {
        //     runtime: "web",
        //     tests: ["example/Calculator.test.ts"],
        //     checks: [
        //       (x) => `yarn eslint`,
        //       (x) => `yarn tsc --noEmit`,
        //     ],
        //     dockerfile: `testeranto/runtimes/web/web.Dockerfile`,
        //     buildOptions: `testeranto/runtimes/web/web.ts`
        //   }
        // ),
        // pythontests: (
        //   {
        //     runtime: "python",
        //     tests: ["example/Calculator.test.py"],
        //     checks: [
        //       (x) => `yarn eslint`,
        //       (x) => `yarn tsc --noEmit`,
        //     ],
        //     dockerfile: `testeranto/runtimes/python/python.Dockerfile`,
        //     buildOptions: `testeranto/runtimes/python/python.ts`
        //   }
        // ),
        // golangtests: (
        //   {
        //     runtime: "golang",
        //     tests: ["example/Calculator.test.go"],
        //     checks: [
        //       (x) => `yarn eslint`,
        //       (x) => `yarn tsc --noEmit`,
        //     ],
        //     dockerfile: `testeranto/runtimes/golang/golang.Dockerfile`,
        //     buildOptions: `testeranto/runtimes/golang/golang.ts`
        //   }
        // ),
        // rusttests: (
        //   {
        //     runtime: "rust",
        //     tests: ["example/Calculator.test.rs"],
        //     checks: [
        //       (x) => `yarn eslint`,
        //       (x) => `yarn tsc --noEmit`,
        //     ],
        //     dockerfile: `testeranto/runtimes/rust/rust.Dockerfile`,
        //     buildOptions: `testeranto/runtimes/rust/rust.ts`
        //   }
        // ),
        // rubytests: (
        //   {
        //     runtime: "ruby",
        //     tests: ["example/Calculator.test.rb"],
        //     checks: [
        //       (x) => `yarn eslint`,
        //       (x) => `yarn tsc --noEmit`,
        //     ],
        //     dockerfile: `testeranto/runtimes/ruby/ruby.Dockerfile`,
        //     buildOptions: `testeranto/runtimes/ruby/ruby.ts`
        //   }
        // ),
    },
};
export default config;
