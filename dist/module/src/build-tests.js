import process from "process";
import { ITProject } from "./Project";
if (!process.argv[2]) {
    console.log("You didn't pass a config file");
    process.exit(-1);
}
else {
    import(process.cwd() + "/" + process.argv[2]).then((module) => {
        new ITProject(module.default);
    });
}
