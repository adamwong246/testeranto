"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeTesteranto = void 0;
const core_js_1 = __importDefault(require("./lib/core.js"));
const index_js_1 = require("./lib/index.js");
const node_js_1 = require("./PM/node.js");
let ipcfile;
class NodeTesteranto extends core_js_1.default {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testInterface, () => {
            // no-op
        });
    }
    async receiveTestResourceConfig(partialTestResource) {
        const t = JSON.parse(partialTestResource);
        const pm = new node_js_1.PM_Node(t, ipcfile);
        return await this.testJobs[0].receiveTestResourceConfig(pm);
        // const { failed, artifacts, logPromise, features } =
        //   await this.testJobs[0].receiveTestResourceConfig(pm);
        // // pm.customclose();
        // return { features, failed };
    }
}
exports.NodeTesteranto = NodeTesteranto;
const testeranto = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = index_js_1.defaultTestResourceRequirement) => {
    const t = new NodeTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
    process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Rejection at:", promise, "reason:", reason);
        // Optionally, terminate the process or perform cleanup
        // t.registerUncaughtPromise(reason, promise);
    });
    try {
        ipcfile = process.argv[3];
        const f = await t.receiveTestResourceConfig(process.argv[2]);
        console.error("goodbye node error", f.fails);
        process.exit(f.fails);
    }
    catch (e) {
        console.error("goodbye node error", e);
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
exports.default = testeranto;
