// import fs from "fs";
// import { default as ansiC } from "ansi-colors";
// import path from "path";
// import chokidar from "chokidar";
// import { IMode } from "../types";
// import { IBuiltConfig, IRunTime } from "../../Types";
// import { Server_ProcessManager } from "./Server_ProcessManager";
// import { IMetaFile } from "./utils/types";

// const metafiles = [
//   "testeranto/metafiles/golang/allTests.json",
//   "testeranto/metafiles/node/allTests.json",
//   "testeranto/metafiles/python/allTests.json",
//   "testeranto/metafiles/web/allTests.json",
// ];

// export class Server_MetafileWatcher extends Server_ProcessManager {
//   private watchers: chokidar.FSWatcher[] = [];
//   private metafilePaths: string[] = [];
//   private lastProcessed: Map<string, number> = new Map();

//   constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
//     super(configs, testName, mode);
//     this.initializeMetafilePaths();
//   }

//   private initializeMetafilePaths(): void {
//     // Generate metafile paths based on the project structure
//     const baseDir = process.cwd();
//     this.metafilePaths = metafiles.map((file) => path.join(baseDir, file));

//     // Also include any additional metafiles from configs if present
//     if (this.configs.src) {
//       const srcDir = this.configs.src;
//       // Add metafiles for each runtime from the source directory
//       const runtimes: IRunTime[] = ["golang", "node", "python", "web"];
//       runtimes.forEach((runtime) => {
//         const metafilePath = path.join(
//           baseDir,
//           srcDir,
//           "testeranto",
//           "metafiles",
//           runtime,
//           "allTests.json"
//         );
//         if (!this.metafilePaths.includes(metafilePath)) {
//           this.metafilePaths.push(metafilePath);
//         }
//       });
//     }
//   }

//   // async start() {
//   //   this.startWatchingMetafiles();
//   // }

//   async start() {
//     console.log(ansiC.blue(ansiC.inverse("Starting metafile watchers...")));

//     // Filter to only existing metafiles
//     const existingMetafiles = this.metafilePaths.filter((file) => {
//       const exists = fs.existsSync(file);
//       if (!exists) {
//         console.log(
//           ansiC.yellow(
//             `Metafile does not exist, will watch when created: ${file}`
//           )
//         );
//       }
//       return exists;
//     });

//     if (existingMetafiles.length === 0) {
//       console.log(
//         ansiC.yellow(
//           "No existing metafiles found to watch. Will watch for creation."
//         )
//       );
//     }

//     // Watch for changes in metafile directories
//     const watchDirs = [
//       path.join(process.cwd(), "testeranto", "metafiles"),
//       ...(this.configs.src
//         ? [
//             path.join(
//               process.cwd(),
//               this.configs.src,
//               "testeranto",
//               "metafiles"
//             ),
//           ]
//         : []),
//     ].filter((dir) => fs.existsSync(dir));

//     if (watchDirs.length === 0) {
//       console.log(ansiC.yellow("No metafile directories found to watch."));
//       return;
//     }

//     // Create watchers for each directory
//     watchDirs.forEach((dir) => {
//       console.log(ansiC.blue(`Watching directory: ${dir}`));

//       const watcher = chokidar.watch(dir, {
//         persistent: true,
//         ignoreInitial: true,
//         depth: 2,
//         awaitWriteFinish: {
//           stabilityThreshold: 1000,
//           pollInterval: 100,
//         },
//       });

//       watcher
//         .on("add", (filePath) => this.handleMetafileChange("add", filePath))
//         .on("change", (filePath) =>
//           this.handleMetafileChange("change", filePath)
//         )
//         .on("unlink", (filePath) =>
//           this.handleMetafileChange("unlink", filePath)
//         )
//         .on("error", (error) =>
//           console.error(ansiC.red(`Watcher error: ${error}`))
//         );

//       this.watchers.push(watcher);
//     });

//     // Also watch individual metafile paths for changes
//     existingMetafiles.forEach((metafile) => {
//       const dir = path.dirname(metafile);
//       const watcher = chokidar.watch(metafile, {
//         persistent: true,
//         ignoreInitial: true,
//         awaitWriteFinish: {
//           stabilityThreshold: 1000,
//           pollInterval: 100,
//         },
//       });

//       watcher
//         .on("change", (filePath) =>
//           this.handleMetafileChange("change", filePath)
//         )
//         .on("unlink", (filePath) =>
//           this.handleMetafileChange("unlink", filePath)
//         )
//         .on("error", (error) =>
//           console.error(ansiC.red(`Metafile watcher error: ${error}`))
//         );

//       this.watchers.push(watcher);
//       console.log(ansiC.blue(`Watching metafile: ${metafile}`));
//     });

