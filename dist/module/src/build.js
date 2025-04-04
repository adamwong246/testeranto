import fs from "fs";
import path from "path";
import readline from "readline";
import { glob } from "glob";
import esbuild from "esbuild";
import esbuildNodeConfiger from "./esbuildConfigs/node.js";
import esbuildWebConfiger from "./esbuildConfigs/web.js";
import webHtmlFrame from "./web.html.js";
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
const getRunnables = (tests, payload = {
    nodeEntryPoints: {},
    webEntryPoints: {},
}) => {
    return tests.reduce((pt, cv, cndx, cry) => {
        if (cv[1] === "node") {
            pt.nodeEntryPoints[cv[0]] = path.resolve(`./docs/node/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`);
        }
        else if (cv[1] === "web") {
            pt.webEntryPoints[cv[0]] = path.resolve(`./docs/web/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`);
        }
        if (cv[3].length) {
            getRunnables(cv[3], payload);
        }
        return pt;
    }, payload);
};
import(process.cwd() + "/" + process.argv[2]).then(async (module) => {
    const rawConfig = module.default;
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
    const config = Object.assign(Object.assign({}, rawConfig), { buildDir: process.cwd() + "/" + rawConfig.outdir });
    let nodeDone = false;
    let webDone = false;
    let mode = config.devMode ? "DEV" : "PROD";
    let status = "build";
    // let pm: PM_Main | undefined = new PM_Main(config);
    // const fileHashes = {};
    const { nodeEntryPoints, webEntryPoints } = getRunnables(config.tests);
    const onNodeDone = () => {
        nodeDone = true;
        onDone();
    };
    const onWebDone = () => {
        webDone = true;
        onDone();
    };
    const onDone = async () => {
        if (nodeDone && webDone) {
            status = "built";
        }
        if (nodeDone && webDone && status === "built") {
            // Object.entries(nodeEntryPoints).forEach(([k, outputFile]) => {
            //   console.log("watching", outputFile);
            //   try {
            //     watch(outputFile, async (filename) => {
            //       const hash = await fileHash(outputFile);
            //       if (fileHashes[k] !== hash) {
            //         fileHashes[k] = hash;
            //         console.log(`< ${filename} `);
            //         pm.launchNode(k, outputFile);
            //       }
            //     });
            //   } catch (e) {
            //     console.error(e);
            //   }
            // });
            // Object.entries(webEntryPoints).forEach(([k, outputFile]) => {
            //   console.log("watching", outputFile);
            //   watch(outputFile, async (filename) => {
            //     const hash = await fileHash(outputFile);
            //     console.log(`< ${filename} ${hash}`);
            //     if (fileHashes[k] !== hash) {
            //       fileHashes[k] = hash;
            //       pm.launchWeb(k, outputFile);
            //     }
            //   });
            // });
        }
        if (nodeDone && webDone && mode === "PROD") {
            console.log("Testeranto-EsBuild is all done. Goodbye!");
            process.exit();
        }
        else {
            if (mode === "PROD") {
                console.log("waiting for tests to finish");
                console.log(JSON.stringify({
                    nodeDone: nodeDone,
                    webDone: webDone,
                    mode: mode,
                }, null, 2));
            }
            else {
                console.log("waiting for tests to change");
            }
            if (config.devMode) {
                console.log("ready and watching for changes...");
            }
            else {
                // pm.shutDown();
            }
            ////////////////////////////////////////////////////////////////////////////////
        }
    };
    console.log(`Press 'q' to shutdown gracefully. Press 'x' to shutdown forcefully.`);
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "q") {
            console.log("Testeranto-Build is shutting down...");
            mode = "PROD";
            onDone();
        }
        if (key.name === "x") {
            console.log("Testeranto-Build is shutting down forcefully...");
            process.exit(-1);
        }
    });
    fs.writeFileSync(`${config.outdir}/testeranto.json`, JSON.stringify(config, null, 2));
    Promise.resolve(Promise.all([...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
        const sourceFileSplit = sourceFilePath.split("/");
        const sourceDir = sourceFileSplit.slice(0, -1);
        const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
        const sourceFileNameMinusJs = sourceFileName
            .split(".")
            .slice(0, -1)
            .join(".");
        const htmlFilePath = path.normalize(`${process.cwd()}/${config.outdir}/web/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);
        const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
        return fs.promises
            .mkdir(path.dirname(htmlFilePath), { recursive: true })
            .then((x) => fs.writeFileSync(htmlFilePath, webHtmlFrame(jsfilePath, htmlFilePath)));
    })));
    glob(`./${config.outdir}/chunk-*.mjs`, {
        ignore: "node_modules/**",
    }).then((chunks) => {
        chunks.forEach((chunk) => {
            fs.unlinkSync(chunk);
        });
    });
    await Promise.all([
        esbuild
            .context(esbuildNodeConfiger(config, Object.keys(nodeEntryPoints)))
            .then(async (nodeContext) => {
            if (config.devMode) {
                await nodeContext.watch().then((v) => {
                    onNodeDone();
                });
            }
            else {
                nodeContext.rebuild().then((v) => {
                    onNodeDone();
                });
            }
            return nodeContext;
        }),
        esbuild
            .context(esbuildWebConfiger(config, Object.keys(webEntryPoints)))
            .then(async (webContext) => {
            if (config.devMode) {
                await webContext.watch().then((v) => {
                    onWebDone();
                });
            }
            else {
                webContext.rebuild().then((v) => {
                    onWebDone();
                });
            }
            return webContext;
        }),
    ]);
});
