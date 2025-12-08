/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChildProcess } from "child_process";
import { LogStreams } from "../../clients/utils";
import { IRunTime } from "../../Types";
import { statusMessagePretty } from "../../clients/utils";
import ansiColors from "ansi-colors";

export class ChildProcessHandler {
  static async handleChildProcess(
    child: ChildProcess,
    logs: LogStreams,
    reportDest: string,
    src: string,
    runtime: IRunTime
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      child.stdout?.on("data", (data) => {
        logs.stdout?.write(data);
      });

      child.stderr?.on("data", (data) => {
        logs.stderr?.write(data);
      });

      child.on("close", (code) => {
        const exitCode = code === null ? -1 : code;
        if (exitCode < 0) {
          logs.writeExitCode(
            exitCode,
            new Error("Process crashed or was terminated")
          );
        } else {
          logs.writeExitCode(exitCode);
        }
        logs.closeAll();

        if (exitCode === 0) {
          // Note: The caller should handle bddTestIsNowDone and statusMessagePretty
          // We'll just resolve here
          resolve();
        } else {
          console.log(
            ansiColors.red(
              `${runtime} ! ${src} failed to execute. Check ${reportDest}/stderr.log for more info`
            )
          );
          // Note: The caller should handle bddTestIsNowDone and statusMessagePretty
          reject(new Error(`Process exited with code ${exitCode}`));
        }
      });

      child.on("error", (e) => {
        console.log(
          ansiColors.red(
            ansiColors.inverse(
              `${src} errored with: ${e.name}. Check error logs for more info`
            )
          )
        );
        // Note: The caller should handle bddTestIsNowDone and statusMessagePretty
        reject(e);
      });
    });
  }
}
