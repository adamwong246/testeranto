/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PM_Web } from "./PM/web";
import Testeranto from "./lib/core.js";
import { defaultTestResourceRequirement, } from "./lib/index.js";
// let errorCallback = (e: any) => {};
// let unhandledrejectionCallback = (event: PromiseRejectionEvent) => {
//   console.log(
//     "window.addEventListener unhandledrejection 1",
//     JSON.stringify(event)
//   );
// };
export class WebTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testAdapter, (cb) => {
            // window.removeEventListener("error", errorCallback);
            // errorCallback = (e) => {
            //   console.log("window.addEventListener error 2", JSON.stringify(e));
            //   cb(e);
            //   // throw e;
            // };
            // window.addEventListener("error", errorCallback);
            // window.removeEventListener(
            //   "unhandledrejection",
            //   unhandledrejectionCallback
            // );
            // /////////////////////
            // window.removeEventListener(
            //   "unhandledrejection",
            //   unhandledrejectionCallback
            // );
            // unhandledrejectionCallback = (event: PromiseRejectionEvent) => {
            //   console.log(
            //     "window.addEventListener unhandledrejection 3",
            //     JSON.stringify(event)
            //   );
            //   cb({ error: event.reason.message });
            //   // throw event;
            // };
            // window.addEventListener(
            //   "unhandledrejection",
            //   unhandledrejectionCallback
            // );
        });
    }
    async receiveTestResourceConfig(partialTestResource) {
        const t = partialTestResource; //JSON.parse(partialTestResource);
        const pm = new PM_Web(t);
        return await this.testJobs[0].receiveTestResourceConfig(pm);
    }
}
export default async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
    return new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testAdapter);
};
