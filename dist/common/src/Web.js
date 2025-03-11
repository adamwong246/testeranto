"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebTesteranto = void 0;
const web_1 = require("./PM/web");
const core_js_1 = __importDefault(require("./lib/core.js"));
const index_js_1 = require("./lib/index.js");
class WebTesteranto extends core_js_1.default {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
    }
    async receiveTestResourceConfig(partialTestResource) {
        const t = partialTestResource; //JSON.parse(partialTestResource);
        const pm = new web_1.PM_Web(t);
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
exports.WebTesteranto = WebTesteranto;
exports.default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = index_js_1.defaultTestResourceRequirement) => {
    return new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