//     console.log(
//       ansiC.green(
//         ansiC.inverse(`Started ${this.watchers.length} metafile watchers`)
//       )
//     );
//   }

//   private handleMetafileChange(
//     event: "add" | "change" | "unlink",
//     filePath: string
//   ): void {
//     // Only process JSON files that match our metafile pattern
//     if (!filePath.endsWith(".json") || !filePath.includes("metafiles")) {
//       return;
//     }

//     // Check if this is one of the metafiles we care about
//     const isMetafile = this.metafilePaths.some(
//       (metafile) =>
//         path.resolve(metafile) === path.resolve(filePath) ||
//         filePath.includes("allTests.json")
//     );

//     if (!isMetafile) {
//       return;
//     }

//     // Debounce: only process once per second per file
//     const now = Date.now();
//     const lastProcessed = this.lastProcessed.get(filePath) || 0;
//     if (now - lastProcessed < 1000) {
//       return;
//     }
//     this.lastProcessed.set(filePath, now);

//     console.log(ansiC.cyan(`Metafile ${event}: ${filePath}`));

//     switch (event) {
//       case "add":
//       case "change":
//         this.processMetafileUpdate(filePath);
//         break;
//       case "unlink":
//         console.log(ansiC.yellow(`Metafile removed: ${filePath}`));
//         // Handle metafile removal if needed
//         break;
//     }
//   }

//   private processMetafileUpdate(metaFileSourcePath: string): void {
//     try {
//       if (!fs.existsSync(metaFileSourcePath)) {
//         console.log(
//           ansiC.yellow(`Metafile doesn't exist: ${metaFileSourcePath}`)
//         );
//         return;
//       }

//       const data = fs.readFileSync(metaFileSourcePath, "utf8");
//       const parsed = JSON.parse(data);
      
//       // Debug: log the parsed structure
//       console.log(ansiC.cyan(`Parsed metafile keys: ${Object.keys(parsed).join(', ')}`));
      
//       // The actual metafile structure might be different from IMetaFile
//       // Let's check if 'metafile' exists, otherwise the parsed object might be the metafile itself
//       let metafileData = parsed;
//       if (parsed.metafile) {
//         metafileData = parsed.metafile;
//       }
      
//       // Convert to IMetaFile structure
//       const metafile: IMetaFile = {
//         errors: parsed.errors || [],
//         warnings: parsed.warnings || [],
//         metafile: {
//           inputs: new Map(),
//           outputs: new Map()
//         }
//       };
      
//       // Try to populate inputs and outputs
//       // Check if metafileData has inputs and outputs
//       if (metafileData.inputs) {
//         if (metafileData.inputs instanceof Map) {
//           metafile.metafile.inputs = metafileData.inputs;
//         } else if (typeof metafileData.inputs === 'object') {
//           const inputsMap = new Map();
//           for (const [key, value] of Object.entries(metafileData.inputs)) {
//             inputsMap.set(key, value);
//           }
//           metafile.metafile.inputs = inputsMap;
//         }
//       }
      
//       if (metafileData.outputs) {
//         if (metafileData.outputs instanceof Map) {
//           metafile.metafile.outputs = metafileData.outputs;
//         } else if (typeof metafileData.outputs === 'object') {
//           const outputsMap = new Map();
//           for (const [key, value] of Object.entries(metafileData.outputs)) {
//             outputsMap.set(key, value);
//           }
//           metafile.metafile.outputs = outputsMap;
//         }
//       }
      
//       console.log(ansiC.green(`Metafile processed: ${metaFileSourcePath}`));
//       console.log(ansiC.cyan(`Inputs count: ${metafile.metafile.inputs.size}`));
//       console.log(ansiC.cyan(`Outputs count: ${metafile.metafile.outputs.size}`));
      
//       const runtime = this.extractRuntimeFromPath(metaFileSourcePath);

//       // Schedule tests based on metafile content
//       this.scheduleTestsFromMetafile(metafile, runtime);
//     } catch (error) {
//       console.error(
//         ansiC.red(`Error processing metafile ${metaFileSourcePath}:`),
//         error
//       );
//     }
//   }

//   private extractRuntimeFromPath(filePath: string): IRunTime {
//     const pathParts = filePath.split(path.sep);
//     const metafilesIndex = pathParts.indexOf("metafiles");

//     if (metafilesIndex !== -1 && metafilesIndex + 1 < pathParts.length) {
//       const runtime = pathParts[metafilesIndex + 1];
//       if (["golang", "node", "python", "web"].includes(runtime)) {
//         return runtime as IRunTime;
//       }
//     }

//     // Fallback: try to determine from file path
//     if (filePath.includes("golang")) return "golang";
//     if (filePath.includes("node")) return "node";
//     if (filePath.includes("python")) return "python";
//     if (filePath.includes("web")) return "web";

