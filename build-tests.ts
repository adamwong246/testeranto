import process from "process";
import { ITProject } from "./src/Project";

const Project = await import(process.argv[2]);

export default new ITProject(Project as any);
