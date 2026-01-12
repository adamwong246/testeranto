import fs from "fs";
import { default as ansiC } from "ansi-colors";
import path from "path";
import chokidar from "chokidar";
import { IMode } from "../types";
import { IBuiltConfig, IRunTime } from "../../Types";
import { Server_ProcessManager } from "./Server_ProcessManager";
import { IMetaFile } from "./utils/types";

const metafiles = [
  "testeranto/metafiles/golang/allTests.json",
  "testeranto/metafiles/node/allTests.json",
  "testeranto/metafiles/python/allTests.json",
  "testeranto/metafiles/web/allTests.json",
];

export class Server_MetafileWatcher extends Server_ProcessManager {
  private watchers: chokidar.FSWatcher[] = [];
  private metafilePaths: string[] = [];
  private lastProcessed: Map<string, number> = new Map();

  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);
    this.initializeMetafilePaths();
  }

  private initializeMetafilePaths(): void {
    // Generate metafile paths based on the project structure
    const baseDir = process.cwd();
    this.metafilePaths = metafiles.map((file) => path.join(baseDir, file));

    // Also include any additional metafiles from configs if present
    if (this.configs.src) {
      const srcDir = this.configs.src;
      // Add metafiles for each runtime from the source directory
      const runtimes: IRunTime[] = ["golang", "node", "python", "web"];
      runtimes.forEach((runtime) => {
        const metafilePath = path.join(
          baseDir,
          srcDir,
          "testeranto",
          "metafiles",
          runtime,
          "allTests.json"
        );
        if (!this.metafilePaths.includes(metafilePath)) {
          this.metafilePaths.push(metafilePath);
        }
      });
    }
  }

  // async start() {
  //   this.startWatchingMetafiles();
  // }

  async start() {
    console.log(ansiC.blue(ansiC.inverse("Starting metafile watchers...")));

    // Filter to only existing metafiles
    const existingMetafiles = this.metafilePaths.filter((file) => {
      const exists = fs.existsSync(file);
      if (!exists) {
        console.log(
          ansiC.yellow(
            `Metafile does not exist, will watch when created: ${file}`
          )
        );
      }
      return exists;
    });

    if (existingMetafiles.length === 0) {
      console.log(
        ansiC.yellow(
          "No existing metafiles found to watch. Will watch for creation."
        )
      );
    }

    // Watch for changes in metafile directories
    const watchDirs = [
      path.join(process.cwd(), "testeranto", "metafiles"),
      ...(this.configs.src
        ? [
            path.join(
              process.cwd(),
              this.configs.src,
              "testeranto",
              "metafiles"
            ),
          ]
        : []),
    ].filter((dir) => fs.existsSync(dir));

    if (watchDirs.length === 0) {
      console.log(ansiC.yellow("No metafile directories found to watch."));
      return;
    }

    // Create watchers for each directory
    watchDirs.forEach((dir) => {
      console.log(ansiC.blue(`Watching directory: ${dir}`));

      const watcher = chokidar.watch(dir, {
        persistent: true,
        ignoreInitial: true,
        depth: 2,
        awaitWriteFinish: {
          stabilityThreshold: 1000,
          pollInterval: 100,
        },
      });

      watcher
        .on("add", (filePath) => this.handleMetafileChange("add", filePath))
        .on("change", (filePath) =>
          this.handleMetafileChange("change", filePath)
        )
        .on("unlink", (filePath) =>
          this.handleMetafileChange("unlink", filePath)
        )
        .on("error", (error) =>
          console.error(ansiC.red(`Watcher error: ${error}`))
        );

      this.watchers.push(watcher);
    });

    // Also watch individual metafile paths for changes
    existingMetafiles.forEach((metafile) => {
      const dir = path.dirname(metafile);
      const watcher = chokidar.watch(metafile, {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 1000,
          pollInterval: 100,
        },
      });

      watcher
        .on("change", (filePath) =>
          this.handleMetafileChange("change", filePath)
        )
        .on("unlink", (filePath) =>
          this.handleMetafileChange("unlink", filePath)
        )
        .on("error", (error) =>
          console.error(ansiC.red(`Metafile watcher error: ${error}`))
        );

      this.watchers.push(watcher);
      console.log(ansiC.blue(`Watching metafile: ${metafile}`));
    });

    console.log(
      ansiC.green(
        ansiC.inverse(`Started ${this.watchers.length} metafile watchers`)
      )
    );
  }

  private handleMetafileChange(
    event: "add" | "change" | "unlink",
    filePath: string
  ): void {
    // Only process JSON files that match our metafile pattern
    if (!filePath.endsWith(".json") || !filePath.includes("metafiles")) {
      return;
    }

    // Check if this is one of the metafiles we care about
    const isMetafile = this.metafilePaths.some(
      (metafile) =>
        path.resolve(metafile) === path.resolve(filePath) ||
        filePath.includes("allTests.json")
    );

    if (!isMetafile) {
      return;
    }

    // Debounce: only process once per second per file
    const now = Date.now();
    const lastProcessed = this.lastProcessed.get(filePath) || 0;
    if (now - lastProcessed < 1000) {
      return;
    }
    this.lastProcessed.set(filePath, now);

    console.log(ansiC.cyan(`Metafile ${event}: ${filePath}`));

    switch (event) {
      case "add":
      case "change":
        this.processMetafileUpdate(filePath);
        break;
      case "unlink":
        console.log(ansiC.yellow(`Metafile removed: ${filePath}`));
        // Handle metafile removal if needed
        break;
    }
  }

  private processMetafileUpdate(metaFileSourcePath: string): void {
    try {
      if (!fs.existsSync(metaFileSourcePath)) {
        console.log(
          ansiC.yellow(`Metafile doesn't exist: ${metaFileSourcePath}`)
        );
        return;
      }

      const data = fs.readFileSync(metaFileSourcePath, "utf8");
      const metafile = JSON.parse(data) as IMetaFile;
      const runtime = this.extractRuntimeFromPath(metaFileSourcePath);

      // Schedule tests based on metafile content
      this.scheduleTestsFromMetafile(metafile, runtime);
    } catch (error) {
      console.error(
        ansiC.red(`Error processing metafile ${metaFileSourcePath}:`),
        error
      );
    }
  }

  private extractRuntimeFromPath(filePath: string): IRunTime {
    const pathParts = filePath.split(path.sep);
    const metafilesIndex = pathParts.indexOf("metafiles");

    if (metafilesIndex !== -1 && metafilesIndex + 1 < pathParts.length) {
      const runtime = pathParts[metafilesIndex + 1];
      if (["golang", "node", "python", "web"].includes(runtime)) {
        return runtime as IRunTime;
      }
    }

    // Fallback: try to determine from file path
    if (filePath.includes("golang")) return "golang";
    if (filePath.includes("node")) return "node";
    if (filePath.includes("python")) return "python";
    if (filePath.includes("web")) return "web";

    throw "unknown runtime";
  }

  private async scheduleTestsFromMetafile(
    metafile: IMetaFile,
    runtime: IRunTime
  ) {
    for (const [outputFile, outputs] of Object.entries(
      metafile.metafile.outputs
    )) {
      // ex outputFile "testeranto/bundles/allTests/node/example/Calculator.test.mjs"
      // ex entrypoint "example/Calculator.test.ts"

      if (
        outputs.entrypoint ===
        `testeranto/bundles/allTests/${runtime}/${outputFile
          .split(".")
          .slice(0, -1)
          .concat("ts")
          .join(".")}`
      ) {
        const addableFiles = Object.keys(
          metafile.metafile.outputs[outputs.entrypoint].inputs as Map<
            string,
            number
          >
        );

        this.scheduleStaticTests(
          metafile,
          runtime,
          outputs.entrypoint,
          addableFiles
        );
        this.scheduleBddTest(metafile, runtime, outputs.entrypoint);
      }
    }
  }

  async stop() {
    // Close all watchers
    console.log(ansiC.blue(ansiC.inverse("Stopping metafile watchers...")));
    this.watchers.forEach((watcher) => {
      watcher.close();
    });
    this.watchers = [];

    await super.stop();
  }
}

