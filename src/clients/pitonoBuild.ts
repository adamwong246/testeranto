import { IBuiltConfig } from "../Types";
import {
  generatePitonoMetafile,
  writePitonoMetafile,
} from "./utils/pitonoMetafile";
import { PitonoWatcher } from "./utils/pitonoWatcher";

export class PitonoBuild {
  private config: IBuiltConfig;
  private testName: string;
  private watcher: PitonoWatcher | null = null;

  constructor(config: IBuiltConfig, testName: string) {
    this.config = config;
    this.testName = testName;
  }

  async build() {
    const pythonTests: [string, string, object, object[]][] = Object.keys(
      this.config.golang.tests
    ).map((testName) => [
      testName,
      "python",
      this.config.python.tests[testName],
      [],
    ]);
    const hasPythonTests = pythonTests.length > 0;

    if (hasPythonTests) {
      const pythonEntryPoints = pythonTests.map((test) => test[0]);

      const metafile = await generatePitonoMetafile(
        this.testName,
        pythonEntryPoints
      );
      writePitonoMetafile(this.testName, metafile);

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

  onBundleChange(callback: () => void) {
    if (this.watcher) {
      this.watcher.onMetafileChange(callback);
    }
  }
}
