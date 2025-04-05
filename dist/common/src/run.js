"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const fs_2 = __importDefault(require("fs"));
const tsc_prog_1 = __importDefault(require("tsc-prog"));
const eslint_1 = require("eslint");
const typescript_1 = __importDefault(require("typescript"));
const readline_1 = __importDefault(require("readline"));
const main_1 = require("./PM/main");
const utils_1 = require("./utils");
const ansi_colors_1 = __importDefault(require("ansi-colors"));
console.log(ansi_colors_1.default.inverse("Press 'x' to shutdown forcefully."));
readline_1.default.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
process.stdin.on("keypress", (str, key) => {
    if (key.name === "x") {
        console.log(ansi_colors_1.default.inverse("Shutting down forcefully..."));
        process.exit(-1);
    }
});
async function fileHash(filePath, algorithm = "md5") {
    return new Promise((resolve, reject) => {
        const hash = node_crypto_1.default.createHash(algorithm);
        const fileStream = fs_2.default.createReadStream(filePath);
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
async function filesHash(files, algorithm = "md5") {
    return new Promise((resolve, reject) => {
        resolve(files.reduce(async (mm, f) => {
            return (await mm) + (await fileHash(f));
        }, Promise.resolve("")));
    });
}
const getRunnables = (tests, payload = {
    nodeEntryPoints: {},
    webEntryPoints: {},
}) => {
    return tests.reduce((pt, cv, cndx, cry) => {
        if (cv[1] === "node") {
            pt.nodeEntryPoints[cv[0]] = path_1.default.resolve(`./docs/node/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`);
        }
        else if (cv[1] === "web") {
            pt.webEntryPoints[cv[0]] = path_1.default.resolve(`./docs/web/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`);
        }
        if (cv[3].length) {
            getRunnables(cv[3], payload);
        }
        return pt;
    }, payload);
};
const changes = {};
const tscCheck = async ({ entrypoint, addableFiles, platform, }) => {
    console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`tsc < ${entrypoint}`)));
    const program = tsc_prog_1.default.createProgramFromConfig({
        basePath: process.cwd(), // always required, used for relative paths
        configFilePath: "tsconfig.json", // config to inherit from (optional)
        compilerOptions: {
            rootDir: "src",
            outDir: (0, utils_1.tscPather)(entrypoint, platform),
            // declaration: true,
            // skipLibCheck: true,
            noEmit: true,
        },
        include: addableFiles, //["src/**/*"],
        // exclude: ["**/*.test.ts", "**/*.spec.ts"],
    });
    const tscPath = (0, utils_1.tscPather)(entrypoint, platform);
    let allDiagnostics = program.getSemanticDiagnostics();
    const d = [];
    allDiagnostics.forEach((diagnostic) => {
        if (diagnostic.file) {
            let { line, character } = typescript_1.default.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
            let message = typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            d.push(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }
        else {
            d.push(typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
        }
    });
    fs_2.default.writeFileSync(tscPath, d.join("\n"));
    fs_2.default.writeFileSync((0, utils_1.tscExitCodePather)(entrypoint, platform), d.length.toString());
};
const eslint = new eslint_1.ESLint();
const formatter = await eslint.loadFormatter("./node_modules/testeranto/dist/prebuild/eslint-formatter-testeranto.mjs");
const eslintCheck = async (entrypoint, platform, addableFiles) => {
    console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`eslint < ${entrypoint}`)));
    const results = (await eslint.lintFiles(addableFiles))
        .filter((r) => r.messages.length)
        .filter((r) => {
        return r.messages[0].ruleId !== null;
    })
        .map((r) => {
        delete r.source;
        return r;
    });
    fs_2.default.writeFileSync((0, utils_1.lintPather)(entrypoint, platform), await formatter.format(results));
    fs_2.default.writeFileSync((0, utils_1.lintExitCodePather)(entrypoint, platform), results.length.toString());
};
const makePrompt = async (entryPoint, addableFiles, platform) => {
    const promptPath = path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `prompt.txt`);
    const testPaths = path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `tests.json`);
    const featuresPath = path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `featurePrompt.txt`);
    fs_2.default.writeFileSync(promptPath, `
${addableFiles
        .map((x) => {
        return `/add ${x}`;
    })
        .join("\n")}

/read ${(0, utils_1.lintPather)(entryPoint, platform)}
/read ${(0, utils_1.tscPather)(entryPoint, platform)}
/read ${testPaths}

/load ${featuresPath}

/code Fix the failing tests described in ${testPaths}. Correct any type signature errors described in the files ${(0, utils_1.tscPather)(entryPoint, platform)}. Implement any method which throws "Function not implemented. Resolve the lint errors described in ${(0, utils_1.lintPather)(entryPoint, platform)}"
          `);
};
const metafileOutputs = async (platform) => {
    const metafile = JSON.parse(fs_2.default.readFileSync(`docs/${platform}/metafile.json`).toString()).metafile;
    if (!metafile)
        return;
    const outputs = metafile.outputs;
    Object.keys(outputs).forEach(async (k) => {
        const addableFiles = Object.keys(outputs[k].inputs).filter((i) => {
            if (!fs_2.default.existsSync(i))
                return false;
            if (i.startsWith("node_modules"))
                return false;
            return true;
        });
        const f = `${k.split(".").slice(0, -1).join(".")}/`;
        if (!fs_2.default.existsSync(f)) {
            fs_2.default.mkdirSync(f);
        }
        const entrypoint = outputs[k].entryPoint;
        if (entrypoint) {
            const changeDigest = await filesHash(addableFiles);
            if (changeDigest === changes[entrypoint]) {
                // skip
            }
            else {
                changes[entrypoint] = changeDigest;
                tscCheck({ platform, addableFiles, entrypoint });
                eslintCheck(entrypoint, platform, addableFiles);
                makePrompt(entrypoint, addableFiles, platform);
            }
        }
    });
};
Promise.resolve(`${process.cwd() + "/" + process.argv[2]}`).then(s => __importStar(require(s))).then(async (module) => {
    const rawConfig = module.default;
    const config = Object.assign(Object.assign({}, rawConfig), { buildDir: process.cwd() + "/" + rawConfig.outdir });
    let mode = config.devMode ? "DEV" : "PROD";
    const fileHashes = {};
    let pm = new main_1.PM_Main(config);
    console.log(ansi_colors_1.default.inverse(`Press 'q' to shutdown gracefully`));
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "q") {
            console.log(ansi_colors_1.default.inverse("Testeranto-Run is shutting down gracefully..."));
            mode = "PROD";
            // onDone();
            nodeMetafileWatcher.close();
            webMetafileWatcher.close();
            pm.shutDown();
        }
    });
    metafileOutputs("node");
    const nodeMetafileWatcher = (0, fs_1.watch)("docs/node/metafile.json", async (e, filename) => {
        console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`< ${e} ${filename} (node)`)));
        metafileOutputs("node");
    });
    metafileOutputs("web");
    const webMetafileWatcher = (0, fs_1.watch)("docs/web/metafile.json", async (e, filename) => {
        console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`< ${e} ${filename} (web)`)));
        metafileOutputs("web");
    });
    await pm.startPuppeteer({
        slowMo: 1,
        // timeout: 1,
        waitForInitialPage: false,
        executablePath: 
        // process.env.CHROMIUM_PATH || "/opt/homebrew/bin/chromium",
        "/opt/homebrew/bin/chromium",
        headless: true,
        dumpio: true,
        // timeout: 0,
        devtools: true,
        args: [
            "--auto-open-devtools-for-tabs",
            `--remote-debugging-port=3234`,
            // "--disable-features=IsolateOrigins,site-per-process",
            "--disable-site-isolation-trials",
            "--allow-insecure-localhost",
            "--allow-file-access-from-files",
            "--allow-running-insecure-content",
            "--disable-dev-shm-usage",
            "--disable-extensions",
            "--disable-gpu",
            "--disable-setuid-sandbox",
            "--disable-site-isolation-trials",
            "--disable-web-security",
            "--no-first-run",
            "--no-sandbox",
            "--no-startup-window",
            // "--no-zygote",
            "--reduce-security-for-testing",
            "--remote-allow-origins=*",
            "--unsafely-treat-insecure-origin-as-secure=*",
            // "--disable-features=IsolateOrigins",
            // "--remote-allow-origins=ws://localhost:3234",
            // "--single-process",
            // "--unsafely-treat-insecure-origin-as-secure",
            // "--unsafely-treat-insecure-origin-as-secure=ws://192.168.0.101:3234",
            // "--disk-cache-dir=/dev/null",
            // "--disk-cache-size=1",
            // "--start-maximized",
        ],
    }, ".");
    const { nodeEntryPoints, webEntryPoints } = getRunnables(config.tests);
    Object.entries(nodeEntryPoints).forEach(([k, outputFile]) => {
        pm.launchNode(k, outputFile);
        try {
            (0, fs_1.watch)(outputFile, async (e, filename) => {
                const hash = await fileHash(outputFile);
                if (fileHashes[k] !== hash) {
                    fileHashes[k] = hash;
                    console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`< ${e} ${filename}`)));
                    pm.launchNode(k, outputFile);
                }
            });
        }
        catch (e) {
            console.error(e);
        }
    });
    Object.entries(webEntryPoints).forEach(([k, outputFile]) => {
        pm.launchWeb(k, outputFile);
        (0, fs_1.watch)(outputFile, async (e, filename) => {
            const hash = await fileHash(outputFile);
            if (fileHashes[k] !== hash) {
                fileHashes[k] = hash;
                console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`< ${e} ${filename}`)));
                pm.launchWeb(k, outputFile);
            }
        });
    });
});
