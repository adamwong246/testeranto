// import { ITProject } from "./src/Project.js";

// import Project from "./testeranto.js";

import process from "process";
import { ITProject } from "./src/Project";
// import { ITProject } from "testeranto/src/Project";

// process.chdir(__dirname);

// import Puppeteer from "./src/Puppeteer.js";

console.log(process.argv);
const Project = await import(process.argv[2]);

export default new ITProject(Project as any);
