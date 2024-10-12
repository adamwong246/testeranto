import Testeranto from "./core.js";
import { defaultTestResourceRequirement, } from "./lib.js";
import { NodeWriter } from "./nodeWriter.js";
class NodeTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertioner) {
        super(input, testSpecification, testImplementation, testResourceRequirement, NodeWriter, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertioner);
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
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    new NodeTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface.beforeAll || (async (s) => s), testInterface.beforeEach || async function (subject, initialValues, testResource) { return subject; }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (store, thenCb) => thenCb(store)), testInterface.andWhen || ((a) => a), testInterface.assertThis || (() => null));
};
