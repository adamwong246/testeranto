import Testeranto from "./lib/core.js";
import { defaultTestResourceRequirement, } from "./lib/index.js";
import { PM_Pure } from "./PM/pure.js";
export class PureTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testAdapter, () => {
            // no-op
        });
    }
    async receiveTestResourceConfig(partialTestResource) {
        const t = JSON.parse(partialTestResource);
        const pm = new PM_Pure(t);
        try {
            return await this.testJobs[0].receiveTestResourceConfig(pm);
        }
        catch (e) {
            return -2;
        }
        // const { failed, artifacts, logPromise, features, fails } =
        //   await this.testJobs[0].receiveTestResourceConfig(pm);
        // // pm.customclose();
        // return { features, failed, fails };
    }
}
export default async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
    return new PureTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testAdapter);
    // try {
    //   return new PureTesteranto<I, O, M>(
    //     input,
    //     testSpecification,
    //     testImplementation,
    //     testResourceRequirement,
    //     testAdapter
    //   );
    // } catch (e) {
    //   return -1;
    // }
};
