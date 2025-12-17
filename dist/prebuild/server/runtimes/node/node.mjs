import {
  esbuildConfigs_default,
  featuresPlugin_default,
  inputFilesPlugin_default,
  rebuildPlugin_default
} from "../../../chunk-SFBHYNUJ.mjs";

// src/server/runtimes/node/node.ts
import { fork } from "child_process";
import esbuild from "esbuild";

// src/server/runtimes/node/esbuild.ts
var absoluteBundlesDir = (c) => {
  return "./testeranto/bundles/allTests/node/";
};
var esbuild_default = (config, testName2) => {
  const entrypoints = ["./example/Calculator.test.ts"];
  const { inputFilesPluginFactory, register } = inputFilesPlugin_default(
    "node",
    testName2
  );
  return {
    ...esbuildConfigs_default(config),
    // splitting: false, // Disable splitting since each entry point is separate
    outdir: absoluteBundlesDir(config),
    outbase: ".",
    // Preserve directory structure relative to outdir
    metafile: true,
    supported: {
      "dynamic-import": true
    },
    define: {
      "process.env.FLUENTFFMPEG_COV": "0",
      ENV: `"node"`
    },
    absWorkingDir: process.cwd(),
    platform: "node",
    // external: ["react", ...config.node.externals],
    packages: "external",
    entryPoints: entrypoints,
    plugins: [
      featuresPlugin_default,
      inputFilesPluginFactory,
      rebuildPlugin_default("node"),
      ...config.node.plugins.map((p) => p(register, entrypoints)) || []
    ]
  };
};

// src/server/runtimes/node/node.ts
var testName = process.argv[2];
async function startBundling(config, onMetafileChange) {
  console.log(`NODE BUILDER is now bundling:  ${testName}`);
  const n = esbuild_default(config, testName);
  const bv = await esbuild.build(n);
  fork(`testeranto/bundles/allTests/node/example/Calculator.test.mjs`, [
    config.httpPort.toString()
  ]);
  onMetafileChange(bv);
}
async function startStaticAnalysis(esbuildResult) {
  console.log(`NODE BUILDER is now performing static analysis upon: `);
}
async function startBddTests(esbuildResult) {
  console.log(`NODE BUILDER is now running testeranto tests:`);
}
async function main() {
  const config = (await import(`/workspace/${testName}`)).default;
  try {
    await startBundling(config, (esbuildResult) => {
      startStaticAnalysis(esbuildResult);
      startBddTests(esbuildResult);
    });
  } catch (error) {
    console.error("NODE BUILDER: Error:", error);
    process.exit(1);
  }
}
main();
