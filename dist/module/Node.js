// const remote = require('@electron/remote')
import http from "http";
import Testeranto from "./lib/core.js";
import { defaultTestResourceRequirement, } from "./lib/index.js";
import { NodeWriter } from "./NodeWriter.js";
import { TBrowser,
// TPage
 } from "./Types.js";
import puppeteer from "puppeteer-core";
const readJson = async (port) => new Promise((resolve, reject) => {
    let json = "";
    const request = http.request({
        host: "127.0.0.1",
        path: "/json/version",
        port,
    }, (response) => {
        console.log("mark5");
        response.on("error", reject);
        response.on("data", (chunk) => {
            json += chunk.toString();
        });
        response.on("end", () => {
            console.log("end");
            resolve(JSON.parse(json));
            // resolve(json)
        });
    });
    // console.log("mark2", request);
    request.on("error", reject);
    request.end();
    // console.log("mark4");
});
const browser = await readJson("2999").then(async (json) => {
    // console.log("mark", json);
    // const browser = await puppeteer.launch({ headless: true });
    const b = await puppeteer.connect({
        browserWSEndpoint: json.webSocketDebuggerUrl,
        defaultViewport: null,
    });
    console.log("connected!", b.isConnected());
    return b;
});
// TBrowser.prototype = Object.create(puppeteer.Browser.prototype);
// TPage.prototype = Object.create(puppeteer.Page.prototype);
// puppeteer.Browser.prototype = TBrowser.prototype
// puppeteer.Page.prototype = TPage.prototype
// Set constructor back to Robot
// Robot.prototype.constructor = Robot;
// const tBrowser: TBrowser = Object.setPrototypeOf(browser, TBrowser.prototype);
// tBrowser.pages 
class NodeTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, NodeWriter, testInterface, new TBrowser(browser));
        const t = this.testJobs[0];
        const testResourceArg = process.argv[2] || `{}`;
        try {
            const partialTestResource = JSON.parse(testResourceArg);
            this.receiveTestResourceConfig(t, partialTestResource);
        }
        catch (e) {
            console.error(e);
            // process.exit(-1);
        }
    }
    async receiveTestResourceConfig(t, partialTestResource) {
        // var window = remote.getCurrentWindow();
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
        Promise.all([...artifacts, logPromise]).then(async () => {
            // process.exit(await failed ? 1 : 0);
        });
    }
}
;
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    return new NodeTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
// export default async <
//   ITestShape extends IBaseTest,
// >(
//   input: ITestShape['iinput'],
//   testSpecification: ITestSpecification<ITestShape>,
//   testImplementation: ITestImplementation<ITestShape, object>,
//   testInterface: Partial<ITestInterface<ITestShape>>,
//   testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
// ) => {
//   new NodeTesteranto<ITestShape>(
//     input,
//     testSpecification,
//     testImplementation,
//     testResourceRequirement,
//     testInterface,
//   )
// };
