import { PM_Web } from "./PM/web";
import Testeranto from "./lib/core.js";
import { defaultTestResourceRequirement, } from "./lib/index.js";
let errorCallback = (e) => { };
let unhandledrejectionCallback = (event) => {
    console.log("window.addEventListener unhandledrejection", event);
    // cb({ error: event.reason.message });
    // throw event;
};
export class WebTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testInterface, (cb) => {
            window.removeEventListener("error", errorCallback);
            errorCallback = (e) => {
                console.log("window.addEventListener error", e);
                cb(e);
                // throw e;
            };
            window.addEventListener("error", errorCallback);
            window.removeEventListener("unhandledrejection", unhandledrejectionCallback);
            /////////////////////
            window.removeEventListener("unhandledrejection", unhandledrejectionCallback);
            unhandledrejectionCallback = (event) => {
                console.log("window.addEventListener unhandledrejection", event);
                cb({ error: event.reason.message });
                // throw event;
            };
            window.addEventListener("unhandledrejection", unhandledrejectionCallback);
        });
    }
    async receiveTestResourceConfig(partialTestResource) {
        const t = partialTestResource; //JSON.parse(partialTestResource);
        const pm = new PM_Web(t);
        return await this.testJobs[0].receiveTestResourceConfig(pm);
    }
}
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    return new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
