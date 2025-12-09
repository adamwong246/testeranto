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
  bundlesDir: string
): BuildOptions => {
  const { inputFilesPluginFactory, register } = inputFilesPlugin(
    "node",
    testName
  );

  // Convert entryPoints array to object where key is output path and value is input path
  // For each entry point like "src/example/Calculator.test.ts"
  // We want output at "{absoluteBundlesDir}/src/example/Calculator.test.mjs"
  const entryPointsObj: Record<string, string> = {};
  // console.log("Processing entry points:", entryPoints);
  for (const entryPoint of entryPoints) {
    // Remove extension .ts for the filename
    const withoutExt = entryPoint.replace(/\.ts$/, "");
    // The base name without extension
    const baseName = path.basename(withoutExt); // "Calculator.test"
    // Get the directory part
    const dirName = path.dirname(entryPoint); // "src/example"
    // Key: path to output file without extension, relative to outdir
    // We want: "src/example/Calculator.test"
    const outputKey = path.join(dirName, baseName);
    entryPointsObj[outputKey] = entryPoint;
    console.log(`  ${entryPoint} -> ${outputKey}.mjs`);
  }
  // console.log("entryPointsObj:", Object.keys(entryPointsObj));

  // console.log(`  entryPointsObj keys: ${Object.keys(entryPointsObj).join(', ')}`);

  // Use environment variable if set, otherwise use passed bundlesDir
  const effectiveBundlesDir = process.env.BUNDLES_DIR || bundlesDir;
  // console.log("bundlesDir parameter:", bundlesDir);
  // console.log("BUNDLES_DIR env:", process.env.BUNDLES_DIR);
  // console.log("effectiveBundlesDir:", effectiveBundlesDir);

  // Ensure effectiveBundlesDir is absolute
  const absoluteBundlesDir = path.isAbsolute(effectiveBundlesDir)
    ? effectiveBundlesDir
    : path.join(process.cwd(), effectiveBundlesDir);

  // console.log("absoluteBundlesDir:", absoluteBundlesDir);

  // Create the directory if it doesn't exist
  // if (!fs.existsSync(absoluteBundlesDir)) {
  //   console.log(`Creating directory: ${absoluteBundlesDir}`);
  //   fs.mkdirSync(absoluteBundlesDir, { recursive: true });
  // }

  // List contents for debugging
  // try {
  //   const files = fs.readdirSync(absoluteBundlesDir);
  //   console.log(`Existing files in ${absoluteBundlesDir}:`, files);
  // } catch (e) {
  //   console.log(`Could not read directory ${absoluteBundlesDir}:`, e.message);
  // }

  return {
    ...baseEsBuildConfig(config),

    // splitting: false, // Disable splitting since each entry point is separate

    outdir: absoluteBundlesDir,
    outbase: ".", // Preserve directory structure relative to outdir
    metafile: true,
    supported: {
      "dynamic-import": true,
    },

    define: {
      "process.env.FLUENTFFMPEG_COV": "0",
      ENV: `"node"`,
    },

    absWorkingDir: process.cwd(),
    platform: "node",

    // external: ["react", ...config.node.externals],
    packages: "external",

    entryPoints: entryPointsObj,
    plugins: [
      featuresPlugin,
      inputFilesPluginFactory,
      rebuildPlugin("node"),
      ...(config.node.plugins.map((p) => p(register, entryPoints)) || []),
      {
        name: "list-output-files",
        setup(build) {
          build.onEnd((result) => {
            if (result.errors.length === 0) {
              try {
                const files = fs.readdirSync(absoluteBundlesDir);

                // Recursively list if needed
                function listDir(dir: string, indent: string = "") {
                  const items = fs.readdirSync(dir, { withFileTypes: true });
                  for (const item of items) {
                    console.log(indent + item.name);
                    if (item.isDirectory()) {
                      listDir(path.join(dir, item.name), indent + "  ");
                    }
                  }
                }
                listDir(absoluteBundlesDir);
              } catch (e) {
                console.log("Error listing output:", e.message);
              }
            }
          });
        },
      },
    ],
  };
};
