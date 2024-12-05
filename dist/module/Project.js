import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import readline from "readline";
import { glob } from "glob";
import esbuildNodeConfiger from "./esbuildConfigs/node.js";
import esbuildWebConfiger from "./esbuildConfigs/web.js";
import esbuildFeaturesConfiger from "./esbuildConfigs/features.js";
import webHtmlFrame from "./web.html.js";
import reportHtmlFrame from "./report.html.js";
var mode = process.argv[2] === "-dev" ? "DEV" : "PROD";
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
        console.log("Testeranto-EsBuild is shutting down...");
        mode = "PROD";
        onDone();
    }
});
// setInterval(() => {
//   const memoryUsage = process.memoryUsage();
//   console.log("Memory usage:", memoryUsage);
// }, 10000); // Check every 10 seconds
let featuresDone, nodeDone, webDone = false;
const onFeaturesDone = () => {
    featuresDone = true;
    onDone();
};
const onNodeDone = () => {
    nodeDone = true;
    onDone();
};
const onWebDone = () => {
    webDone = true;
    onDone();
};
const onDone = () => {
    console.log(JSON.stringify({
        featuresDone,
        nodeDone,
        webDone,
        mode,
    }, null, 2));
    if (featuresDone && nodeDone && webDone && mode === "PROD") {
        console.log("Testeranto-EsBuild is all done. Goodbye!");
        process.exit();
    }
    else {
        console.log("Testeranto-EsBuild is still working...");
    }
};
export class ITProject {
    constructor(config) {
        this.mode = `up`;
        this.config = config;
        Promise.resolve(Promise.all([...this.getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
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
        const [nodeEntryPoints, webEntryPoints] = getRunnables(this.config.tests);
        console.log(`this.getSecondaryEndpointsPoints("web")`, this.getSecondaryEndpointsPoints("web"));
        // console.log("nodeEntryPoints", nodeEntryPoints);
        // console.log("webEntryPoints", webEntryPoints);
        // nodeEntryPoints.forEach((nep) => {
        //   const f = `${process.cwd()}/${nep}`;
        //   console.log("nep", f);
        //   import(f).then((module) => {
        //     return module.default.then((defaultModule) => {
        //       console.log("defaultModule", defaultModule);
        //       // defaultModule
        //       //   .receiveTestResourceConfig(argz)
        //       //   .then((x) => {
        //       //     console.log("then", x);
        //       //     return x;
        //       //   })
        //       //   .catch((e) => {
        //       //     console.log("catch", e);
        //       //   });
        //     });
        //   });
        // });
        glob(`./${config.outdir}/chunk-*.mjs`, { ignore: "node_modules/**" }).then((chunks) => {
            chunks.forEach((chunk) => {
                fs.unlinkSync(chunk);
            });
        });
        fs.copyFileSync("./node_modules/testeranto/dist/prebuild/Report.js", "./docs/Report.js");
        fs.copyFileSync("./node_modules/testeranto/dist/prebuild/Report.css", "./docs/Report.css");
        fs.writeFileSync(`${config.outdir}/report.html`, reportHtmlFrame());
        Promise.all([
            fs.promises.writeFile(`${config.outdir}/testeranto.json`, JSON.stringify(Object.assign(Object.assign({}, config), { buildDir: process.cwd() + "/" + config.outdir }), null, 2)),
            esbuild
                .context(esbuildFeaturesConfiger(config))
                .then(async (featuresContext) => {
                if (mode == "DEV") {
                    await featuresContext.watch();
                    onFeaturesDone();
                }
                else {
                    featuresContext.rebuild().then((v) => {
                        onFeaturesDone();
                    });
                }
                return featuresContext;
            }),
            esbuild
                .context(esbuildNodeConfiger(config, nodeEntryPoints))
                .then(async (nodeContext) => {
                if (mode == "DEV") {
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
                .context(esbuildWebConfiger(config, webEntryPoints))
                .then(async (webContext) => {
                if (mode == "DEV") {
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
    }
    getSecondaryEndpointsPoints(runtime) {
        const meta = (ts, st) => {
            ts.forEach((t) => {
                console.log("getSecondaryEndpointsPoints", t);
                if (t[1] === runtime) {
                    st.add(t[0]);
                }
                if (Array.isArray(t[3])) {
                    meta(t[3], st);
                }
            });
            return st;
        };
        return Array.from(meta(this.config.tests, new Set()));
    }
}
const getRunnables = (tests, payload = [new Set(), new Set()]) => {
    return tests.reduce((pt, cv, cndx, cry) => {
        if (cv[1] === "node") {
            pt[0].add(cv[0]);
        }
        else if (cv[1] === "web") {
            pt[1].add(cv[0]);
        }
        if (cv[3].length) {
            getRunnables(cv[3], payload);
        }
        return pt;
    }, payload);
};
