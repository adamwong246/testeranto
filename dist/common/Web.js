"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_js_1 = __importDefault(require("./lib/core.js"));
const index_js_1 = require("./lib/index.js");
// const remote = require("@electron/remote");
// import remote from "@electron/remote";
// const electron = require("electron");
// const remote =
//   process.type === "browser" ? electron : require("@electron/remote");
class WebTesteranto extends core_js_1.default {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, window.NodeWriter, testInterface);
        const testResourceArg = decodeURIComponent(new URLSearchParams(location.search).get("requesting") || "");
        try {
            const partialTestResource = JSON.parse(testResourceArg);
            this.receiveTestResourceConfig(this.testJobs[0], partialTestResource);
        }
        catch (e) {
            console.error(e);
            // process.exit(-1);
        }
        const requesting = new URLSearchParams(location.search).get("requesting");
        if (requesting) {
            const testResourceArg = decodeURIComponent(requesting);
            try {
                const partialTestResource = JSON.parse(testResourceArg);
                console.log("initial test resource", partialTestResource);
                this.receiveTestResourceConfig(this.testJobs[0], partialTestResource);
            }
            catch (e) {
                console.error(e);
                // process.exit(-1);
            }
        }
    }
    async receiveTestResourceConfig(t, partialTestResource) {
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource, {
            browser: await window.browser,
            ipc: window.ipcRenderer,
        });
        console.log("test is done, awaiting test result write to fs");
        Promise.all([...artifacts, logPromise]).then(async () => {
            // we can't close the window becuase we might be taking a screenshot
            // window.close();
            // console.log(
            //   "(window as any).browser",
            //   JSON.stringify(await (window as any).browser)
            // );
            // var currentWindow = (await (window as any).browser).getCurrentWindow();
            // currentWindow.close();
        });
    }
}
exports.default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = index_js_1.defaultTestResourceRequirement) => {
    return new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
