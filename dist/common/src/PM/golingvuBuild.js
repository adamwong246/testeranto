"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GolingvuBuild = void 0;
const golingvuMetafile_1 = require("../utils/golingvuMetafile");
const golingvuWatcher_1 = require("../utils/golingvuWatcher");
class GolingvuBuild {
    constructor(config, testName) {
        this.watcher = null;
        this.config = config;
        this.testName = testName;
    }
    async build() {
        // Filter golang tests
        const golangTests = this.config.tests.filter((test) => test[1] === "golang");
        const hasGolangTests = golangTests.length > 0;
        if (hasGolangTests) {
            // Get the entry points
            const golangEntryPoints = golangTests.map((test) => test[0]);
            // Generate and write metafile
            const metafile = await (0, golingvuMetafile_1.generateGolingvuMetafile)(this.testName, golangEntryPoints);
            (0, golingvuMetafile_1.writeGolingvuMetafile)(this.testName, metafile);
            // Start watching for changes
            this.watcher = new golingvuWatcher_1.GolingvuWatcher(this.testName, golangEntryPoints);
            await this.watcher.start();
            return golangEntryPoints;
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
exports.GolingvuBuild = GolingvuBuild;
