// import redux from "testeranto_with_reduxjs_toolkit/testeranto.config";
// import solidity from "testeranto-solidity/testeranto.config";
const config = {
    projects: {
        // redux: {
        //   ...redux.projects.allTests,
        //   src: "node_modules/testeranto_with_reduxjs_toolkit",
        // },
        // solidity: {
        //   ...solidity.projects.solidity,
        //   src: "node_modules/testeranto-solidity",
        // },
        mothership: {
            tests: [["./src/mothership/test.ts", "node", { ports: 1 }, []]],
            clearScreen: false,
            debugger: false,
            externals: [],
            externalTests: {},
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
        react: {
            src: "src",
            debugger: false,
            minify: false,
            clearScreen: false,
            externals: [],
            ports: [],
            featureIngestor: async function (s) {
                return "";
            },
            tests: [
                [
                    "./src/SubPackages/react-test-renderer/component/test/node.ts",
                    "node",
                    { ports: 0 },
                    [],
                ],
                [
                    "./src/SubPackages/react-test-renderer/component/test/web.ts",
                    "web",
                    { ports: 0 },
                    [],
                ],
                [
                    "./src/SubPackages/react-test-renderer/component/test/pure.ts",
                    "pure",
                    { ports: 0 },
                    [],
                ],
            ],
            webPlugins: [],
            nodePlugins: [],
            importPlugins: [],
            externalTests: {},
        },
    },
};
export default config;
