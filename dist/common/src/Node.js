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
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testAdapter, () => {
            // no-op
        });
    }
    async receiveTestResourceConfig(partialTestResource) {
        // console.log("receiveTestResourceConfig", partialTestResource);
        const t = JSON.parse(partialTestResource);
        const pm = new node_js_1.PM_Node(t, ipcfile);
        return await this.testJobs[0].receiveTestResourceConfig(pm);
    }
}
exports.NodeTesteranto = NodeTesteranto;
const testeranto = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = index_js_1.defaultTestResourceRequirement) => {
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
exports.default = testeranto;
