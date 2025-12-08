import { IRunTime } from "../../Types";
import fs from "fs";
import { lintCheck } from "../node+web/lintCheck";
import { lintPather } from "../utils";

export class EslintCheck {
  constructor(
    private projectName: string,
    private lintIsRunning: (src: string) => void,
    private lintIsNowDone: (src: string, failures: number) => void,
    private addPromiseProcess: (
      processId: string,
      promise: Promise<any>,
      command: string,
      category: string,
      entrypoint: string,
      platform: IRunTime
    ) => void,
    private writeBigBoard: () => void,
    private checkForShutdown: () => void
  ) {}

  async eslintCheck({
    entrypoint,
    addableFiles,
    platform,
  }: {
    entrypoint: string;
    addableFiles: string[];
    platform: IRunTime;
  }): Promise<void> {
    const processId = `eslint-${entrypoint}-${Date.now()}`;
    const command = `eslint check for ${entrypoint}`;

    const eslintPromise = (async () => {
      try {
        this.lintIsRunning(entrypoint);
      } catch (e: any) {
        throw new Error(`Error in eslintCheck: ${e.message}`);
      }
      const filepath = lintPather(entrypoint, platform, this.projectName);
      if (fs.existsSync(filepath)) fs.rmSync(filepath);
      const results = await lintCheck(addableFiles);
      fs.writeFileSync(filepath, results);
      this.lintIsNowDone(entrypoint, results.length);
      return results.length;
    })();

    this.addPromiseProcess(
      processId,
      eslintPromise,
      command,
      "build-time",
      entrypoint,
      platform
    );
  }
}
