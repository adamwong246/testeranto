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
    let absoluteEntryPoint = null;
    let relativePath = entryPoint;
    if (path.isAbsolute(entryPoint)) {
      const workspacePrefix = "/workspace/";
      if (entryPoint.startsWith(workspacePrefix)) {
        relativePath = entryPoint.slice(workspacePrefix.length);
      } else {
        relativePath = path.relative("/", entryPoint);
      }
    }
    const testerantoPath = path.join("/workspace/testeranto", relativePath);
    if (fs.existsSync(testerantoPath)) {
      absoluteEntryPoint = testerantoPath;
    } else {
      if (!testerantoPath.endsWith(".ts")) {
        const withTs = testerantoPath + ".ts";
        if (fs.existsSync(withTs)) {
          absoluteEntryPoint = withTs;
        }
      }
    }
    if (!absoluteEntryPoint) {
      console.error(`[web esbuild] ERROR: Entry point not found: ${entryPoint}`);
      console.error(`[web esbuild] Expected at: ${testerantoPath} (or with .ts extension)`);
      console.error(`[web esbuild] Skipping entry point: ${entryPoint}`);
      continue;
    }
    entryPointsObj[outputKey] = absoluteEntryPoint;
    console.log(`[web esbuild] ${entryPointsObj[outputKey]} -> ${outputKey}.mjs`);
  }
  const effectiveBundlesDir = process.env.BUNDLES_DIR || bundlesDir || `testeranto/bundles/web/${testName}`;
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
      ...(config.web.plugins || []).map((p) => p(register, entryPoints)) || []
    ]
  };
};

export {
  web_default
};
