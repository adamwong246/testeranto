import { IProject } from "./src/Types";

const config: IProject = {
  projects: {
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
        // [
        //   "./src/SubPackages/react-test-renderer/component/test/web.ts",
        //   "web",
        //   { ports: 0 },
        //   [],
        // ],
        // [
        //   "./src/SubPackages/react-test-renderer/component/test/pure.ts",
        //   "pure",
        //   { ports: 0 },
        //   [],
        // ],
      ],

      webPlugins: [],
      nodePlugins: [],
      importPlugins: [],
    },
  },
};
export default config;
