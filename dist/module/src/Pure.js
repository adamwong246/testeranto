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
        var _a, _b;
        console.log("[DEBUG] receiveTestResourceConfig called with:", partialTestResource);
        const t = JSON.parse(partialTestResource);
        const pm = new PM_Pure(t);
        console.log("[DEBUG] Current test jobs:", (_a = this.testJobs) === null || _a === void 0 ? void 0 : _a.length);
        if (!this.testJobs || this.testJobs.length === 0) {
            console.error("[ERROR] No test jobs available - checking specs:", (_b = this.specs) === null || _b === void 0 ? void 0 : _b.length);
            console.error("[ERROR] Test implementation:", this.testImplementation);
            return {
                failed: true,
                fails: 1,
                artifacts: [],
                logPromise: Promise.resolve(),
                features: [],
            };
        }
        try {
            console.log("[DEBUG] Executing test job with PM:", pm);
            const result = await this.testJobs[0].receiveTestResourceConfig(pm);
            console.log("[DEBUG] Test job completed with result:", result);
            return result;
        }
        catch (e) {
            console.error("[ERROR] Test job failed:", e);
            return {
                failed: true,
                fails: 1,
                artifacts: [],
                logPromise: Promise.resolve(),
                features: [],
            };
        }
    }
}
export default async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
    return new PureTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testAdapter);
};
