/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import ansiC from "ansi-colors";
import fs from "fs";
import path from "path";
import readline from "readline";
import esbuild from "esbuild";
import { getRunnables } from "./utils";
import { AppHtml } from "./utils/buildTemplates";
import esbuildNodeConfiger from "./esbuildConfigs/node";
import esbuildWebConfiger from "./esbuildConfigs/web";
import esbuildImportConfiger from "./esbuildConfigs/pure";
import webHtmlFrame from "./web.html";
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
const testName = process.argv[2];
const mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
    console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
    process.exit(-1);
}
const f = process.cwd() + "/" + "testeranto.config.ts";
console.log("config file:", f);
import(f).then(async (module) => {
    const pckge = (await import(`${process.cwd()}/package.json`)).default;
    const bigConfig = module.default;
    const project = bigConfig.projects[testName];
    if (!project) {
        console.error("no project found for", testName, "in testeranto.config.ts");
        process.exit(-1);
    }
    fs.writeFileSync(`${process.cwd()}/testeranto/projects.json`, JSON.stringify(Object.keys(bigConfig.projects), null, 2));
    const rawConfig = bigConfig.projects[testName];
    if (!rawConfig) {
        console.error(`Project "${testName}" does not exist in the configuration.`);
        console.error("Available projects:", Object.keys(bigConfig.projects));
        process.exit(-1);
    }
    if (!rawConfig.tests) {
        console.error(testName, "appears to have no tests: ", f);
        console.error(`here is the config:`);
        console.log(JSON.stringify(rawConfig));
        process.exit(-1);
    }
    const config = Object.assign(Object.assign({}, rawConfig), { buildDir: process.cwd() + "/testeranto/bundles/" + testName });
    console.log(ansiC.inverse("Press 'q' to initiate a graceful shutdown."));
    console.log(ansiC.inverse("Press 'x' to quit forcefully."));
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "x") {
            console.log(ansiC.inverse("Shutting down forcefully..."));
            process.exit(-1);
        }
    });
    let nodeDone = false;
    let webDone = false;
    let importDone = false;
    let golangDone = false;
    let pitonoDone = false;
    let status = "build";
    const { nodeEntryPoints, nodeEntryPointSidecars, webEntryPoints, webEntryPointSidecars, pureEntryPoints, pureEntryPointSidecars, } = getRunnables(config.tests, testName);
    const onNodeDone = () => {
        nodeDone = true;
        onDone();
    };
    const onWebDone = () => {
        webDone = true;
        onDone();
    };
    const onImportDone = () => {
        importDone = true;
        onDone();
    };
    const onGolangDone = () => {
        golangDone = true;
        onDone();
    };
    const onPitonoDone = () => {
        pitonoDone = true;
        onDone();
    };
    let pm = null;
    const onDone = async () => {
        // Check which test types are present
        const hasGolangTests = config.tests.some(test => test[1] === 'golang');
        const hasPitonoTests = config.tests.some(test => test[1] === 'pitono');
        // Wait for all relevant runtimes to be done
        const allDone = nodeDone && webDone && importDone &&
            (!hasGolangTests || golangDone) &&
            (!hasPitonoTests || pitonoDone);
        if (allDone) {
            status = "built";
            // Start the PM_Main to run the tests after build
            if (!pm) {
                const { PM_Main } = await import("./PM/main");
                pm = new PM_Main(config, testName, mode);
                await pm.start();
            }
        }
        if (allDone && mode === "once") {
            console.log(ansiC.inverse(`${testName} was built and the builder exited successfully.`));
            // Let PM_Main handle the exit after tests are complete
        }
    };
    fs.writeFileSync(`${process.cwd()}/testeranto/projects.html`, AppHtml());
    Object.keys(bigConfig.projects).forEach((projectName) => {
        console.log(`testeranto/reports/${projectName}`);
        if (!fs.existsSync(`testeranto/reports/${projectName}`)) {
            fs.mkdirSync(`testeranto/reports/${projectName}`);
        }
        fs.writeFileSync(`testeranto/reports/${projectName}/config.json`, JSON.stringify(config, null, 2));
    });
    const getSecondaryEndpointsPoints = (runtime) => {
        const meta = (ts, st) => {
            ts.forEach((t) => {
                if (t[1] === runtime) {
                    st.add(t[0]);
                }
                if (Array.isArray(t[3])) {
                    meta(t[3], st);
                }
            });
            return st;
        };
        return Array.from(meta(config.tests, new Set()));
    };
    // Also handle pitono endpoints for HTML generation if needed
    [...getSecondaryEndpointsPoints("pitono")].forEach(async (sourceFilePath) => {
        // You might want to generate specific files for pitono tests here
        console.log(`Pitono test found: ${sourceFilePath}`);
    });
    // Handle golang tests by generating their metafiles
    const golangTests = config.tests.filter(test => test[1] === 'golang');
    const hasGolangTests = golangTests.length > 0;
    if (hasGolangTests) {
        // Import and use the golang metafile utilities
        const { generateGolangMetafile, writeGolangMetafile } = await import('./utils/golingvuMetafile');
        // Get the entry points (first element of each test tuple)
        const golangEntryPoints = golangTests.map(test => test[0]);
        const metafile = await generateGolangMetafile(testName, golangEntryPoints);
        writeGolangMetafile(testName, metafile);
        // Mark golang as done after writing the metafile
        onGolangDone();
    }
    // Handle pitono (Python) tests by generating their metafiles
    const pitonoTests = config.tests.filter(test => test[1] === 'pitono');
    const hasPitonoTests = pitonoTests.length > 0;
    if (hasPitonoTests) {
        // Import and use the pitono metafile utilities
        const { generatePitonoMetafile } = await import('./utils/pitonoMetafile');
        // Get the entry points (first element of each test tuple)
        const pitonoEntryPoints = pitonoTests.map(test => test[0]);
        const metafile = await generatePitonoMetafile(testName, pitonoEntryPoints);
        // Ensure the directory exists
        const pitonoMetafilePath = `${process.cwd()}/testeranto/metafiles/python`;
        await fs.promises.mkdir(pitonoMetafilePath, { recursive: true });
        // Write the metafile to the specified path
        fs.writeFileSync(`${pitonoMetafilePath}/core.json`, JSON.stringify(metafile, null, 2));
        // Mark pitono as done after writing the metafile
        onPitonoDone();
    }
    Promise.resolve(Promise.all([...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
        const sourceFileSplit = sourceFilePath.split("/");
        const sourceDir = sourceFileSplit.slice(0, -1);
        const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
        const sourceFileNameMinusJs = sourceFileName
            .split(".")
            .slice(0, -1)
            .join(".");
        const htmlFilePath = path.normalize(`${process.cwd()}/testeranto/bundles/web/${testName}/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);
        const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
        const cssFilePath = `./${sourceFileNameMinusJs}.css`;
        return fs.promises
            .mkdir(path.dirname(htmlFilePath), { recursive: true })
            .then((x) => fs.writeFileSync(htmlFilePath, webHtmlFrame(jsfilePath, htmlFilePath, cssFilePath)));
    })));
    const x = [
        ["pure", Object.keys(pureEntryPoints)],
        ["node", Object.keys(nodeEntryPoints)],
        ["web", Object.keys(webEntryPoints)],
    ];
    x.forEach(async ([runtime, keys]) => {
        keys.forEach(async (k) => {
            const folder = `testeranto/reports/${testName}/${k
                .split(".")
                .slice(0, -1)
                .join(".")}/${runtime}`;
            await fs.mkdirSync(folder, { recursive: true });
        });
    });
    [
        [pureEntryPoints, pureEntryPointSidecars, "pure"],
        [webEntryPoints, webEntryPointSidecars, "web"],
        [nodeEntryPoints, nodeEntryPointSidecars, "node"],
    ].forEach(([eps, eps2, runtime]) => {
        [...Object.keys(eps), ...Object.keys(eps2)].forEach((ep) => {
            const fp = path.resolve(`testeranto`, `reports`, testName, ep.split(".").slice(0, -1).join("."), runtime);
            fs.mkdirSync(fp, { recursive: true });
        });
    });
    await Promise.all([
        ...[
            [
                esbuildImportConfiger,
                pureEntryPoints,
                pureEntryPointSidecars,
                onImportDone,
            ],
            [
                esbuildNodeConfiger,
                nodeEntryPoints,
                nodeEntryPointSidecars,
                onNodeDone,
            ],
            [esbuildWebConfiger, webEntryPoints, webEntryPointSidecars, onWebDone],
        ].map(([configer, entryPoints, sidecars, done]) => {
            esbuild
                .context(configer(config, [...Object.keys(entryPoints), ...Object.keys(sidecars)], testName))
                .then(async (ctx) => {
                if (mode === "dev") {
                    await ctx.watch().then((v) => {
                        done();
                    });
                }
                else {
                    ctx.rebuild().then((v) => {
                        done();
                    });
                }
                return ctx;
            });
        }),
    ]);
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "q") {
            console.log("Testeranto is shutting down gracefully...");
            if (pm) {
                pm.stop();
            }
            else {
                process.exit();
            }
        }
    });
});
