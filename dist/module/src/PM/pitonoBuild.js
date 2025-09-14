import { generatePitonoMetafile, writePitonoMetafile } from "../utils/pitonoMetafile";
import { PitonoWatcher } from "../utils/pitonoWatcher";
export class PitonoBuild {
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
            const metafile = await generatePitonoMetafile(this.testName, pythonEntryPoints);
            writePitonoMetafile(this.testName, metafile);
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
