import Puppeteer from "./Puppeteer.js";
import process from "process";
if (!process.argv[2]) {
    console.log("You didn't pass a config file");
    process.exit(-1);
}
else {
    import(process.cwd() + "/" + process.argv[2]).then((module) => {
        Puppeteer(module.default);
    });
}
