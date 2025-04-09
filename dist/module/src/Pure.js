import Testeranto from "./lib/core.js";
import { defaultTestResourceRequirement, } from "./lib/index.js";
import { PM_Pure } from "./PM/pure.js";
export class PureTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testInterface, () => {
            // no-op
        });
    }
    async receiveTestResourceConfig(partialTestResource) {
        const t = JSON.parse(partialTestResource);
        const pm = new PM_Pure(t);
        return await this.testJobs[0].receiveTestResourceConfig(pm);
        // const { failed, artifacts, logPromise, features, fails } =
        //   await this.testJobs[0].receiveTestResourceConfig(pm);
        // // pm.customclose();
        // return { features, failed, fails };
    }
}
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    return new PureTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
