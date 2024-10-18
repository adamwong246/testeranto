import Testeranto from "./lib/core.js";
import { defaultTestResourceRequirement, } from "./lib/index.js";
// const remote = require("@electron/remote");
// const remote = require("@electron/remote/main");
class WebTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, window.NodeWriter, testInterface
        // BrowserWindow
        );
        const testResourceArg = decodeURIComponent(new URLSearchParams(location.search).get("requesting") || "");
        try {
            const partialTestResource = JSON.parse(testResourceArg);
            this.receiveTestResourceConfig(this.testJobs[0], partialTestResource);
        }
        catch (e) {
            console.error(e);
            // process.exit(-1);
        }
        const requesting = new URLSearchParams(location.search).get("requesting");
        if (requesting) {
            const testResourceArg = decodeURIComponent(requesting);
            try {
                const partialTestResource = JSON.parse(testResourceArg);
                console.log("initial test resource", partialTestResource);
                this.receiveTestResourceConfig(this.testJobs[0], partialTestResource);
            }
            catch (e) {
                console.error(e);
                // process.exit(-1);
            }
        }
        // const t: ITestJob = this.testJobs[0];
    }
    async receiveTestResourceConfig(t, partialTestResource) {
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource, {
            browser: window.remote,
            ipc: window.ipcRenderer,
        });
        Promise.all([...artifacts, logPromise]).then(async () => {
            // var window = remote.getCurrentWindow();
            // window.close();
        });
    }
}
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    return new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
