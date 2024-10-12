"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_js_1 = __importDefault(require("./core.js"));
const lib_js_1 = require("./lib.js");
const nodeWriter_js_1 = require("./nodeWriter.js");
class NodeTesteranto extends core_js_1.default {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertioner) {
        super(input, testSpecification, testImplementation, testResourceRequirement, nodeWriter_js_1.NodeWriter, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertioner);
        const t = this.testJobs[0];
        const testResourceArg = process.argv[2] || `{}`;
        try {
            const partialTestResource = JSON.parse(testResourceArg);
            this.receiveTestResourceConfig(t, partialTestResource);
        }
        catch (e) {
            console.error(e);
            process.exit(-1);
        }
    }
    async receiveTestResourceConfig(t, partialTestResource) {
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
        Promise.all([...artifacts, logPromise]).then(async () => {
            process.exit(await failed ? 1 : 0);
        });
    }
}
;
exports.default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = lib_js_1.defaultTestResourceRequirement) => {
    new NodeTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface.beforeAll || (async (s) => s), testInterface.beforeEach || async function (subject, initialValues, testResource) { return subject; }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (store, thenCb) => thenCb(store)), testInterface.andWhen || ((a) => a), testInterface.assertThis || (() => null));
};
