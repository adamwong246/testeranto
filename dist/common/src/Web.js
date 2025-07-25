"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebTesteranto = void 0;
const web_1 = require("./PM/web");
const core_js_1 = __importDefault(require("./lib/core.js"));
const index_js_1 = require("./lib/index.js");
let errorCallback = (e) => { };
let unhandledrejectionCallback = (event) => {
    console.log("window.addEventListener unhandledrejection 1", JSON.stringify(event));
};
class WebTesteranto extends core_js_1.default {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testAdapter, (cb) => {
            window.removeEventListener("error", errorCallback);
            errorCallback = (e) => {
                console.log("window.addEventListener error 2", JSON.stringify(e));
                cb(e);
                // throw e;
            };
            window.addEventListener("error", errorCallback);
            window.removeEventListener("unhandledrejection", unhandledrejectionCallback);
            /////////////////////
            window.removeEventListener("unhandledrejection", unhandledrejectionCallback);
            unhandledrejectionCallback = (event) => {
                console.log("window.addEventListener unhandledrejection 3", JSON.stringify(event));
                cb({ error: event.reason.message });
                // throw event;
            };
            window.addEventListener("unhandledrejection", unhandledrejectionCallback);
        });
    }
    async receiveTestResourceConfig(partialTestResource) {
        const t = partialTestResource; //JSON.parse(partialTestResource);
        const pm = new web_1.PM_Web(t);
        return await this.testJobs[0].receiveTestResourceConfig(pm);
    }
}
exports.WebTesteranto = WebTesteranto;
exports.default = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = index_js_1.defaultTestResourceRequirement) => {
    return new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testAdapter);
};
