import readline from "readline";
import fs from "fs";
import path from "path";
import { jsonc } from "jsonc";
import { PM_Main } from "./PM/main.js";
var mode = process.argv[2] === "-dev" ? "DEV" : "PROD";
const node2web = {};
const web2node = {};
const childProcesses = {};
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
console.log("\n Puppeteer is running. Press 'q' to quit\n");
process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
        process.exit();
    }
});
const main = async () => {
    const configs = jsonc.parse((await fs.readFileSync("./docs/testeranto.json")).toString());
    const pm = new PM_Main(configs);
    await pm.startPuppeteer({
        waitForInitialPage: false,
        executablePath: "/opt/homebrew/bin/chromium",
        headless: false,
        args: [
            "--allow-file-access-from-files",
            "--allow-running-insecure-content",
            "--auto-open-devtools-for-tabs",
            "--disable-dev-shm-usage",
            "--disable-extensions",
            "--disable-gpu",
            "--disable-setuid-sandbox",
            "--disable-site-isolation-trials",
            "--disable-web-security",
            "--disable-web-security",
            "--no-first-run",
            "--no-sandbox",
            "--no-startup-window",
            "--no-zygote",
            "--reduce-security-for-testing",
            "--remote-allow-origins=*",
            // "--remote-allow-origins=ws://localhost:3234",
            "--unsafely-treat-insecure-origin-as-secure=*",
            // "--disable-features=IsolateOrigins",
            // "--single-process",
            // "--unsafely-treat-insecure-origin-as-secure",
            // "--unsafely-treat-insecure-origin-as-secure=ws://192.168.0.101:3234",
            `--remote-debugging-port=3234`,
        ],
    }, ".");
    const destinationOfRuntime = (f, r) => {
        return path
            .normalize(`${configs.buildDir}/${r}/${f}`)
            .split(".")
            .slice(0, -1)
            .join(".");
    };
    configs.tests.forEach(([test, runtime, secondaryArtifacts]) => {
        if (runtime === "node") {
            pm.launchNode(test, destinationOfRuntime(test, "node"));
        }
        else if (runtime === "web") {
            pm.launchWeb(test, destinationOfRuntime(test, "web"));
        }
        else {
            console.error("runtime makes no sense", runtime);
        }
    });
    console.log("ready and watching for changes...", configs.buildDir);
    fs.watch(configs.buildDir, {
        recursive: true,
    }, (eventType, changedFile) => {
        if (changedFile) {
            configs.tests.forEach(([test, runtime, secondaryArtifacts]) => {
                if (eventType === "change" || eventType === "rename") {
                    if (changedFile ===
                        test
                            .replace("./", "node/")
                            .split(".")
                            .slice(0, -1)
                            .concat("mjs")
                            .join(".")) {
                        pm.launchNode(test, destinationOfRuntime(test, "node"));
                    }
                    if (changedFile ===
                        test
                            .replace("./", "web/")
                            .split(".")
                            .slice(0, -1)
                            .concat("mjs")
                            .join(".")) {
                        pm.launchWeb(test, destinationOfRuntime(test, "web"));
                    }
                }
            });
        }
    });
};
main();
