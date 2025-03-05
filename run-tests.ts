import process from "process";
process.chdir(__dirname);

import Puppeteer from "./src/Puppeteer.js";

console.log(process.argv);
const Project = await import(process.argv[2]);

export default Puppeteer(Project as any);
