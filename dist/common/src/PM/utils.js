"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.puppeteerConfigs = exports.filesHash = exports.statusMessagePretty = void 0;
exports.runtimeLogs = runtimeLogs;
exports.createLogStreams = createLogStreams;
exports.fileHash = fileHash;
exports.writeFileAndCreateDir = writeFileAndCreateDir;
exports.isValidUrl = isValidUrl;
exports.pollForFile = pollForFile;
/* eslint-disable @typescript-eslint/no-unused-vars */
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const node_crypto_1 = __importDefault(require("node:crypto"));
function runtimeLogs(runtime, reportDest) {
    const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;
    try {
        if (!fs_1.default.existsSync(safeDest)) {
            fs_1.default.mkdirSync(safeDest, { recursive: true });
        }
        if (runtime === "node") {
            return {
                stdout: fs_1.default.createWriteStream(`${safeDest}/stdout.log`),
                stderr: fs_1.default.createWriteStream(`${safeDest}/stderr.log`),
                exit: fs_1.default.createWriteStream(`${safeDest}/exit.log`),
            };
        }
        else if (runtime === "web") {
            return {
                info: fs_1.default.createWriteStream(`${safeDest}/info.log`),
                warn: fs_1.default.createWriteStream(`${safeDest}/warn.log`),
                error: fs_1.default.createWriteStream(`${safeDest}/error.log`),
                debug: fs_1.default.createWriteStream(`${safeDest}/debug.log`),
                exit: fs_1.default.createWriteStream(`${safeDest}/exit.log`),
            };
        }
        else if (runtime === "pure") {
            return {
                exit: fs_1.default.createWriteStream(`${safeDest}/exit.log`),
            };
        }
        else if (runtime === "pitono") {
            return {
                stdout: fs_1.default.createWriteStream(`${safeDest}/stdout.log`),
                stderr: fs_1.default.createWriteStream(`${safeDest}/stderr.log`),
                exit: fs_1.default.createWriteStream(`${safeDest}/exit.log`),
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
function createLogStreams(reportDest, runtime) {
    // Create directory if it doesn't exist
    if (!fs_1.default.existsSync(reportDest)) {
        fs_1.default.mkdirSync(reportDest, { recursive: true });
    }
    // const streams = {
    //   exit: fs.createWriteStream(`${reportDest}/exit.log`),
    const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;
    try {
        if (!fs_1.default.existsSync(safeDest)) {
            fs_1.default.mkdirSync(safeDest, { recursive: true });
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
async function fileHash(filePath, algorithm = "md5") {
    return new Promise((resolve, reject) => {
        const hash = node_crypto_1.default.createHash(algorithm);
        const fileStream = fs_1.default.createReadStream(filePath);
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
const statusMessagePretty = (failures, test, runtime) => {
    if (failures === 0) {
        console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`${runtime} > ${test}`)));
    }
    else if (failures > 0) {
        console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`${runtime} > ${test} failed ${failures} times (exit code: ${failures})`)));
    }
    else {
        console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`${runtime} > ${test} crashed (exit code: -1)`)));
    }
};
exports.statusMessagePretty = statusMessagePretty;
async function writeFileAndCreateDir(filePath, data) {
    const dirPath = path_1.default.dirname(filePath);
    try {
        await fs_1.default.promises.mkdir(dirPath, { recursive: true });
        await fs_1.default.writeFileSync(filePath, data);
    }
    catch (error) {
        console.error(`Error writing file: ${error}`);
    }
}
const filesHash = async (files, algorithm = "md5") => {
    return new Promise((resolve, reject) => {
        resolve(files.reduce(async (mm, f) => {
            return (await mm) + (await fileHash(f));
        }, Promise.resolve("")));
    });
};
exports.filesHash = filesHash;
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    }
    catch (err) {
        return false;
    }
}
// Wait for file to exist, checks every 2 seconds by default
async function pollForFile(path, timeout = 2000) {
    const intervalObj = setInterval(function () {
        const file = path;
        const fileExists = fs_1.default.existsSync(file);
        if (fileExists) {
            clearInterval(intervalObj);
        }
    }, timeout);
}
const executablePath = "/opt/homebrew/bin/chromium";
exports.puppeteerConfigs = {
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
