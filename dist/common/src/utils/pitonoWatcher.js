"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PitonoWatcher = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const chokidar_1 = __importDefault(require("chokidar"));
const pitonoMetafile_1 = require("./pitonoMetafile");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class PitonoWatcher {
    constructor(testName, entryPoints) {
        this.watcher = null;
        this.onChangeCallback = null;
        this.testName = testName;
        this.entryPoints = entryPoints;
    }
    async start() {
        // Watch source Python files to trigger metafile regeneration
        const pythonFilesPattern = "**/*.py";
        this.watcher = chokidar_1.default.watch(pythonFilesPattern, {
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
        // Add event listeners for source file changes
        this.watcher
            .on("add", (filePath) => {
            this.handleFileChange("add", filePath);
        })
            .on("change", (filePath) => {
            this.handleFileChange("change", filePath);
        })
            .on("unlink", (filePath) => {
            this.handleFileChange("unlink", filePath);
        })
            .on("error", (error) => {
            console.error(`Source watcher error: ${error}`);
        })
            .on("ready", () => {
            console.log("Initial python source file scan complete. Ready for changes.");
        });
        // Second watcher: watches bundle files to schedule tests when they change
        const outputDir = path_1.default.join(process.cwd(), `testeranto/bundles/python/${this.testName}`);
        // Track the last seen signatures to detect changes
        const lastSignatures = new Map();
        // Create a separate watcher for bundle files
        const bundleWatcher = chokidar_1.default.watch(path_1.default.join(outputDir, "*.py"), {
            persistent: true,
            ignoreInitial: false,
            awaitWriteFinish: {
                stabilityThreshold: 100,
                pollInterval: 50,
            },
        });
        bundleWatcher
            .on("add", (filePath) => {
            this.readAndCheckSignature(filePath, lastSignatures);
        })
            .on("change", (filePath) => {
            this.readAndCheckSignature(filePath, lastSignatures);
        })
            .on("error", (error) => console.error(`Bundle watcher error: ${error}`));
        // Initial metafile generation
        await this.regenerateMetafile();
    }
    async handleFileChange(event, filePath) {
        // Add a small delay to ensure the file is fully written
        await new Promise((resolve) => setTimeout(resolve, 100));
        await this.regenerateMetafile();
        if (this.onChangeCallback) {
            this.onChangeCallback();
        }
    }
    readAndCheckSignature(filePath, lastSignatures) {
        try {
            const content = fs_1.default.readFileSync(filePath, "utf-8");
            // Extract the signature from the comment
            const signatureMatch = content.match(/# Signature: (\w+)/);
            if (signatureMatch && signatureMatch[1]) {
                const currentSignature = signatureMatch[1];
                const lastSignature = lastSignatures.get(filePath);
                if (lastSignature === undefined) {
                    lastSignatures.set(filePath, currentSignature);
                }
                else if (lastSignature !== currentSignature) {
                    lastSignatures.set(filePath, currentSignature);
                    if (this.onChangeCallback) {
                        this.onChangeCallback();
                    }
                }
            }
        }
        catch (error) {
            console.error(`Error reading bundle file ${filePath}:`, error);
        }
    }
    async regenerateMetafile() {
        try {
            const metafile = await (0, pitonoMetafile_1.generatePitonoMetafile)(this.testName, this.entryPoints);
            (0, pitonoMetafile_1.writePitonoMetafile)(this.testName, metafile);
        }
        catch (error) {
            console.error("Error regenerating pitono metafile:", error);
        }
    }
    onMetafileChange(callback) {
        this.onChangeCallback = callback;
    }
    stop() {
        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
        }
    }
}
exports.PitonoWatcher = PitonoWatcher;
