import { IProject } from "./src/Types";

const config: IProject = {
  projects: {
    allTests: {
      tests: [
        ["src/Pure.test.ts", "node", { ports: 1 }, []],
        ["src/lib/pmProxy.test/index.ts", "node", { ports: 1 }, []],
        ["src/lib/core.test/core.test.ts", "node", { ports: 1 }, []],

        [
          "src/lib/classBuilder.test/classBuilder.test.ts",
          "node",
          { ports: 1 },
          [],
        ],

        [
          "src/lib/baseBuilder.test/baseBuilder.test.ts",
          "node",
          { ports: 1 },
          [],
        ],
        ["./src/lib/BaseSuite.test.ts", "node", { ports: 1 }, []],
        // ["./src/lib/abstractBase/index.ts", "node", { ports: 1 }, []],

        ["./src/mothership/test.ts", "node", { ports: 1 }, []],

        [
          "./src/PM/__tests__/nodeSidecar.testeranto.ts",
          "node",
          { ports: 1 },
          [],
        ],
        [
          "./src/PM/__tests__/pureSidecar.testeranto.ts",
          "node",
          { ports: 1 },
          [],
        ],
        [
          "./src/PM/__tests__/webSidecar.testeranto.ts",
          "node",
          { ports: 1 },
          [],
        ],
      ],
      clearScreen: false,
      debugger: false,
      externals: [],
      featureIngestor: function (s: string): Promise<string> {
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

      featureIngestor: async function (s: string) {
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
    },
  },
};
export default config;
