// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { BuildOptions } from "esbuild";
// import fs from "fs";
// import path from "path";
// import { ITestconfig } from "../lib/index.js";
// import featuresPlugin from "./featuresPlugin.js";
// import baseEsBuildConfig from "./index.js";
// import inputFilesPlugin from "./inputFilesPlugin.js";
// import rebuildPlugin from "./rebuildPlugin.js";

// export default (
//   config: ITestconfig,
//   entryPoints: string[],
//   testName: string,
//   bundlesDir?: string
// ): BuildOptions => {
//   const { inputFilesPluginFactory, register } = inputFilesPlugin(
//     "web",
//     testName
//   );

//   // Convert entryPoints array to object where key is output path and value is input path
//   // Match the same approach as node.ts
//   const entryPointsObj: Record<string, string> = {};
//   for (const entryPoint of entryPoints) {
//     // Remove extension .ts for the filename
//     const withoutExt = entryPoint.replace(/\.ts$/, "");
//     // The base name without extension
//     const baseName = path.basename(withoutExt); // "Calculator.test"
//     // Get the directory part
//     const dirName = path.dirname(entryPoint); // "src/example" or "example"
//     // Key: path to output file without extension, relative to outdir
//     // We want: "src/example/Calculator.test" or "example/Calculator.test"
//     const outputKey = path.join(dirName, baseName);
//     entryPointsObj[outputKey] = entryPoint;
//   }

//   // Use environment variable if set, otherwise use passed bundlesDir
//   // Match node.ts structure: testeranto/bundles/allTests/web/
//   const effectiveBundlesDir =
//     process.env.BUNDLES_DIR || bundlesDir || `testeranto/bundles/allTests/web/`;

//   // Ensure effectiveBundlesDir is absolute
//   const absoluteBundlesDir = path.isAbsolute(effectiveBundlesDir)
//     ? effectiveBundlesDir
//     : path.join(process.cwd(), effectiveBundlesDir);

//   return {
//     ...baseEsBuildConfig(config),

//     define: {
//       "process.env.FLUENTFFMPEG_COV": "0",
//       ENV: `"web"`,
//     },

//     treeShaking: true,
//     outdir: absoluteBundlesDir,
//     outbase: ".", // Preserve directory structure relative to outdir
//     absWorkingDir: process.cwd(), // Set working directory for resolving paths

//     alias: {
//       react: path.resolve("./node_modules/react"),
//     },

//     metafile: true,

//     external: [
//       "path",
//       "fs",
//       "stream",
//       "http",
//       "constants",
//       "net",
//       "assert",
//       "tls",
//       "os",
//       "child_process",
//       "readline",
//       "zlib",
//       "crypto",
//       "https",
//       "util",
//       "process",
//       "dns",
//     ],

//     platform: "browser",

//     entryPoints: entryPointsObj,

//     loader: (config.web?.loaders || {}) as any,

//     plugins: [
//       featuresPlugin,
//       inputFilesPluginFactory,
//       rebuildPlugin("web"),
//       ...((config.web?.plugins || []).map((p) => p(register, entryPoints)) ||
//         []),
//       {
//         name: "list-output-files",
//         setup(build) {
//           build.onEnd((result) => {
//             if (result.errors.length === 0) {
//               try {
//                 const files = fs.readdirSync(absoluteBundlesDir);

//                 // Recursively list if needed
//                 function listDir(dir: string, indent: string = "") {
//                   const items = fs.readdirSync(dir, { withFileTypes: true });
//                   for (const item of items) {
//                     console.log(indent + item.name);
//                     if (item.isDirectory()) {
//                       listDir(path.join(dir, item.name), indent + "  ");
//                     }
//                   }
//                 }
//                 listDir(absoluteBundlesDir);
//               } catch (e) {
//                 console.log("[web esbuild] Error listing output:", e.message);
//               }
//             }
//           });
//         },
//       },
//     ],
//   };
// };
