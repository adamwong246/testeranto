/* eslint-disable @typescript-eslint/no-unused-vars */
import chokidar from "chokidar";
import type { FSWatcher } from "chokidar";
import {
  generateGolingvuMetafile,
  writeGolingvuMetafile,
} from "./golingvuMetafile";
import path from "path";
import fs from "fs";

export class GolingvuWatcher {
  private watcher: FSWatcher | null = null;
  private testName: string;
  private entryPoints: string[];
  private onChangeCallback: (() => void) | null = null;
  private debounceTimer: NodeJS.Timeout | null = null;

  constructor(testName: string, entryPoints: string[]) {
    this.testName = testName;
    this.entryPoints = entryPoints;
  }

  async start() {
    // Watch source Go files to trigger metafile regeneration
    const goFilesPattern = "**/*.go";

    this.watcher = chokidar.watch(goFilesPattern, {
      persistent: true,
      ignoreInitial: true,
      cwd: process.cwd(),
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        "**/testeranto/bundles/**",
        "**/testeranto/reports/**",
      ],
      usePolling: true,
      interval: 1000,
      binaryInterval: 1000,
      depth: 99,
      followSymlinks: false,
      atomic: false,
    });

    // Add event listeners for source file changes with more detailed logging
    this.watcher
      .on("add", (filePath) => {
        console.log(`File added: ${filePath}`);
        this.handleFileChange("add", filePath);
      })
      .on("change", (filePath) => {
        console.log(`File changed: ${filePath}`);
        this.handleFileChange("change", filePath);
      })
      .on("unlink", (filePath) => {
        console.log(`File removed: ${filePath}`);
        this.handleFileChange("unlink", filePath);
      })
      .on("addDir", (dirPath) => {
        console.log(`Directory added: ${dirPath}`);
      })
      .on("unlinkDir", (dirPath) => {
        console.log(`Directory removed: ${dirPath}`);
      })
      .on("error", (error) => {
        console.error(`Source watcher error: ${error}`);
      })
      .on("ready", () => {
        console.log(
          "Initial golang source file scan complete. Ready for changes."
        );
        // Log the watched paths for debugging
        const watched = this.watcher?.getWatched();
        console.log(
          "Number of watched directories:",
          Object.keys(watched || {}).length
        );

        // If no directories are being watched, let's try a different approach
        if (Object.keys(watched || {}).length === 0) {
          console.error("WARNING: No directories are being watched!");
          console.error("Trying to manually find and watch .go files...");

          // Manually find all .go files and add them to the watcher
          const findAllGoFiles = (dir: string): string[] => {
            let results: string[] = [];
            const list = fs.readdirSync(dir);

            list.forEach((file) => {
              const filePath = path.join(dir, file);
              const stat = fs.statSync(filePath);

              if (stat.isDirectory()) {
                // Skip ignored directories
                if (
                  file === "node_modules" ||
                  file === ".git" ||
                  file === "testeranto"
                ) {
                  return;
                }
                results = results.concat(findAllGoFiles(filePath));
              } else if (file.endsWith(".go")) {
                results.push(filePath);
              }
            });

            return results;
          };

          try {
            const allGoFiles = findAllGoFiles(process.cwd());
            console.log(`Found ${allGoFiles.length} Go files manually:`);
            allGoFiles.forEach((file) => console.log(`  ${file}`));

            // Add these files to the watcher
            allGoFiles.forEach((file) => {
              this.watcher?.add(file);
            });
          } catch (error) {
            console.error("Error manually finding Go files:", error);
          }
        } else {
          // Log each directory and its files
          for (const [dir, files] of Object.entries(watched || {})) {
            console.log(`Directory: ${dir}`);
            console.log(`Files: ${(files as string[]).join(", ")}`);
          }
        }
      })
      .on("raw", (event, path, details) => {
        // This can help debug what events are being emitted
        console.log(`Raw event: ${event} on path: ${path}`);
      });

    // Second watcher: watches bundle files in the core directory
    const outputDir = path.join(
      process.cwd(),
      "testeranto",
      "bundles",
      "golang",
      "core"
    );
    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Watching bundle directory: ${outputDir}`);

    // Track the last seen signatures to detect changes
    const lastSignatures = new Map<string, string>();

    // Create a separate watcher for bundle files, including .golingvu.go files
    const bundleWatcher = chokidar.watch(
      [path.join(outputDir, "*.go"), path.join(outputDir, "*.golingvu.go")],
      {
        persistent: true,
        ignoreInitial: false, // We want to capture initial files to establish baseline
        awaitWriteFinish: {
          stabilityThreshold: 100,
          pollInterval: 50,
        },
      }
    );

    bundleWatcher
      .on("add", (filePath) => {
        // Read the signature when the file is added
        this.readAndCheckSignature(filePath, lastSignatures);
      })
      .on("change", (filePath) => {
        // Check if the signature has changed when the file is modified
        this.readAndCheckSignature(filePath, lastSignatures);
      })
      .on("error", (error) => console.error(`Bundle watcher error: ${error}`));

    // Initial metafile generation
    await this.regenerateMetafile();
  }

  private async handleFileChange(event: string, filePath: string) {
    // Debounce file changes to prevent multiple rapid triggers
    // Use a simple timeout-based debounce
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(async () => {
      const fullPath = path.join(process.cwd(), filePath);

      // Add a small delay to ensure the file is fully written
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if the file exists and log its stats
      if (fs.existsSync(fullPath)) {
        try {
          const stats = fs.statSync(fullPath);
          console.log(`File ${filePath} changed (${stats.size} bytes)`);
        } catch (error) {
          console.error(`Error reading file: ${error}`);
        }
      }

      console.log("Regenerating metafile due to file change...");
      await this.regenerateMetafile();
      if (this.onChangeCallback) {
        this.onChangeCallback();
      }
    }, 300); // 300ms debounce
  }

  private readAndCheckSignature(
    filePath: string,
    lastSignatures: Map<string, string>
  ) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      // Extract the signature from the comment
      const signatureMatch = content.match(/\/\/ Signature: (\w+)/);
      if (signatureMatch && signatureMatch[1]) {
        const currentSignature = signatureMatch[1];
        const lastSignature = lastSignatures.get(filePath);

        if (lastSignature === undefined) {
          // First time seeing this file, just record the signature
          lastSignatures.set(filePath, currentSignature);
        } else if (lastSignature !== currentSignature) {
          // Signature changed, trigger test scheduling
          lastSignatures.set(filePath, currentSignature);

          // Find which entry point this corresponds to
          // Handle .golingvu.go files by mapping back to the original .go file
          const fileName = path.basename(filePath);
          // Remove .golingvu from the filename to find the original entry point
          const originalFileName = fileName.replace(".golingvu.go", ".go");

          const originalEntryPoint = this.entryPoints.find(
            (ep) => path.basename(ep) === originalFileName
          );
          if (originalEntryPoint) {
            // Add to processing queue
            if (this.onChangeCallback) {
              this.onChangeCallback();
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error reading bundle file ${filePath}:`, error);
    }
  }

  private async regenerateMetafile() {
    console.log("regenerateMetafile!");

    try {
      // console.log("Regenerating golingvu metafile...");
      // Always regenerate using the original entry points
      const metafile = await generateGolingvuMetafile(
        this.testName,
        this.entryPoints
      );
      writeGolingvuMetafile(this.testName, metafile);
      // console.log("Golingvu metafile regenerated due to Go file changes");
    } catch (error) {
      console.error("Error regenerating golingvu metafile:", error);
    }
  }

  onMetafileChange(callback: () => void) {
    this.onChangeCallback = callback;
  }

  stop() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
}
