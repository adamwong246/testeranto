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
    console.log("DEBUG: GolingvuBuild constructor called with testName:", testName);
    this.config = config;
    this.testName = testName;
  }

  async build() {
    console.log("DEBUG: GolingvuBuild.build() called");
    
    // Filter golang tests
    const golangTests: [string, string, object, object[]][] = Object.keys(
      this.config.golang.tests
    ).map((testName) => [
      testName,
      "golang",
      this.config.golang.tests[testName],
      [],
    ]);

    console.log("DEBUG: Golang tests found:", golangTests.length);

    const hasGolangTests = golangTests.length > 0;

    if (hasGolangTests) {
      // Get the entry points
      const golangEntryPoints = golangTests.map((test) => test[0]);
      console.log("DEBUG: Golang entry points:", golangEntryPoints);

      // Metafile generation is now handled by the build service inside Docker
      // Remove external metafile generation

      console.log("DEBUG: About to create watcher with testName:", this.testName);
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
