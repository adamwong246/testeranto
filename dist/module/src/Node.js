import Testeranto from "./lib/core.js";
import { defaultTestResourceRequirement, } from "./lib/index.js";
import { PM_Node } from "./PM/node.js";
let ipcfile;
export class NodeTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testAdapter, () => {
            // no-op
        });
    }
    async receiveTestResourceConfig(partialTestResource) {
        console.log("receiveTestResourceConfig", partialTestResource);
        const t = JSON.parse(partialTestResource);
        const pm = new PM_Node(t, ipcfile);
        return await this.testJobs[0].receiveTestResourceConfig(pm);
    }
}
const testeranto = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
    try {
        const t = new NodeTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testAdapter);
        process.on("unhandledRejection", (reason, promise) => {
            console.error("Unhandled Rejection at:", promise, "reason:", reason);
            // Optionally, terminate the process or perform cleanup
            // t.registerUncaughtPromise(reason, promise);
        });
        ipcfile = process.argv[3];
        const f = await t.receiveTestResourceConfig(process.argv[2]);
        console.error("goodbye node with failures", f.fails);
        process.exit(f.fails);
    }
    catch (e) {
        console.error("goodbye node with caught error", e);
        process.exit(-1);
    }
};
export default testeranto;
