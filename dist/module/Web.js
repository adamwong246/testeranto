import Testeranto from "./lib/core";
import { defaultTestResourceRequirement } from "./lib";
console.log("(window as any).NodeWriter", window.NodeWriter);
class WebTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, window.NodeWriter, testInterface);
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
            // (window as any).exit(failed)
        });
    }
}
;
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
