"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PureTesteranto = void 0;
const index_js_1 = require("./lib/index.js");
const Tiposkripto_js_1 = __importDefault(require("./lib/Tiposkripto.js"));
const pure_js_1 = require("./PM/pure.js");
class PureTesteranto extends Tiposkripto_js_1.default {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testAdapter, () => {
            // no-op
        });
    }
    async receiveTestResourceConfig(partialTestResource) {
        const t = JSON.parse(partialTestResource);
        const pm = new pure_js_1.PM_Pure(t);
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
exports.PureTesteranto = PureTesteranto;
exports.default = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = index_js_1.defaultTestResourceRequirement) => {
    return new PureTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testAdapter);
};
