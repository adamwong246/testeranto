import Testeranto from "./core";
import { defaultTestResourceRequirement } from "./lib";
let webSocket;
try {
    webSocket = new WebSocket("ws://localhost:8080");
}
catch (e) {
    console.error(e);
}
class WebTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertThis) {
        super(input, testSpecification, testImplementation, testResourceRequirement, window.NodeWriter, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertThis);
        const t = this.testJobs[0];
        const testResourceArg = decodeURIComponent(new URLSearchParams(location.search).get('requesting') || '');
        try {
            const partialTestResource = JSON.parse(testResourceArg);
            console.log("initial test resource", partialTestResource);
            this.receiveTestResourceConfig(t, partialTestResource);
        }
        catch (e) {
            console.error(e);
            // process.exit(-1);
        }
    }
    async receiveTestResourceConfig(t, partialTestResource) {
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
        Promise.all([...artifacts, logPromise]).then(async () => {
            // ipcRenderer.invoke('quit-app', failed);
            window.exit(failed);
        });
    }
}
;
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface.beforeAll || (async (s) => s), testInterface.beforeEach || async function (subject, initialValues, testResource) { return subject; }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (store, thenCb) => thenCb(store)), testInterface.andWhen || ((a) => a), testInterface.assertThis || (() => null));
};
