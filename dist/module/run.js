import ansiC from "ansi-colors";
import readline from "readline";
import { PM_Main } from "./PM/main";
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
console.log(ansiC.inverse("Press 'x' to shutdown forcefully."));
process.stdin.on("keypress", (str, key) => {
    if (key.name === "x") {
        console.log(ansiC.inverse("Shutting down forcefully..."));
        process.exit(-1);
    }
});
let testName = process.argv[2];
const mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
    console.error("the 2nd argument should be 'dev' or 'once' ");
    process.exit(-1);
}
console.log("testeranto is running", testName, mode);
import(process.cwd() + "/" + "testeranto.config.ts").then(async (module) => {
    const bigConfig = module.default;
    const rawConfig = bigConfig.projects[testName];
    const config = Object.assign(Object.assign({}, rawConfig), { buildDir: process.cwd() + "/" + `testeranto/${testName}.json` });
    const pm = new PM_Main(config, testName, mode);
    pm.start();
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "q") {
            pm.stop();
        }
    });
});
