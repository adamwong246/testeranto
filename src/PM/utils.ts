/* eslint-disable @typescript-eslint/no-unused-vars */
import ansiC from "ansi-colors";
import path from "path";
import fs from "fs";
import crypto from "node:crypto";

import { IRunTime } from "../Types";

export type IOutputs = Record<
  string,
  {
    entryPoint: string;
    inputs: Record<string, string>;
  }
>;

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
    } else if (runtime === "pure") {
      return {
        exit: fs.createWriteStream(`${safeDest}/exit.log`),
      };
    } else if (runtime === "python") {
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

export async function fileHash(filePath, algorithm = "md5") {
  return new Promise<string>((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("data", (data) => {
      hash.update(data);
    });

    fileStream.on("end", () => {
      const fileHash = hash.digest("hex");
      resolve(fileHash);
    });

    fileStream.on("error", (error) => {
      reject(`Error reading file: ${error.message}`);
    });
  });
}

export const statusMessagePretty = (
  failures: number,
  test: string,
  runtime: IRunTime
) => {
  if (failures === 0) {
    console.log(ansiC.green(ansiC.inverse(`${runtime} > ${test}`)));
  } else if (failures > 0) {
    console.log(
      ansiC.red(
        ansiC.inverse(
          `${runtime} > ${test} failed ${failures} times (exit code: ${failures})`
        )
      )
    );
  } else {
    console.log(
      ansiC.red(ansiC.inverse(`${runtime} > ${test} crashed (exit code: -1)`))
    );
  }
};

export async function writeFileAndCreateDir(filePath, data) {
  const dirPath = path.dirname(filePath);

  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
    await fs.writeFileSync(filePath, data);
  } catch (error) {
    console.error(`Error writing file: ${error}`);
  }
}

export const filesHash = async (files: string[], algorithm = "md5") => {
  return new Promise<string>((resolve, reject) => {
    resolve(
      files.reduce(async (mm: Promise<string>, f) => {
        return (await mm) + (await fileHash(f));
      }, Promise.resolve(""))
    );
  });
};

export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

// Wait for file to exist, checks every 2 seconds by default
export async function pollForFile(path, timeout = 2000) {
  const intervalObj = setInterval(function () {
    const file = path;
    const fileExists = fs.existsSync(file);
    if (fileExists) {
      clearInterval(intervalObj);
    }
  }, timeout);
}

const executablePath = "/opt/homebrew/bin/chromium";

export const puppeteerConfigs = {
  slowMo: 1,
  waitForInitialPage: false,
  executablePath,
  headless: true,
  defaultViewport: null, // Disable default 800x600 viewport
  dumpio: false,
  devtools: false,

  args: [
    "--allow-file-access-from-files",
    "--allow-insecure-localhost",
    "--allow-running-insecure-content",
    "--auto-open-devtools-for-tabs",
    "--disable-dev-shm-usage",
    "--disable-extensions",
    "--disable-features=site-per-process",
    "--disable-gpu",
    "--disable-setuid-sandbox",
    "--disable-site-isolation-trials",
    "--disable-web-security",
    "--no-first-run",
    "--no-sandbox",
    "--no-startup-window",
    "--reduce-security-for-testing",
    "--remote-allow-origins=*",
    "--start-maximized",
    "--unsafely-treat-insecure-origin-as-secure=*",
    `--remote-debugging-port=3234`,
    // "--disable-features=IsolateOrigins,site-per-process",
    // "--disable-features=IsolateOrigins",
    // "--disk-cache-dir=/dev/null",
    // "--disk-cache-size=1",
    // "--no-zygote",
    // "--remote-allow-origins=ws://localhost:3234",
    // "--single-process",
    // "--start-maximized",
    // "--unsafely-treat-insecure-origin-as-secure",
    // "--unsafely-treat-insecure-origin-as-secure=ws://192.168.0.101:3234",
  ],
};