//     throw "unknown runtime";
//   }

//   private async scheduleTestsFromMetafile(
//     metafile: IMetaFile,
//     runtime: IRunTime
//   ) {
//     // Check if metafile.metafile exists
//     if (!metafile.metafile) {
//       console.error(ansiC.red('Metafile missing metafile property'));
//       return;
//     }
    
//     // Check if outputs exists
//     if (!metafile.metafile.outputs) {
//       console.error(ansiC.red('Metafile missing outputs property'));
//       return;
//     }
    
//     const outputsMap = metafile.metafile.outputs;
//     console.log(ansiC.cyan(`Processing ${outputsMap.size} outputs for ${runtime}`));
    
//     // Track which entrypoints we've already scheduled to avoid duplicates
//     const scheduledEntrypoints = new Set<string>();
    
//     // Iterate through Map entries
//     for (const [outputFile, outputs] of outputsMap.entries()) {
//       // Log for debugging
//       console.log(ansiC.magenta(`Output file: ${outputFile}`));
      
//       // Check if outputs is valid
//       if (!outputs || typeof outputs !== 'object') {
//         console.error(ansiC.yellow(`Skipping invalid output entry for ${outputFile}`));
//         continue;
//       }
      
//       const entrypoint = outputs.entryPoint || outputs.entrypoint;
//       if (!entrypoint) {
//         console.log(ansiC.yellow(`No entrypoint for ${outputFile}`));
//         continue;
//       }
      
//       console.log(ansiC.magenta(`Outputs entrypoint: ${entrypoint}`));
      
//       // We need to identify which outputs are actual test entrypoints vs chunks
//       // Entrypoints should be source files (e.g., .ts files), not bundled .mjs files
//       // Also, we should skip chunk files and other non-entrypoint outputs
      
//       // Check if this output file is a chunk or a non-entrypoint bundle
//       // Chunks typically have names like "chunk-*.mjs" or "Node-*.mjs"
//       const isChunkFile = 
//         outputFile.includes('chunk-') || 
//         outputFile.includes('Node-') ||
//         !outputFile.includes('example/');
      
//       // The entrypoint should be a source file path, not a bundled path
//       // For example: entrypoint should be "example/Calculator.test.ts"
//       // not "testeranto/bundles/allTests/node/example/Calculator.test.mjs"
      
//       // We want to schedule tests for source entrypoints, not for chunk files
//       // Also, we should only schedule each entrypoint once
//       if (isChunkFile) {
//         console.log(ansiC.yellow(`Skipping chunk file: ${outputFile}`));
//         continue;
//       }
      
//       // Check if the entrypoint is a source file (ends with .ts, .js, .go, .py, etc.)
//       const isSourceEntrypoint = 
//         entrypoint.endsWith('.ts') || 
//         entrypoint.endsWith('.js') ||
//         entrypoint.endsWith('.go') ||
//         entrypoint.endsWith('.py');
      
//       if (!isSourceEntrypoint) {
//         console.log(ansiC.yellow(`Entrypoint ${entrypoint} doesn't appear to be a source file`));
//         continue;
//       }
      
//       // Avoid scheduling the same entrypoint multiple times
//       if (scheduledEntrypoints.has(entrypoint)) {
//         console.log(ansiC.yellow(`Entrypoint ${entrypoint} already scheduled`));
//         continue;
//       }
      
//       // Get addableFiles from inputs
//       let addableFiles: string[] = [];
      
//       // Try to get inputs from the current outputs
//       if (outputs.inputs) {
//         if (outputs.inputs instanceof Map) {
//           addableFiles = Array.from(outputs.inputs.keys());
//         } else if (typeof outputs.inputs === 'object') {
//           // Convert plain object to array of keys
//           addableFiles = Object.keys(outputs.inputs);
//         }
//       } else {
//         // Try to get inputs from the entrypoint in outputs
//         const entrypointOutputs = outputsMap.get(entrypoint);
//         if (entrypointOutputs?.inputs) {
//           if (entrypointOutputs.inputs instanceof Map) {
//             addableFiles = Array.from(entrypointOutputs.inputs.keys());
//           } else if (typeof entrypointOutputs.inputs === 'object') {
//             addableFiles = Object.keys(entrypointOutputs.inputs);
//           }
//         }
//       }
      
//       // Also, we can get all input files from the metafile's inputs section
//       if (addableFiles.length === 0 && metafile.metafile.inputs) {
//         const inputsMap = metafile.metafile.inputs;
//         if (inputsMap instanceof Map) {
//           addableFiles = Array.from(inputsMap.keys());
//         } else if (typeof inputsMap === 'object') {
//           addableFiles = Object.keys(inputsMap);
//         }
//       }
      
