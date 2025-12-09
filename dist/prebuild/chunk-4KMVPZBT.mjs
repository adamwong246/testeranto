import {
  esbuildConfigs_default,
  featuresPlugin_default,
  inputFilesPlugin_default,
  rebuildPlugin_default
} from "./chunk-SFBHYNUJ.mjs";

// src/esbuildConfigs/web.ts
import fs from "fs";
import path from "path";
var web_default = (config, entryPoints, testName, bundlesDir) => {
  const { inputFilesPluginFactory, register } = inputFilesPlugin_default(
    "web",
    testName
  );
  const entryPointsObj = {};
  for (const entryPoint of entryPoints) {
    const withoutExt = entryPoint.replace(/\.ts$/, "");
    const baseName = path.basename(withoutExt);
    const dirName = path.dirname(entryPoint);
    const outputKey = path.join(dirName, baseName);
    entryPointsObj[outputKey] = entryPoint;
  }
  const effectiveBundlesDir = process.env.BUNDLES_DIR || bundlesDir || `testeranto/bundles/allTests/web/`;
  const absoluteBundlesDir = path.isAbsolute(effectiveBundlesDir) ? effectiveBundlesDir : path.join(process.cwd(), effectiveBundlesDir);
  return {
    ...esbuildConfigs_default(config),
    define: {
      "process.env.FLUENTFFMPEG_COV": "0",
      ENV: `"web"`
    },
    treeShaking: true,
    outdir: absoluteBundlesDir,
    outbase: ".",
    // Preserve directory structure relative to outdir
    absWorkingDir: process.cwd(),
    // Set working directory for resolving paths
    alias: {
      react: path.resolve("./node_modules/react")
    },
    metafile: true,
    external: [
      "path",
      "fs",
      "stream",
      "http",
      "constants",
      "net",
      "assert",
      "tls",
      "os",
      "child_process",
      "readline",
      "zlib",
      "crypto",
      "https",
      "util",
      "process",
      "dns"
    ],
    platform: "browser",
    entryPoints: entryPointsObj,
    loader: config.web.loaders,
    plugins: [
      featuresPlugin_default,
      inputFilesPluginFactory,
      rebuildPlugin_default("web"),
      ...(config.web.plugins || []).map((p) => p(register, entryPoints)) || [],
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
                console.log("[web esbuild] Error listing output:", e.message);
              }
            }
          });
        }
      }
    ]
  };
};

export {
  web_default
};
