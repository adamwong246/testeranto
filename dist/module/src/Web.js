import { PM_Web } from "./PM/web";
import Testeranto from "./lib/core.js";
import { defaultTestResourceRequirement, } from "./lib/index.js";
export class WebTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testInterface, (cb) => {
            window.addEventListener("error", (e) => {
                console.log("window.addEventListener error", e);
                cb(e);
                // throw e;
            });
            window.addEventListener("unhandledrejection", (event) => {
                console.log("window.addEventListener unhandledrejection", event);
                cb({ error: event.reason.message });
                // throw event;
            });
        });
    }
    async receiveTestResourceConfig(partialTestResource) {
        const t = partialTestResource; //JSON.parse(partialTestResource);
        const pm = new PM_Web(t);
        const { failed, artifacts, logPromise, features } = await this.testJobs[0].receiveTestResourceConfig(pm);
        pm.customclose();
        return new Promise((res, rej) => {
            res(features);
        });
    }
}
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    return new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
