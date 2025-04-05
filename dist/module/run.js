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
import(process.cwd() + "/" + process.argv[2]).then(async (module) => {
    const rawConfig = module.default;
    const config = Object.assign(Object.assign({}, rawConfig), { buildDir: process.cwd() + "/" + rawConfig.outdir });
    const pm = new PM_Main(config);
    pm.start();
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "q") {
            pm.stop();
        }
    });
});
