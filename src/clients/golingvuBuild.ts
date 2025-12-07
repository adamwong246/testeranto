import { IBuiltConfig } from "../Types";
import {
  generateGolingvuMetafile,
  writeGolingvuMetafile,
} from "../utils/golingvuMetafile";
import { GolingvuWatcher } from "../utils/golingvuWatcher";

export class GolingvuBuild {
  private config: IBuiltConfig;
  private testName: string;
  private watcher: GolingvuWatcher | null = null;

  constructor(config: IBuiltConfig, testName: string) {
    this.config = config;
    this.testName = testName;
  }

  async build() {
    // Filter golang tests
    const golangTests: [string, string, object, object[]][] = Object.keys(
      this.config.golang.tests
    ).map((testName) => [
      testName,
      "golang",
      this.config.golang.tests[testName],
      [],
    ]);
    // this.config.tests.filter((test) => test[1] === "golang");

    const hasGolangTests = golangTests.length > 0;

    if (hasGolangTests) {
      // Get the entry points
      const golangEntryPoints = golangTests.map((test) => test[0]);

      // Generate and write metafile
      const metafile = await generateGolingvuMetafile(
        this.testName,
        golangEntryPoints
      );
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

  onBundleChange(callback: () => void) {
    if (this.watcher) {
      this.watcher.onMetafileChange(callback);
    }
  }
}
