"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testeranto_config_1 = __importDefault(require("testeranto_with_reduxjs_toolkit/testeranto.config"));
const config = {
    projects: {
        redux: Object.assign(Object.assign({}, testeranto_config_1.default.projects.allTests), { src: "node_modules/testeranto_with_reduxjs_toolkit" }),
        // solidity: {
        //   ...solidity.projects.solidity,
        //   src: "node_modules/testeranto-solidity",
        // },
        // react: {
        //   src: "src",
        //   debugger: false,
        //   minify: false,
        //   clearScreen: false,
        //   externals: [],
        //   ports: [],
        //   featureIngestor: async function (s: string) {
        //     return "";
        //   },
        //   tests: [
        //     [
        //       "./src/SubPackages/react-test-renderer/component/test/node.ts",
        //       "node",
        //       { ports: 0 },
        //       [],
        //     ],
        //     // [
        //     //   "./src/SubPackages/react-test-renderer/component/test/web.ts",
        //     //   "web",
        //     //   { ports: 0 },
        //     //   [],
        //     // ],
        //     // [
        //     //   "./src/SubPackages/react-test-renderer/component/test/pure.ts",
        //     //   "pure",
        //     //   { ports: 0 },
        //     //   [],
        //     // ],
        //   ],
        //   webPlugins: [],
        //   nodePlugins: [],
        //   importPlugins: [],
        // },
    },
};
exports.default = config;
