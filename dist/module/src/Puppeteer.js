import readline from "readline";
import fs from "fs";
import watch from "recursive-watch";
import { PM_Main } from "./PM/main.js";
import { destinationOfRuntime } from "./utils.js";
// var mode: "DEV" | "PROD" = process.argv[2] === "-dev" ? "DEV" : "PROD";
// const node2web: Record<string, string[]> = {};
// const web2node: Record<string, string[]> = {};
// const childProcesses: Record<string, "loaded" | "running" | "done"> = {};
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
// let shutDownMode = false;
export default async (partialConfig) => {
    const config = Object.assign(Object.assign({}, partialConfig), { buildDir: process.cwd() + "/" + partialConfig.outdir });
    fs.writeFileSync(`${config.outdir}/testeranto.json`, JSON.stringify(Object.assign(Object.assign({}, config), { buildDir: process.cwd() + "/" + config.outdir }), null, 2));
    const pm = new PM_Main(config);
    await pm.startPuppeteer({
        // timeout: 1,
        waitForInitialPage: false,
        executablePath: 
        // process.env.CHROMIUM_PATH || "/opt/homebrew/bin/chromium",
        "/opt/homebrew/bin/chromium",
        headless: false,
        dumpio: true,
        // timeout: 0,
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
            "--single-process",
            // "--unsafely-treat-insecure-origin-as-secure",
            // "--unsafely-treat-insecure-origin-as-secure=ws://192.168.0.101:3234",
            // "--disk-cache-dir=/dev/null",
            // "--disk-cache-size=1",
            // "--start-maximized",
        ],
    }, ".");
    console.log("\n Puppeteer is running. Press 'q' to shutdown softly. Press 'x' to hard.\n");
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "q") {
            pm.shutDown();
            // process.exit();
        }
        if (key.name === "x") {
            // pm.shutDown();
            process.exit(-1);
        }
    });
    config.tests.forEach(([test, runtime, tr, sidecars]) => {
        if (runtime === "node") {
            pm.launchNode(test, destinationOfRuntime(test, "node", config));
        }
        else if (runtime === "web") {
            pm.launchWeb(test, destinationOfRuntime(test, "web", config), sidecars);
        }
        else {
            console.error("runtime makes no sense", runtime);
        }
    });
    if (config.devMode) {
        console.log("ready and watching for changes...", config.buildDir);
        watch(config.buildDir, (eventType, changedFile) => {
            if (changedFile) {
                config.tests.forEach(([test, runtime, tr, sidecars]) => {
                    if (eventType === "change" || eventType === "rename") {
                        if (changedFile ===
                            test
                                .replace("./", "node/")
                                .split(".")
                                .slice(0, -1)
                                .concat("mjs")
                                .join(".")) {
                            // pm.launchNode(test, destinationOfRuntime(test, "node", config));
                        }
                        if (changedFile ===
                            test
                                .replace("./", "web/")
                                .split(".")
                                .slice(0, -1)
                                .concat("mjs")
                                .join(".")) {
                            pm.launchWeb(test, destinationOfRuntime(test, "web", config), sidecars);
                        }
                    }
                });
            }
        });
    }
    else {
        pm.shutDown();
    }
    // pm.browser.close();
    // does not work on linux
    // fs.watch(
    //   config.buildDir,
    //   {
    //     recursive: true,
    //   },
    //   (eventType, changedFile) => {
    //     if (changedFile) {
    //       config.tests.forEach(([test, runtime, tr, sidecars]) => {
    //         if (eventType === "change" || eventType === "rename") {
    //           if (
    //             changedFile ===
    //             test
    //               .replace("./", "node/")
    //               .split(".")
    //               .slice(0, -1)
    //               .concat("mjs")
    //               .join(".")
    //           ) {
    //             pm.launchNode(test, destinationOfRuntime(test, "node", config));
    //           }
    //           if (
    //             changedFile ===
    //             test
    //               .replace("./", "web/")
    //               .split(".")
    //               .slice(0, -1)
    //               .concat("mjs")
    //               .join(".")
    //           ) {
    //             pm.launchWeb(
    //               test,
    //               destinationOfRuntime(test, "web", config),
    //               sidecars
    //             );
    //           }
    //         }
    //       });
    //     }
    //   }
    // );
};
