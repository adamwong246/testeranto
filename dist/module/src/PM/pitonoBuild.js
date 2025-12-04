import { PitonoWatcher } from "../utils/pitonoWatcher";
export class PitonoBuild {
    constructor(config, testName) {
        this.watcher = null;
        this.config = config;
        this.testName = testName;
    }
    async build() {
        // Filter python tests
        const pythonTests = Object.keys(this.config.python.tests).map((testName) => [
            testName,
            "python",
            this.config.python.tests[testName],
            [],
        ]);
        const hasPythonTests = pythonTests.length > 0;
        if (hasPythonTests) {
            // Get the entry points
            const pythonEntryPoints = pythonTests.map((test) => test[0]);
            // Metafile generation is now handled by the build service inside Docker
            // Remove external metafile generation
            // Start watching for changes
            this.watcher = new PitonoWatcher(this.testName, pythonEntryPoints);
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
