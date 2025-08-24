"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const esbuild_sass_plugin_1 = require("esbuild-sass-plugin");
// TODO- this config file is horrible. I need to redo how config files are handled.
const config = {
    projects: {
        // staticSite: {
        //   tests: [["src/ReportServer.test.ts/index.ts", "node", { ports: 1 }, []]],
        //   clearScreen: false,
        //   debugger: false,
        //   externals: [],
        //   featureIngestor: function (s: string): Promise<string> {
        //     throw new Error("Function not implemented.");
        //   },
        //   importPlugins: [],
        //   minify: false,
        //   nodePlugins: [],
        //   ports: ["3334"],
        //   src: "",
        //   webPlugins: [],
        // },
        core: {
            tests: [
                ["src/lib/BaseSuite.test/node.test.ts", "node", { ports: 0 }, []],
                ["src/lib/BaseSuite.test/pure.test.ts", "pure", { ports: 0 }, []],
                ["src/lib/BaseSuite.test/web.test.ts", "web", { ports: 0 }, []],
                [
                    "src/components/pure/TestPageView.test/index.tsx",
                    "web",
                    { ports: 0 },
                    [],
                ],
                [
                    "src/components/pure/ProjectPageView.test/index.tsx",
                    "web",
                    { ports: 0 },
                    [],
                ],
                ["src/Pure.test.ts", "pure", { ports: 0 }, []],
                ["src/lib/pmProxy.test/index.ts", "node", { ports: 0 }, []],
                ["src/lib/TipoSkripto.test/TipoSkripto.ts", "node", { ports: 0 }, []],
                [
                    "src/components/pure/FeaturesReporterView.test/index.tsx",
                    "web",
                    { ports: 0 },
                    [],
                ],
                //////////////////////////////////////////////////////////////////////////////////////////////////////////
                // broken
                // [
                //   "src/components/pure/ModalContent.test/index.tsx",
                //   "web",
                //   { ports: 0 },
                //   [],
                // ],
                // [
                //   "src/components/pure/AppFrame.test/index.tsx",
                //   "web",
                //   { ports: 0 },
                //   [],
                // ],
                // ["src/mothership/test.ts", "node", { ports: 0 }, []],
                // ["./src/lib/abstractBase.test/index.ts", "node", { ports: 0 }, []],
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
            webPlugins: [() => (0, esbuild_sass_plugin_1.sassPlugin)()],
            webLoaders: {
                ".ttf": "file",
            },
        },
    },
};
exports.default = config;
