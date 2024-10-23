import puppeteer from "puppeteer-core";
import Testeranto from "./lib/core.js";
import { defaultTestResourceRequirement, } from "./lib/index.js";
import { NodeWriter } from "./NodeWriter.js";
import puppeteerConfiger from "./puppeteerConfiger.js";
class NodeTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, NodeWriter, testInterface);
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
        const browser = await puppeteerConfiger("2999").then(async (json) => {
            const b = await puppeteer.connect({
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
            process.exit((await failed) ? 1 : 0);
        });
    }
}
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    return new NodeTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
