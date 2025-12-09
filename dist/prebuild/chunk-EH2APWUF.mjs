import {
  esbuildConfigs_default,
  featuresPlugin_default,
  inputFilesPlugin_default,
  rebuildPlugin_default
} from "./chunk-SFBHYNUJ.mjs";

// src/esbuildConfigs/node.ts
import fs from "fs";
import path from "path";
var node_default = (config, entryPoints, testName, bundlesDir) => {
  const { inputFilesPluginFactory, register } = inputFilesPlugin_default(
    "node",
    testName
  );
  const entryPointsObj = {};
  for (const entryPoint of entryPoints) {
    const withoutExt = entryPoint.replace(/\.ts$/, "");
    const baseName = path.basename(withoutExt);
    const dirName = path.dirname(entryPoint);
    const outputKey = path.join(dirName, baseName);
    entryPointsObj[outputKey] = entryPoint;
    console.log(`  ${entryPoint} -> ${outputKey}.mjs`);
  }
  const effectiveBundlesDir = process.env.BUNDLES_DIR || bundlesDir;
  const absoluteBundlesDir = path.isAbsolute(effectiveBundlesDir) ? effectiveBundlesDir : path.join(process.cwd(), effectiveBundlesDir);
  return {
    ...esbuildConfigs_default(config),
    // splitting: false, // Disable splitting since each entry point is separate
    outdir: absoluteBundlesDir,
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
    entryPoints: entryPointsObj,
    plugins: [
      featuresPlugin_default,
      inputFilesPluginFactory,
      rebuildPlugin_default("node"),
      ...config.node.plugins.map((p) => p(register, entryPoints)) || [],
      {
        name: "list-output-files",
        setup(build) {
          build.onEnd((result) => {
            if (result.errors.length === 0) {
              try {
                let listDir2 = function(dir, indent = "") {
                  const items = fs.readdirSync(dir, { withFileTypes: true });
                  for (const item of items) {
                    console.log(indent + item.name);
                    if (item.isDirectory()) {
                      listDir2(path.join(dir, item.name), indent + "  ");
                    }
                  }
                };
                var listDir = listDir2;
                const files = fs.readdirSync(absoluteBundlesDir);
                listDir2(absoluteBundlesDir);
              } catch (e) {
                console.log("Error listing output:", e.message);
              }
            }
          });
        }
      }
    ]
  };
};

export {
  node_default
};
