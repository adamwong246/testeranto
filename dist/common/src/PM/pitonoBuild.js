"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PitonoBuild = void 0;
const pitonoMetafile_1 = require("../utils/pitonoMetafile");
const pitonoWatcher_1 = require("../utils/pitonoWatcher");
class PitonoBuild {
    constructor(config, testName) {
        this.watcher = null;
        this.config = config;
        this.testName = testName;
    }
    async build() {
        // Filter python tests
        const pythonTests = this.config.tests.filter((test) => test[1] === "python");
        const hasPythonTests = pythonTests.length > 0;
        if (hasPythonTests) {
            // Get the entry points
            const pythonEntryPoints = pythonTests.map((test) => test[0]);
            // Generate and write metafile
            const metafile = await (0, pitonoMetafile_1.generatePitonoMetafile)(this.testName, pythonEntryPoints);
            (0, pitonoMetafile_1.writePitonoMetafile)(this.testName, metafile);
            // Start watching for changes
            this.watcher = new pitonoWatcher_1.PitonoWatcher(this.testName, pythonEntryPoints);
            await this.watcher.start();
            return pythonEntryPoints;
        }
        return [];
    }
    async rebuild() {
        if (this.watcher) {
            await this.watcher.regenerateMetafile();
        }
    }
    stop() {
        if (this.watcher) {
            this.watcher.stop();
            this.watcher = null;
        }
    }
    onBundleChange(callback) {
        if (this.watcher) {
            this.watcher.onMetafileChange(callback);
        }
    }
}
exports.PitonoBuild = PitonoBuild;
