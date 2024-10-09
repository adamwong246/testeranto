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
        console.log("markl801", assertioner);
        super(input, testSpecification, testImplementation, testResourceRequirement, nodeWriter_js_1.NodeWriter, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertioner);
        const t = this.testJobs[0];
        const testResourceArg = process.argv[2] || `{}`;
        try {
            const partialTestResource = JSON.parse(testResourceArg);
            if (partialTestResource.scheduled) {
                console.log("test is scheduled", partialTestResource);
                console.log("requesting test resources via IPC ...", this.testResourceRequirement);
                /* @ts-ignore:next-line */
                process.send({
                    type: "testeranto:hola",
                    data: {
                        requirement: Object.assign(Object.assign({}, this.testResourceRequirement), { name: partialTestResource.name })
                    },
                });
                console.log("awaiting test resources via IPC...");
                process.on("message", async (packet) => {
                    const resourcesFromPm2 = packet.data.testResourceConfiguration;
                    const secondTestResource = Object.assign(Object.assign({ fs: "." }, JSON.parse(JSON.stringify(partialTestResource))), JSON.parse(JSON.stringify(resourcesFromPm2)));
                    this.receiveTestResourceConfigScheduled(t, secondTestResource);
                });
            }
            else {
                console.log("receiveTestResourceConfigUnscheduled", this.receiveTestResourceConfigUnscheduled);
                this.receiveTestResourceConfigUnscheduled(t, partialTestResource);
            }
        }
        catch (e) {
            console.error(e);
            process.exit(-1);
        }
    }
    async receiveTestResourceConfigUnscheduled(t, partialTestResource) {
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
        Promise.all([...artifacts, logPromise]).then(async () => {
            process.exit(await failed ? 1 : 0);
        });
    }
    async receiveTestResourceConfigScheduled(t, partialTestResource) {
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
        /* @ts-ignore:next-line */
        process.send({
            type: "testeranto:adios",
            data: {
                failed,
                testResourceConfiguration: t.test.testResourceConfiguration,
                results: t.toObj(),
            },
        }, async (err) => {
            if (!err) {
                Promise.all([...artifacts, logPromise]).then(async () => {
                    process.exit(await failed ? 1 : 0);
                });
            }
            else {
                console.error(err);
                process.exit(1);
            }
        });
    }
}
;
exports.default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = lib_js_1.defaultTestResourceRequirement) => {
    new NodeTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface.beforeAll || (async (s) => s), testInterface.beforeEach || async function (subject, initialValues, testResource) { return subject; }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (a) => a), testInterface.andWhen, testInterface.assertioner || ((...x) => x));
};
