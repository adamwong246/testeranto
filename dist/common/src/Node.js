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
        return await this.testJobs[0].receiveTestResourceConfig(new node_js_1.PM_Node(JSON.parse(partialTestResource), ipcfile));
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
        process.exit((await t.receiveTestResourceConfig(process.argv[2])).fails);
    }
    catch (e) {
        console.error(e);
        console.error(e.stack);
        process.exit(-1);
    }
};
exports.default = testeranto;
