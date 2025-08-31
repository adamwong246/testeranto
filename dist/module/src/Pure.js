import { defaultTestResourceRequirement, } from "./lib/index.js";
import Tiposkripto from "./lib/Tiposkripto.js";
import { PM_Pure } from "./PM/pure.js";
export class PureTesteranto extends Tiposkripto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testAdapter, () => {
            // no-op
        });
    }
    async receiveTestResourceConfig(partialTestResource) {
        const t = JSON.parse(partialTestResource);
        const pm = new PM_Pure(t);
        // if (!this.testJobs || this.testJobs.length === 0) {
        //   console.error(
        //     "[ERROR] No test jobs available - checking specs:",
        //     this.specs?.length
        //   );
        //   console.error("[ERROR] Test implementation:", this.testImplementation);
        //   return {
        //     failed: true,
        //     fails: 1,
        //     artifacts: [],
        //     // logPromise: Promise.resolve(),
        //     features: [],
        //   };
        // }
        try {
            const result = this.testJobs[0].receiveTestResourceConfig(pm);
            return result;
        }
        catch (e) {
            console.error("[ERROR] Test job failed:", e);
            return {
                failed: true,
                fails: -1,
                artifacts: [],
                // logPromise: Promise.resolve(),
                features: [],
            };
        }
    }
}
export default async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
    return new PureTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testAdapter);
};
