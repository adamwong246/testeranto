import Testeranto from "./lib/core.js";
import { defaultTestResourceRequirement, } from "./lib/index.js";
import { PM_Node } from "./PM/node.js";
let ipcfile;
export class NodeTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testInterface, () => {
            // no-op
        });
    }
    async receiveTestResourceConfig(partialTestResource) {
        const t = JSON.parse(partialTestResource);
        const pm = new PM_Node(t, ipcfile);
        return await this.testJobs[0].receiveTestResourceConfig(pm);
        // const { failed, artifacts, logPromise, features } =
        //   await this.testJobs[0].receiveTestResourceConfig(pm);
        // // pm.customclose();
        // return { features, failed };
    }
}
const testeranto = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    const t = new NodeTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
    process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Rejection at:", promise, "reason:", reason);
        // Optionally, terminate the process or perform cleanup
        // t.registerUncaughtPromise(reason, promise);
    });
    try {
        ipcfile = process.argv[3];
        const f = await t.receiveTestResourceConfig(process.argv[2]);
        console.error("goodbye node with failures", f.fails);
        process.exit(f.fails);
    }
    catch (e) {
        console.error("goodbye node with caught error", e);
        process.exit(-1);
        // fs.writeFileSync(`tests.json`, JSON.stringify(t.,
        //  null, 2));
        // process.send({ message: "Hello from child!" });
        // process.on("message", (message) => {
        //   const client = net.createConnection(message.path, () => {
        //     console.error("goodbye node error", e);
        //     process.exit(-1);
        //   });
        // });
    }
    return t;
};
export default testeranto;
