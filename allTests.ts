import { sassPlugin } from "esbuild-sass-plugin";
import { ITestconfig } from "./src/Types";

const config: ITestconfig = {
  // debugger: false,
  // externals: [],
  featureIngestor: function (s: string): Promise<string> {
    throw new Error("Function not implemented.");
  },
  importPlugins: [],

  ports: ["3333", "3334"],

  src: "",
  golang: {
    plugins: [],
    loaders: {},
    tests: {
      // "example/Calculator.golingvu.test.go": { ports: 0 },
    },
  },
  python: {
    plugins: [],
    loaders: {},
    tests: {
      // "example/Calculator.pitono.test.py": { ports: 0 },
    },
  },

  web: {
    plugins: [() => sassPlugin()],
    loaders: {
      ".ttf": "file",
    },
    tests: {
      // "example/Calculator.test.ts": { ports: 0 },
    },
    externals: [],
  },
  node: {
    plugins: [],
    loaders: {},
    tests: {
      "example/Calculator.test.ts": { ports: 0 },
    },
    externals: [],
  },
};

// const config: IProject = {
//   projects: {
//     core: {
//       tests: [
//         ["example/Calculator.test.ts", "web", { ports: 0 }, []],
//         ["example/Calculator.test.ts", "node", { ports: 0 }, []],
//         ["example/Calculator.pitono.test.py", "python", { ports: 0 }, []],
//         ["example/Calculator.golingvu.test.go", "golang", { ports: 0 }, []],

//         // ["example/test_example.py", "python", { ports: 0 }, []],
//         // ["example/base_suite_test.go", "golang", { ports: 0 }, []],
//         // ["src/lib/BaseSuite.test/node.test.ts", "node", { ports: 0 }, []],
//         // ["src/lib/BaseSuite.test/pure.test.ts", "pure", { ports: 0 }, []],

//         // ["src/lib/TipoSkripto.test/TipoSkripto.ts", "node", { ports: 0 }, []],

//         // ["src/Pure.test.ts", "pure", { ports: 0 }, []],
//         // ["src/lib/pmProxy.test/index.ts", "node", { ports: 0 }, []],

//         // [
//         //   "src/components/pure/ProjectPageView.test/index.tsx",
//         //   "web",
//         //   { ports: 0 },
//         //   [],
//         // ],

//         // [
//         //   "src/components/pure/FeaturesReporterView.test/index.tsx",
//         //   "web",
//         //   { ports: 0 },
//         //   [],
//         // ],
//         // ["src/lib/BaseSuite.test/web.test.ts", "web", { ports: 0 }, []],

//         // [
//         //   "src/components/pure/ModalContent.test/index.tsx",
//         //   "web",
//         //   { ports: 0 },
//         //   [],
//         // ],

//         // broken
//         //////////////////////////////////////////////////////////////////////////////////////////////////////////
//         // [
//         //   "src/components/pure/TestPageView.test/index.tsx",
//         //   "web",
//         //   { ports: 0 },
//         //   [],
//         // ],

//         // [
//         //   "src/components/pure/AppFrame.test/index.tsx",
//         //   "web",
//         //   { ports: 0 },
//         //   [],
//         // ],

//         // ["src/mothership/test.ts", "node", { ports: 0 }, []],
//         // ["src/lib/abstractBase.test/index.ts", "node", { ports: 0 }, []],
//         // [
//         //   "src/PM/__tests__/nodeSidecar.testeranto.ts",
//         //   "node",
//         //   { ports: 1 },
//         //   [],
//         // ],
//         // [
//         //   "src/PM/__tests__/pureSidecar.testeranto.ts",
//         //   "node",
//         //   { ports: 1 },
//         //   [],
//         // ],
//         // ["src/PM/__tests__/webSidecar.testeranto.ts", "node", { ports: 1 }, []],
//       ],
// clearScreen: false,
// debugger: false,
// externals: [],
// featureIngestor: function (s: string): Promise<string> {
//   throw new Error("Function not implemented.");
// },
// importPlugins: [],
// minify: false,
// nodePlugins: [],
// ports: ["3333"],
// src: "",
// webPlugins: [() => sassPlugin()],
// webLoaders: {
//   ".ttf": "file",
// },
//     },
//   },

//   ignore: ["dist/ "],
// };

export default config;
