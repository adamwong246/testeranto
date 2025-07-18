"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PureTesteranto = void 0;
const core_js_1 = __importDefault(require("./lib/core.js"));
const index_js_1 = require("./lib/index.js");
const pure_js_1 = require("./PM/pure.js");
class PureTesteranto extends core_js_1.default {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testInterface, () => {
            // no-op
        });
    }
    async receiveTestResourceConfig(partialTestResource) {
        const t = JSON.parse(partialTestResource);
        const pm = new pure_js_1.PM_Pure(t);
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
exports.PureTesteranto = PureTesteranto;
exports.default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = index_js_1.defaultTestResourceRequirement) => {
    return new PureTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
    // try {
    //   return new PureTesteranto<I, O, M>(
    //     input,
    //     testSpecification,
    //     testImplementation,
    //     testResourceRequirement,
    //     testInterface
    //   );
    // } catch (e) {
    //   return -1;
    // }
};
