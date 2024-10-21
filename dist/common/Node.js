"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const core_js_1 = __importDefault(require("./lib/core.js"));
const index_js_1 = require("./lib/index.js");
const NodeWriter_js_1 = require("./NodeWriter.js");
const puppeteerConfiger_js_1 = __importDefault(require("./puppeteerConfiger.js"));
class NodeTesteranto extends core_js_1.default {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, NodeWriter_js_1.NodeWriter, testInterface);
        if (process.argv[2]) {
            const testResourceArg = process.argv[2];
            try {
                const partialTestResource = JSON.parse(testResourceArg);
                this.receiveTestResourceConfig(this.testJobs[0], partialTestResource);
            }
            catch (e) {
                console.error(e);
                // process.exit(-1);
            }
        }
        else {
            // no-op
        }
    }
    async receiveTestResourceConfig(t, partialTestResource) {
        const browser = await (0, puppeteerConfiger_js_1.default)("2999").then(async (json) => {
            const b = await puppeteer_core_1.default.connect({
                browserWSEndpoint: json.webSocketDebuggerUrl,
                defaultViewport: null,
            });
            console.log("connected!", b.isConnected());
            return b;
        });
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource, {
            browser,
            ipc: process.parentPort,
        });
        Promise.all([...artifacts, logPromise]).then(async () => {
            // process.exit((await failed) ? 1 : 0);
        });
    }
}
exports.default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = index_js_1.defaultTestResourceRequirement) => {
    return new NodeTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
