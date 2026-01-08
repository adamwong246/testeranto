import { ChildProcess } from "child_process";
import fs from "fs";
import { IRunTime } from "../../../Types";

export type ProcessCategory = "aider" | "bdd-test" | "build-time" | "other";
type ProcessType = "process" | "promise";
type ProcessStatus = "running" | "exited" | "error" | "completed";

export interface ProcessInfo {
  child?: ChildProcess;
  promise?: Promise<any>;
  status: ProcessStatus;
  exitCode?: number;
  error?: string;
  command: string;
  pid?: number;
  timestamp: string;
  type: ProcessType;
  category: ProcessCategory;
  testName?: string;
  platform: IRunTime;
}

export type LogStreams = {
  closeAll: () => void;
  writeExitCode: (code: number, error?: Error) => void;
  stdout?: fs.WriteStream;
  stderr?: fs.WriteStream;
  info?: fs.WriteStream;
  warn?: fs.WriteStream;
  error?: fs.WriteStream;
  debug?: fs.WriteStream;
  exit: fs.WriteStream;
};

export function runtimeLogs(
  runtime: IRunTime,
  reportDest: string
): Record<string, fs.WriteStream> {
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;

  try {
    if (!fs.existsSync(safeDest)) {
      fs.mkdirSync(safeDest, { recursive: true });
    }

    if (runtime === "node") {
      return {
        stdout: fs.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs.createWriteStream(`${safeDest}/exit.log`),
      };
    } else if (runtime === "web") {
      return {
        info: fs.createWriteStream(`${safeDest}/info.log`),
        warn: fs.createWriteStream(`${safeDest}/warn.log`),
        error: fs.createWriteStream(`${safeDest}/error.log`),
        debug: fs.createWriteStream(`${safeDest}/debug.log`),
        exit: fs.createWriteStream(`${safeDest}/exit.log`),
      };
    }
    // else if (runtime === "pure") {
    //   return {
    //     exit: fs.createWriteStream(`${safeDest}/exit.log`),
    //   };
    // }
    else if (runtime === "python") {
      return {
        stdout: fs.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs.createWriteStream(`${safeDest}/exit.log`),
      };
    } else if (runtime === "golang") {
      return {
        stdout: fs.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs.createWriteStream(`${safeDest}/exit.log`),
      };
    } else {
      throw `unknown runtime: ${runtime}`;
    }
  } catch (e) {
    console.error(`Failed to create log streams in ${safeDest}:`, e);
    throw e;
  }
}

export function createLogStreams(
  reportDest: string,
  runtime: IRunTime
): LogStreams {
  // Create directory if it doesn't exist
  if (!fs.existsSync(reportDest)) {
    fs.mkdirSync(reportDest, { recursive: true });
  }

  // const streams = {
  //   exit: fs.createWriteStream(`${reportDest}/exit.log`),
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;

  try {
    if (!fs.existsSync(safeDest)) {
      fs.mkdirSync(safeDest, { recursive: true });
    }

    const streams = runtimeLogs(runtime, safeDest);
    // const streams = {
    //   exit: fs.createWriteStream(`${safeDest}/exit.log`),
    //   ...(runtime === "node" || runtime === "pure"
    //     ? {
    //         stdout: fs.createWriteStream(`${safeDest}/stdout.log`),
    //         stderr: fs.createWriteStream(`${safeDest}/stderr.log`),
    //       }
    //     : {
    //         info: fs.createWriteStream(`${safeDest}/info.log`),
    //         warn: fs.createWriteStream(`${safeDest}/warn.log`),
    //         error: fs.createWriteStream(`${safeDest}/error.log`),
    //         debug: fs.createWriteStream(`${safeDest}/debug.log`),
    //       }),
    // };

    return {
      ...streams,
      closeAll: () => {
        Object.values(streams).forEach(
          (stream) => !stream.closed && stream.close()
        );
      },
      writeExitCode: (code: number, error?: Error) => {
        if (error) {
          streams.exit.write(`Error: ${error.message}\n`);
          if (error.stack) {
            streams.exit.write(`Stack Trace:\n${error.stack}\n`);
          }
        }
        streams.exit.write(`${code}\n`);
      },
      exit: streams.exit,
    };
  } catch (e) {
    console.error(`Failed to create log streams in ${safeDest}:`, e);
    throw e;
  }
}
