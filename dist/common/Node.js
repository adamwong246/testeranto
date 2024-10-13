"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_js_1 = __importDefault(require("./lib/core.js"));
const index_js_1 = require("./lib/index.js");
const NodeWriter_js_1 = require("./NodeWriter.js");
class NodeTesteranto extends core_js_1.default {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, NodeWriter_js_1.NodeWriter, testInterface);
        const t = this.testJobs[0];
        const testResourceArg = process.argv[2] || `{}`;
        try {
            const partialTestResource = JSON.parse(testResourceArg);
            this.receiveTestResourceConfig(t, partialTestResource);
        }
        catch (e) {
            console.error(e);
            process.exit(-1);
        }
    }
    async receiveTestResourceConfig(t, partialTestResource) {
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
        Promise.all([...artifacts, logPromise]).then(async () => {
            process.exit(await failed ? 1 : 0);
        });
    }
}
;
exports.default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = index_js_1.defaultTestResourceRequirement) => {
    new NodeTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
