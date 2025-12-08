/* eslint-disable @typescript-eslint/no-explicit-any */
import { BuildOptions } from "esbuild";
import fs from "fs";
import path from "path";
import { ITestconfig } from "../lib/index.js";
import featuresPlugin from "./featuresPlugin.js";
import baseEsBuildConfig from "./index.js";
import inputFilesPlugin from "./inputFilesPlugin.js";
import rebuildPlugin from "./rebuildPlugin.js";

export default (
  config: ITestconfig,
  entryPoints: string[],
  testName: string,
  bundlesDir?: string
): BuildOptions => {
  const { inputFilesPluginFactory, register } = inputFilesPlugin(
    "web",
    testName
  );

  // Convert entryPoints array to object where key is output path and value is input path
  // Similar to node.ts configuration
  const entryPointsObj: Record<string, string> = {};
  for (const entryPoint of entryPoints) {
    // Remove extension .ts for the filename
    const withoutExt = entryPoint.replace(/\.ts$/, "");
    // The base name without extension
    const baseName = path.basename(withoutExt); // "Calculator.test"
    // Get the directory part
    const dirName = path.dirname(entryPoint); // "example"
    // Key: path to output file without extension, relative to outdir
    // We want: "example/Calculator.test"
    const outputKey = path.join(dirName, baseName);
    
    // Resolve the entry point to an absolute path in /workspace/testeranto/
    // The entryPoint could be:
    // 1. Relative: "example/Calculator.test.ts"
    // 2. Absolute: "/workspace/example/Calculator.test.ts"
    // We always want: "/workspace/testeranto/example/Calculator.test.ts"
    
    let absoluteEntryPoint: string | null = null;
    
    // Normalize the entry point to a relative path from /workspace/testeranto
    // Remove leading /workspace/ if present
    let relativePath = entryPoint;
    if (path.isAbsolute(entryPoint)) {
        // Remove /workspace/ prefix
        const workspacePrefix = '/workspace/';
        if (entryPoint.startsWith(workspacePrefix)) {
            relativePath = entryPoint.slice(workspacePrefix.length);
        } else {
            // If it's absolute but not under /workspace, use basename
            relativePath = path.relative('/', entryPoint);
        }
    }
    
    // Now construct the path in /workspace/testeranto
    const testerantoPath = path.join('/workspace/testeranto', relativePath);
    
    // Check if the file exists
    if (fs.existsSync(testerantoPath)) {
        absoluteEntryPoint = testerantoPath;
    } else {
        // Try adding .ts extension if not present
        if (!testerantoPath.endsWith('.ts')) {
            const withTs = testerantoPath + '.ts';
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

  // Use environment variable if set, otherwise use passed bundlesDir
  const effectiveBundlesDir = process.env.BUNDLES_DIR || bundlesDir || `testeranto/bundles/web/${testName}`;
  
  // Ensure effectiveBundlesDir is absolute
  const absoluteBundlesDir = path.isAbsolute(effectiveBundlesDir)
    ? effectiveBundlesDir
    : path.join(process.cwd(), effectiveBundlesDir);

  return {
    ...baseEsBuildConfig(config),

    define: {
      "process.env.FLUENTFFMPEG_COV": "0",
      ENV: `"web"`,
    },

    treeShaking: true,
    outdir: absoluteBundlesDir,
    outbase: ".", // Preserve directory structure relative to outdir
    absWorkingDir: process.cwd(), // Set working directory for resolving paths

    alias: {
      react: path.resolve("./node_modules/react"),
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
      "dns",
    ],

    platform: "browser",

    entryPoints: entryPointsObj,

    loader: config.web.loaders as any,

    plugins: [
      featuresPlugin,
      inputFilesPluginFactory,

      rebuildPlugin("web"),

      ...((config.web.plugins || []).map((p) => p(register, entryPoints)) ||
        []),
    ],
  };
};
