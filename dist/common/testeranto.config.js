"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    projects: {
        allTests: {
            tests: [
                // ["src/lib/BaseSuite.test/node.test.ts", "node", { ports: 0 }, []],
                // ["src/lib/BaseSuite.test/pure.test.ts", "pure", { ports: 0 }, []],
                // ["src/lib/BaseSuite.test/web.test.ts", "web", { ports: 0 }, []],
                // ["src/Pure.test.ts", "pure", { ports: 0 }, []],
                // ["src/lib/pmProxy.test/index.ts", "node", { ports: 0 }, []],
                // ["src/lib/core.test/core.test.ts", "node", { ports: 0 }, []],
                [
                    "src/lib/classBuilder.test/classBuilder.test.ts",
                    "node",
                    { ports: 0 },
                    [],
                ],
                [
                    "src/lib/baseBuilder.test/baseBuilder.test.node.ts",
                    "node",
                    { ports: 0 },
                    [],
                ],
                [
                    "src/lib/baseBuilder.test/baseBuilder.test.pure.ts",
                    "pure",
                    { ports: 0 },
                    [],
                ],
                [
                    "src/lib/baseBuilder.test/baseBuilder.test.web.ts",
                    "web",
                    { ports: 0 },
                    [],
                ],
                // ["src/mothership/test.ts", "node", { ports: 0 }, []],
                // ["./src/lib/abstractBase/index.ts", "node", { ports: 0 }, []],
                // [
                //   "src/PM/__tests__/nodeSidecar.testeranto.ts",
                //   "node",
                //   { ports: 1 },
                //   [],
                // ],
                // [
                //   "src/PM/__tests__/pureSidecar.testeranto.ts",
                //   "node",
                //   { ports: 1 },
                //   [],
                // ],
                // ["src/PM/__tests__/webSidecar.testeranto.ts", "node", { ports: 1 }, []],
            ],
            clearScreen: false,
            debugger: false,
            externals: [],
            featureIngestor: function (s) {
                throw new Error("Function not implemented.");
            },
            importPlugins: [],
            minify: false,
            nodePlugins: [],
            ports: ["3333"],
            src: "",
            webPlugins: [],
        },
    },
    reportDomain: "https://adamwong246.github.io/testeranto/testeranto",
};
exports.default = config;
