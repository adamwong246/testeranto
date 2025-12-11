/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChildProcess } from "child_process";
import { LogStreams } from "../../clients/utils";

import ansiColors from "ansi-colors";
import { IRunTime } from "../../lib";

export class ChildProcessHandler {
  static async handleChildProcess(
    child: ChildProcess,
    logs: LogStreams,
    reportDest: string,
    src: string,
    runtime: IRunTime
  ): Promise<void> {
    // Check if child is a valid ChildProcess object
    if (!child || typeof child.on !== "function") {
      console.error(
        "ChildProcessHandler: child is not a valid ChildProcess object:",
        child
      );
      // Check if logs has writeExitCode method
      if (logs && typeof logs.writeExitCode === "function") {
        logs.writeExitCode(-1, new Error("Invalid child process"));
      } else {
        console.error(
          "ChildProcessHandler: logs.writeExitCode is not a function"
        );
      }
      if (logs && typeof logs.closeAll === "function") {
        logs.closeAll();
      }
      throw new Error(`Invalid child process for ${src || "undefined source"}`);
    }

    return new Promise((resolve, reject) => {
      child.stdout?.on("data", (data) => {
        if (logs.stdout && typeof logs.stdout.write === "function") {
          logs.stdout.write(data);
        }
      });

      child.stderr?.on("data", (data) => {
        if (logs.stderr && typeof logs.stderr.write === "function") {
          logs.stderr.write(data);
        }
      });

      child.on("close", (code) => {
        const exitCode = code === null ? -1 : code;
        if (exitCode < 0) {
          if (logs && typeof logs.writeExitCode === "function") {
            logs.writeExitCode(
              exitCode,
              new Error("Process crashed or was terminated")
            );
          } else {
            console.error(
              "ChildProcessHandler: logs.writeExitCode is not a function"
            );
          }
        } else {
          if (logs && typeof logs.writeExitCode === "function") {
            logs.writeExitCode(exitCode);
          }
        }
        if (logs && typeof logs.closeAll === "function") {
          logs.closeAll();
        }

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
