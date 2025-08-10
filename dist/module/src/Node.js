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
        return await this.testJobs[0].receiveTestResourceConfig(new PM_Node(JSON.parse(partialTestResource), ipcfile));
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
        process.exit((await t.receiveTestResourceConfig(process.argv[2])).fails);
    }
    catch (e) {
        console.error(e);
        console.error(e.stack);
        process.exit(-1);
    }
};
export default testeranto;
