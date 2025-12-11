// src/server/strategies.ts
var RUNTIME_STRATEGIES = {
  // Interpreted languages
  node: {
    name: "node",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "node:20-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false
  },
  python: {
    name: "python",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "python:3.11-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false
  },
  ruby: {
    name: "ruby",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "ruby:3-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false
  },
  php: {
    name: "php",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "php:8.2-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false
  },
  // Compiled languages
  go: {
    name: "go",
    category: "compiled",
    strategy: "separate-build-combined-test",
    image: "golang:1.21-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: false
  },
  rust: {
    name: "rust",
    category: "compiled",
    strategy: "separate-build-combined-test",
    image: "rust:1.70-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: false
  },
  // VM languages
  java: {
    name: "java",
    category: "VM",
    strategy: "combined-service-shared-jvm",
    image: "openjdk:17-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: true
  },
  // Browser environment
  web: {
    name: "web",
    category: "chrome",
    strategy: "combined-service-shared-chrome",
    image: "node:20-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: true
  }
};
function getStrategyForRuntime(runtime) {
  const runtimeName = runtime;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].strategy;
  }
  return "combined-build-test-process-pools";
}
function getCategoryForRuntime(runtime) {
  const runtimeName = runtime;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].category;
  }
  return "interpreted";
}

// src/server/utils.ts
import path from "path";
function getProcessPoolType(runtime) {
  const runtimeName = runtime;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].processPoolType;
  }
  return "lightweight";
}
var webEvaluator = (d, webArgz) => {
  return `
import('${d}').then(async (x) => {
  try {
    return await (await x.default).receiveTestResourceConfig(${webArgz})
  } catch (e) {
    console.log("web run failure", e.toString())
  }
})
`;
};
var getRunnables = (config, projectName) => {
  return {
    // pureEntryPoints: payload.pureEntryPoints || {},
    golangEntryPoints: Object.entries(config.golang.tests).reduce((pt, cv) => {
      pt[cv[0]] = path.resolve(cv[0]);
      return pt;
    }, {}),
    // golangEntryPointSidecars: payload.golangEntryPointSidecars || {},
    nodeEntryPoints: Object.entries(config.node.tests).reduce((pt, cv) => {
      pt[cv[0]] = path.resolve(
        `./testeranto/bundles/${projectName}/node/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
      return pt;
    }, {}),
    // nodeEntryPointSidecars: payload.nodeEntryPointSidecars || {},
    pythonEntryPoints: Object.entries(config.python.tests).reduce((pt, cv) => {
      pt[cv[0]] = path.resolve(cv[0]);
      return pt;
    }, {}),
    // pythonEntryPointSidecars: payload.pythonEntryPointSidecars || {},
    webEntryPoints: Object.entries(config.web.tests).reduce((pt, cv) => {
      pt[cv[0]] = path.resolve(
        `./testeranto/bundles/${projectName}/web/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
      return pt;
    }, {})
    // webEntryPointSidecars: payload.webEntryPointSidecars || {},
  };
};

// src/server/nodeVersion.ts
var version = "20.19.4";
var baseNodeImage = `node:${version}-alpine`;

export {
  RUNTIME_STRATEGIES,
  getStrategyForRuntime,
  getCategoryForRuntime,
  getProcessPoolType,
  webEvaluator,
  getRunnables,
  baseNodeImage
};