//       console.log(ansiC.green(`Scheduling tests for ${entrypoint} with ${addableFiles.length} addable files`));
      
//       // Schedule tests
//       this.scheduleStaticTests(
//         metafile,
//         runtime,
//         entrypoint,
//         addableFiles
//       );
//       this.scheduleBddTest(metafile, runtime, entrypoint);
      
//       // Mark this entrypoint as scheduled
//       scheduledEntrypoints.add(entrypoint);
//     }
    
//     // If no entrypoints were found, log a warning
//     if (scheduledEntrypoints.size === 0) {
//       console.log(ansiC.yellow(`No valid entrypoints found for ${runtime}. Checking all outputs...`));
      
//       // Fallback: try to find any output that looks like a test file
//       for (const [outputFile, outputs] of outputsMap.entries()) {
//         if (outputs && typeof outputs === 'object') {
//           const entrypoint = outputs.entryPoint || outputs.entrypoint;
//           if (entrypoint && entrypoint.includes('example/')) {
//             console.log(ansiC.yellow(`Fallback scheduling for ${entrypoint}`));
            
//             let addableFiles: string[] = [];
//             if (metafile.metafile.inputs) {
//               const inputsMap = metafile.metafile.inputs;
//               if (inputsMap instanceof Map) {
//                 addableFiles = Array.from(inputsMap.keys());
//               } else if (typeof inputsMap === 'object') {
//                 addableFiles = Object.keys(inputsMap);
//               }
//             }
            
//             this.scheduleStaticTests(
//               metafile,
//               runtime,
//               entrypoint,
//               addableFiles
//             );
//             this.scheduleBddTest(metafile, runtime, entrypoint);
//             break;
//           }
//         }
//       }
//     }
//   }

//   async stop() {
//     // Close all watchers
//     console.log(ansiC.blue(ansiC.inverse("Stopping metafile watchers...")));
//     this.watchers.forEach((watcher) => {
//       watcher.close();
//     });
//     this.watchers = [];

//     await super.stop();
//   }
// }

// ////////////////////////////////////////////////////////////////
// // DEPRECATED
// ////////////////////////////////////////////////////////////////

// // async scheduleStaticTest(
// //   metafile: IMetaFile,
// //   runtime: IRunTime,
// //   entrypoint: string
// // ) {}

// // async scheduleBddTest(
// //   metafile: IMetaFile,
// //   runtime: IRunTime,
// //   entrypoint: string
// // ) {}

// // // private scheduleTest(
// // //   metafile: IMetaFile,
// // //   runtime: IRunTime,
// // //   entrypoint: string
// // //   // testInfo: any,
// // //   // runtime: IRunTime,
// // //   // metaFileSourcePath: string
// // // ): void {
// // //   // Extract test name from testInfo
// // //   // let testName: string = "";

// // //   // let addableFiles: string[] | undefined;
// // //   // const addableFiles = this.configs[runtime]

// // //   // if (typeof testInfo === "string") {
// // //   //   testName = testInfo;
// // //   // } else if (testInfo && typeof testInfo === "object") {
// // //   //   testName =
// // //   //     testInfo.name || testInfo.testName || testInfo.path || "Calculator";
// // //   //   // addableFiles = testInfo.files || testInfo.addableFiles;
// // //   // } else {
// // //   //   testName = "Calculator";
// // //   // }

// // //   // If testName is a path, extract just the base name without extension
// // //   // This is important because BDD test commands expect test names, not paths
// // //   // if (testName.includes("/") || testName.includes("\\")) {
// // //   //   const parts = testName.split(/[/\\]/);
// // //   //   const lastPart = parts[parts.length - 1];
// // //   //   // Remove extension
// // //   //   testName = lastPart.replace(/\.[^/.]+$/, "");
// // //   //   console.log(`Extracted test name from path: ${testName}`);
// // //   // }

// // //   // Convert metaFileSourcePath to a relative path if needed
// // //   const src = path.relative(process.cwd(), metaFileSourcePath);

// // //   console.log(
// // //     ansiC.magenta(`Queueing test: ${testName} (${runtime}) from ${src}`)
// // //   );

// // //   // Log additional information for debugging
// // //   console.log(
// // //     ansiC.cyan(
// // //       `Test name: ${testName}, Runtime: ${runtime}, Addable files: ${addableFiles}`
// // //     )
// // //   );

// // //   // Add to queue for processing
// // //   this.addToQueue(
// // //     testName, // Use the extracted test name, not the source path
// // //     runtime,
// // //     this.configs,
// // //     this.projectName,
// // //     this.cleanupTestProcessesInternal?.bind(this) ||
// // //       ((testName: string) => {}),
// // //     this.checkQueue?.bind(this) || (() => {}),
// // //     addableFiles
// // //   );
// // // }
