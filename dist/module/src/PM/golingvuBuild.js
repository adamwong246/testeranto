import { generateGolingvuMetafile, writeGolingvuMetafile } from "../utils/golingvuMetafile";
import { GolingvuWatcher } from "../utils/golingvuWatcher";
export class GolingvuBuild {
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
            const metafile = await generateGolingvuMetafile(this.testName, golangEntryPoints);
            writeGolingvuMetafile(this.testName, metafile);
            // Start watching for changes
            this.watcher = new GolingvuWatcher(this.testName, golangEntryPoints);
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
