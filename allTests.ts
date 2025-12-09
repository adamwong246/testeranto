/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITestconfig } from "./src/Types";
import {
  CHECKS_CONFIG,
  createLangConfig,
  SINGLE_PROD_BLOCK,
  SINGLE_TEST_BLOCK,
} from "./allTestsUtils";
import { golangConfig } from "./golangConfig";
import { pythonConfig } from "./pythonConfig";
import { webConfig } from "./webConfig";
import { nodeConfig } from "./nodeConfig";

const config: ITestconfig = {
  featureIngestor: function (s: string): Promise<string> {
    throw new Error("Function not implemented.");
  },
  importPlugins: [],
  httpPort: 3456,
  ports: ["3333", "3334"],
  src: "",
  test: SINGLE_TEST_BLOCK,
  prod: SINGLE_PROD_BLOCK,
  checks: CHECKS_CONFIG,
  build: [golangConfig.options.build!],

  processPool: {
    maxConcurrent: 4,
    timeoutMs: 30000,
  },

  chrome: {
    sharedInstance: true,
    maxContexts: 6,
    memoryLimitMB: 512,
  },

  golang: createLangConfig(
    golangConfig.flavor,
    golangConfig.testFile,
    golangConfig.options
  ),

  python: createLangConfig(
    pythonConfig.flavor,
    pythonConfig.testFile,
    pythonConfig.options
  ),

  web: createLangConfig(
    webConfig.flavor,
    webConfig.testFile,
    webConfig.options
  ),

  node: createLangConfig(
    nodeConfig.flavor,
    nodeConfig.testFile,
    nodeConfig.options
  ),
};

export default config;
