"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const core_js_1 = __importDefault(require("./lib/core.js"));
const index_js_1 = require("./lib/index.js");
const NodeWriter_js_1 = require("./NodeWriter.js");
const Types_js_1 = require("./Types.js");
const readJson = async (port) => new Promise((resolve, reject) => {
    let json = "";
    const request = http_1.default.request({
        host: "127.0.0.1",
        path: "/json/version",
        port,
    }, (response) => {
        response.on("error", reject);
        response.on("data", (chunk) => {
            json += chunk.toString();
        });
        response.on("end", () => {
            resolve(JSON.parse(json));
        });
    });
    request.on("error", reject);
    request.end();
});
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
        const browser = await readJson("2999").then(async (json) => {
            const b = await puppeteer_core_1.default.connect({
                browserWSEndpoint: json.webSocketDebuggerUrl,
                defaultViewport: null,
            });
            console.log("connected!", b.isConnected());
            return b;
        });
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource, new Types_js_1.TBrowser(browser));
        Promise.all([...artifacts, logPromise]).then(async () => {
            // process.exit(await failed ? 1 : 0);
        });
    }
}
;
exports.default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = index_js_1.defaultTestResourceRequirement) => {
    return new NodeTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
