import { PM_Web } from "./PM/web";
import Testeranto from "./lib/core.js";
import { defaultTestResourceRequirement, } from "./lib/index.js";
class WebTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
    }
    async receiveTestResourceConfig(partialTestResource) {
        const t = partialTestResource; //JSON.parse(partialTestResource);
        const pm = new PM_Web(t);
        const { failed, artifacts, logPromise, features } = await this.testJobs[0].receiveTestResourceConfig(pm);
        pm.customclose();
        return new Promise((res, rej) => {
            res(features);
        });
        // return features;
        // Promise.all([...artifacts, logPromise]).then(async () => {
        //   console.log("hello world");
        //   pm.customclose();
        //   // we can't close the window becuase we might be taking a screenshot
        //   // window.close();
        //   // console.log(
        //   //   "(window as any).browser",
        //   //   JSON.stringify(await (window as any).browser)
        //   // );
        //   // var currentWindow = (await (window as any).browser).getCurrentWindow();
        //   // window.close();
        //   // var customWindow = window.open("", "_blank", "");
        //   // customWindow.close();
        //   // this.puppetMaster.browser.page
        //   // window["customclose"]();
        //   // console.log("goodbye", window["customclose"]());
        // });
    }
}
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    return new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
