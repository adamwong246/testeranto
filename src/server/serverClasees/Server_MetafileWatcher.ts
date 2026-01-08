import fs from "fs";
import { default as ansiC } from "ansi-colors";
import path from "path";
import chokidar from "chokidar";
import { IMode } from "../types";
import { IBuiltConfig, IRunTime } from "../../Types";
import { Server_ProcessManager } from "./Server_ProcessManager";

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

  async start() {
    this.startWatchingMetafiles();
  }

  private startWatchingMetafiles(): void {
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

  private processMetafileUpdate(filePath: string): void {
    try {
      if (!fs.existsSync(filePath)) {
        console.log(ansiC.yellow(`Metafile doesn't exist: ${filePath}`));
        return;
      }

      const data = fs.readFileSync(filePath, "utf8");
      const metafile = JSON.parse(data);

      // Extract runtime from file path
      const runtime = this.extractRuntimeFromPath(filePath);

      console.log(
        ansiC.green(`Processing ${runtime} metafile update from ${filePath}`)
      );

      // Schedule tests based on metafile content
      this.scheduleTestsFromMetafile(metafile, runtime, filePath);
    } catch (error) {
      console.error(ansiC.red(`Error processing metafile ${filePath}:`), error);
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

    return "node"; // Default
  }

  private scheduleTestsFromMetafile(
    metafile: any,
    runtime: IRunTime,
    sourcePath: string
  ): void {
    // The metafile should contain information about tests that need to be scheduled
    // This could be an array of test names, or an object with test information

    if (Array.isArray(metafile)) {
      // If it's an array, schedule each test
      metafile.forEach((testInfo: any) => {
        this.scheduleTest(testInfo, runtime, sourcePath);
      });
    } else if (typeof metafile === "object") {
      // If it's an object, look for tests property or iterate through keys
      if (metafile.tests && Array.isArray(metafile.tests)) {
        metafile.tests.forEach((testInfo: any) => {
          this.scheduleTest(testInfo, runtime, sourcePath);
        });
      } else {
        // Try to extract test information from the object
        Object.entries(metafile).forEach(([key, value]) => {
          this.scheduleTest(value, runtime, sourcePath);
        });
      }
    }

    console.log(ansiC.blue(`Scheduled tests from ${runtime} metafile`));
  }

  private scheduleTest(
    testInfo: any,
    runtime: IRunTime,
    sourcePath: string
  ): void {
    // Extract test name from testInfo
    let testName: string;
    let addableFiles: string[] | undefined;

    if (typeof testInfo === "string") {
      testName = testInfo;
    } else if (testInfo && typeof testInfo === "object") {
      testName =
        testInfo.name || testInfo.testName || testInfo.path || "unknown";
      addableFiles = testInfo.files || testInfo.addableFiles;
    } else {
      testName = "unknown";
    }

    // Use the queue's addToQueue method to schedule the test
    // The queue should handle deduplication and processing
    if (this.addToQueue) {
      // Convert sourcePath to a relative path if needed
      const src = path.relative(process.cwd(), sourcePath);

      console.log(
        ansiC.magenta(`Queueing test: ${testName} (${runtime}) from ${src}`)
      );

      // Add to queue for processing
      this.addToQueue(
        src,
        runtime,
        this.configs,
        this.projectName,
        this.cleanupTestProcessesInternal?.bind(this) ||
          ((testName: string) => {}),
        this.checkQueue?.bind(this) || (() => {}),
        addableFiles
      );
    } else {
      console.log(
        ansiC.yellow(`Cannot queue test ${testName}: addToQueue not available`)
      );
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
