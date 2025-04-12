import ansiC from "ansi-colors";
import fs from "fs";
import path from "path";
import readline from "readline";
import esbuild from "esbuild";
import esbuildNodeConfiger from "./esbuildConfigs/node.js";
import esbuildWebConfiger from "./esbuildConfigs/web.js";
import esbuildImportConfiger from "./esbuildConfigs/pure.js";
import webHtmlFrame from "./web.html.js";
import { getRunnables } from "./utils.js";
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
let testName = process.argv[2];
let mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
    console.error(`The 4th argument should be 'dev' or 'once', not '${mode}'.`);
    process.exit(-1);
}
console.log("testeranto is building", testName, mode);
import(process.cwd() + "/" + "testeranto.config.ts").then(async (module) => {
    const pckge = (await import(`${process.cwd()}/package.json`)).default;
    const bigConfig = module.default;
    const project = bigConfig.projects[testName];
    if (!project) {
        console.error("no project found for", testName, "in testeranto.config.ts");
        process.exit(-1);
    }
    const rawConfig = bigConfig.projects[testName];
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
    const config = Object.assign(Object.assign({}, rawConfig), { buildDir: process.cwd() + "/testeranto/bundles/" + testName });
    console.log(`Press 'q' to shutdown gracefully. Press 'x' to shutdown forcefully.`);
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "q") {
            console.log("Testeranto-Build is shutting down...");
            mode = "once";
            onDone();
        }
        else if (key.name === "x") {
            console.log("Testeranto-Build is shutting down forcefully...");
            process.exit(-1);
        }
        else {
            console.log(`Press 'q' to shutdown gracefully. Press 'x' to shutdown forcefully.`);
        }
    });
    let nodeDone = false;
    let webDone = false;
    let importDone = false;
    let status = "build";
    const { nodeEntryPoints, webEntryPoints, importEntryPoints } = getRunnables(config.tests, testName);
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
    const onDone = async () => {
        if (nodeDone && webDone && importDone) {
            status = "built";
        }
        if (nodeDone && webDone && importDone && mode === "once") {
            console.log(ansiC.inverse(`${testName} has been built. Goodbye.`));
            process.exit();
        }
    };
    if (!fs.existsSync(`testeranto/reports/${testName}`)) {
        fs.mkdirSync(`testeranto/reports/${testName}`);
    }
    fs.writeFileSync(`${process.cwd()}/testeranto/reports/${testName}/index.html`, `
    <!DOCTYPE html>
    <html lang="en">
  
    <head>
      <meta name="description" content="Webpage description goes here" />
      <meta charset="utf-8" />
      <title>${pckge.name} - testeranto</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="" />
  
      <link rel="stylesheet" href="../ReportClient.css" />
      <script type="module" src="../ReportClient.js"></script>
  
    </head>
  
    <body>
      <div id="root">
        react is loading
      </div>
    </body>
  
    </html>
        `);
    fs.writeFileSync(`testeranto/reports/${testName}/config.json`, JSON.stringify(config, null, 2));
    fs.writeFileSync(`${process.cwd()}/testeranto/index.html`, `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta name="description" content="Webpage description goes here" />
    <meta charset="utf-8" />
    <title>${pckge.name} - testeranto</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="author" content="" />

    <script type="application/json" id="bigConfig">
      ${JSON.stringify(Object.keys(bigConfig.projects))}
    </script>

    <link rel="stylesheet" href="Project.css" />
    <script type="module" src="Project.js"></script>

  </head>

  <body>
    <div id="root">
      react is loading
    </div>
  </body>

  </html>
      `);
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
        return fs.promises
            .mkdir(path.dirname(htmlFilePath), { recursive: true })
            .then((x) => fs.writeFileSync(htmlFilePath, webHtmlFrame(jsfilePath, htmlFilePath)));
    })));
    // glob(`${process.cwd()}/testeranto/bundles/${testName}/chunk-*.mjs`, {
    //   ignore: "node_modules/**",
    // }).then((chunks) => {
    //   chunks.forEach((chunk) => {
    //     fs.unlinkSync(chunk);
    //   });
    // });
    const x = [
        ["pure", Object.keys(importEntryPoints)],
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
            fs.writeFileSync(`${folder}/index.html`, `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <title>${testName} - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />

  <link rel="stylesheet" href="../../../../../TestReport.css" />
  <script src="../../../../../TestReport.js"></script>

</head>

<body>
  <div id="root"/>
</body>
            `);
        });
    });
    await Promise.all([
        ...[
            [esbuildImportConfiger, importEntryPoints, onImportDone],
            [esbuildNodeConfiger, nodeEntryPoints, onNodeDone],
            [esbuildWebConfiger, webEntryPoints, onWebDone],
        ].map(([configer, entryPoints, done]) => {
            esbuild
                .context(configer(config, Object.keys(entryPoints), testName))
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
});
