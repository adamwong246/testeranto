import Testeranto from "./lib/core.js";
import { defaultTestResourceRequirement, } from "./lib/index.js";
import { PM_Node } from "./PM/node.js";
class NodeTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
    }
    async receiveTestResourceConfig(
    // t: ITestJob,
    partialTestResource) {
        console.log("receiveTestResourceConfig!!", this.testJobs[0].receiveTestResourceConfig);
        const t = JSON.parse(partialTestResource);
        const pm = new PM_Node(t);
        const { failed, artifacts, logPromise } = await this.testJobs[0].receiveTestResourceConfig(pm);
        console.log("test is done, awaiting test result write to fs");
        Promise.all([...artifacts, logPromise]).then(async () => {
            // process.exit((await failed) ? 1 : 0);
        });
    }
}
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    return new NodeTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
