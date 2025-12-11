import { spawn, fork } from "child_process";
// import fs from "fs";
// import path from "path";
// import nodeEsbuildConfig from "../../../esbuildConfigs/node.js";
// import { runBuild } from "../common.js";

import esbuild from "esbuild";
import nodeConfiger from "./esbuild";
import { IBuiltConfig } from "../../../Types";

const testName = process.argv[2];

// run esbuild in watch mode using esbuildConfigs. Write to fs the bundle and metafile
async function startBundling(
  config: IBuiltConfig,
  onMetafileChange: (esbuild: esbuild.BuildResult) => void
) {
  console.log(`NODE BUILDER is now bundling:  ${testName}`);
  const n = nodeConfiger(config, testName);
  // n.externals = [];
  console.log(`NODE BUILDER conf:  `, n);

  const bv = await esbuild.build(n);
  // bv.watch();

  console.log(`NODE BUILDER res:  `, bv);

  fork("testeranto/bundles/allTests/node/example/Calculator.test.mjs");

  // console.log(bv);
  onMetafileChange(bv);

  // if (this.mode === "dev") {
  //   const ctx = await esbuild.context(configWithPlugin);
  //   // Build once and then watch
  //   await ctx.rebuild();
  //   // Note: For web runtime, we don't serve files via esbuild
  //   // Server_TCP handles serving web test files
  //   await ctx.watch();
  // } else {x
  //   // In once mode, just build
  //   const result = await esbuild.build(configWithPlugin);
  //   if (result.errors.length === 0) {
  //     console.log(`Successfully built ${runtime} bundle`);
  //   }
}

// run using user defined static analysis when the metafile changes
async function startStaticAnalysis(esbuildResult: esbuild.BuildResult) {
  console.log(`NODE BUILDER is now performing static analysis upon: `);
}

// run testeranto tests when the metafile changes
async function startBddTests(esbuildResult: esbuild.BuildResult) {
  console.log(`NODE BUILDER is now running testeranto tests:`);
}

async function main() {
  const config = (await import(`/workspace/${testName}`)).default;

  console.log(config);

  try {
    await startBundling(config, (esbuildResult: esbuild.BuildResult) => {
      startStaticAnalysis(esbuildResult);
      startBddTests(esbuildResult);
    });
  } catch (error) {
    console.error("NODE BUILDER: Error:", error);
    process.exit(1);
  }
}

main();