////////////////////////////////////////////////////////////////
// DEPRECATED
////////////////////////////////////////////////////////////////

// async scheduleStaticTest(
//   metafile: IMetaFile,
//   runtime: IRunTime,
//   entrypoint: string
// ) {}

// async scheduleBddTest(
//   metafile: IMetaFile,
//   runtime: IRunTime,
//   entrypoint: string
// ) {}

// // private scheduleTest(
// //   metafile: IMetaFile,
// //   runtime: IRunTime,
// //   entrypoint: string
// //   // testInfo: any,
// //   // runtime: IRunTime,
// //   // metaFileSourcePath: string
// // ): void {
// //   // Extract test name from testInfo
// //   // let testName: string = "";

// //   // let addableFiles: string[] | undefined;
// //   // const addableFiles = this.configs[runtime]

// //   // if (typeof testInfo === "string") {
// //   //   testName = testInfo;
// //   // } else if (testInfo && typeof testInfo === "object") {
// //   //   testName =
// //   //     testInfo.name || testInfo.testName || testInfo.path || "Calculator";
// //   //   // addableFiles = testInfo.files || testInfo.addableFiles;
// //   // } else {
// //   //   testName = "Calculator";
// //   // }

// //   // If testName is a path, extract just the base name without extension
// //   // This is important because BDD test commands expect test names, not paths
// //   // if (testName.includes("/") || testName.includes("\\")) {
// //   //   const parts = testName.split(/[/\\]/);
// //   //   const lastPart = parts[parts.length - 1];
// //   //   // Remove extension
// //   //   testName = lastPart.replace(/\.[^/.]+$/, "");
// //   //   console.log(`Extracted test name from path: ${testName}`);
// //   // }

// //   // Convert metaFileSourcePath to a relative path if needed
// //   const src = path.relative(process.cwd(), metaFileSourcePath);

// //   console.log(
// //     ansiC.magenta(`Queueing test: ${testName} (${runtime}) from ${src}`)
// //   );

// //   // Log additional information for debugging
// //   console.log(
// //     ansiC.cyan(
// //       `Test name: ${testName}, Runtime: ${runtime}, Addable files: ${addableFiles}`
// //     )
// //   );

// //   // Add to queue for processing
// //   this.addToQueue(
// //     testName, // Use the extracted test name, not the source path
// //     runtime,
// //     this.configs,
// //     this.projectName,
// //     this.cleanupTestProcessesInternal?.bind(this) ||
// //       ((testName: string) => {}),
// //     this.checkQueue?.bind(this) || (() => {}),
// //     addableFiles
// //   );
// // }
