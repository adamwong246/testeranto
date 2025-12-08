/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import { tscPather } from "../utils";
import { tscCheck as tscCheckFunction } from "../node+web/tscCheck";
import { IRunTime } from "../../Types";

export class TscCheck {
  constructor(
    private projectName: string,
    private typeCheckIsRunning: (src: string) => void,
    private typeCheckIsNowDone: (src: string, failures: number) => void,
    private addPromiseProcess: (
      processId: string,
      promise: Promise<any>,
      command: string,
      category: string,
      entrypoint: string,
      platform: IRunTime
    ) => void
  ) {}

  async tscCheck({
    entrypoint,
    addableFiles,
    platform,
  }: {
    entrypoint: string;
    addableFiles: string[];
    platform: IRunTime;
  }): Promise<void> {
    const processId = `tsc-${entrypoint}-${Date.now()}`;
    const command = `tsc check for ${entrypoint}`;

    const tscPromise = (async () => {
      try {
        this.typeCheckIsRunning(entrypoint);
      } catch (e: any) {
        // Log error through process manager
        throw new Error(`Error in tscCheck: ${e.message}`);
      }

      const tscPath = tscPather(entrypoint, platform, this.projectName);

      const results = tscCheckFunction({
        entrypoint,
        addableFiles,
        platform,
        projectName: this.projectName,
      });

      fs.writeFileSync(tscPath, results.join("\n"));

      this.typeCheckIsNowDone(entrypoint, results.length);
      return results.length;
    })();

    this.addPromiseProcess(
      processId,
      tscPromise,
      command,
      "build-time",
      entrypoint,
      platform
    );
  }
}
