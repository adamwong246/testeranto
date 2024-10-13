"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("./core"));
const lib_1 = require("./lib");
console.log("(window as any).NodeWriter", window.NodeWriter);
class WebTesteranto extends core_1.default {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertThis) {
        super(input, testSpecification, testImplementation, testResourceRequirement, window.NodeWriter, 
        // NodeWriter,
        // NodeWriterElectron,
        beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertThis);
        const t = this.testJobs[0];
        const testResourceArg = decodeURIComponent(new URLSearchParams(location.search).get('requesting') || '');
        try {
            const partialTestResource = JSON.parse(testResourceArg);
            console.log("initial test resource", partialTestResource);
            this.receiveTestResourceConfig(t, partialTestResource);
        }
        catch (e) {
            console.error(e);
            // process.exit(-1);
        }
    }
    async receiveTestResourceConfig(t, partialTestResource) {
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
        Promise.all([...artifacts, logPromise]).then(async () => {
            // ipcRenderer.invoke('quit-app', failed);
            // (window as any).exit(failed)
        });
    }
}
;
exports.default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = lib_1.defaultTestResourceRequirement) => {
    new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface.beforeAll || (async (s) => s), testInterface.beforeEach || async function (subject, initialValues, testResource) { return subject; }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (store, thenCb) => thenCb(store)), testInterface.andWhen || ((a) => a), testInterface.assertThis || (() => null));
};
