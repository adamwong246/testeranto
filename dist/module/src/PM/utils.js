import ansiC from "ansi-colors";
import fs from "fs";
import crypto from "node:crypto";
export function runtimeLogs(runtime, reportDest) {
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
        }
        else if (runtime === "web") {
            return {
                info: fs.createWriteStream(`${safeDest}/info.log`),
                warn: fs.createWriteStream(`${safeDest}/warn.log`),
                error: fs.createWriteStream(`${safeDest}/error.log`),
                debug: fs.createWriteStream(`${safeDest}/debug.log`),
                exit: fs.createWriteStream(`${safeDest}/exit.log`),
            };
        }
        else if (runtime === "pure") {
            return {
                exit: fs.createWriteStream(`${safeDest}/exit.log`),
            };
        }
        else if (runtime === "pitono") {
            return {
                stdout: fs.createWriteStream(`${safeDest}/stdout.log`),
                stderr: fs.createWriteStream(`${safeDest}/stderr.log`),
                exit: fs.createWriteStream(`${safeDest}/exit.log`),
            };
        }
        else {
            throw `unknown runtime: ${runtime}`;
        }
    }
    catch (e) {
        console.error(`Failed to create log streams in ${safeDest}:`, e);
        throw e;
    }
}
export function createLogStreams(reportDest, runtime) {
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
        return Object.assign(Object.assign({}, streams), { closeAll: () => {
                Object.values(streams).forEach((stream) => !stream.closed && stream.close());
            }, writeExitCode: (code, error) => {
                if (error) {
                    streams.exit.write(`Error: ${error.message}\n`);
                    if (error.stack) {
                        streams.exit.write(`Stack Trace:\n${error.stack}\n`);
                    }
                }
                streams.exit.write(`${code}\n`);
            }, exit: streams.exit });
    }
    catch (e) {
        console.error(`Failed to create log streams in ${safeDest}:`, e);
        throw e;
    }
}
export async function fileHash(filePath, algorithm = "md5") {
    return new Promise((resolve, reject) => {
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
export const statusMessagePretty = (failures, test, runtime) => {
    if (failures === 0) {
        console.log(ansiC.green(ansiC.inverse(`${runtime} > ${test}`)));
    }
    else if (failures > 0) {
        console.log(ansiC.red(ansiC.inverse(`${runtime} > ${test} failed ${failures} times (exit code: ${failures})`)));
    }
    else {
        console.log(ansiC.red(ansiC.inverse(`${runtime} > ${test} crashed (exit code: -1)`)));
    }
};
