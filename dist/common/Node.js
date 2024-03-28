"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_js_1 = require("./core.js");
const core_js_2 = __importDefault(require("./core.js"));
const NodeWriter_js_1 = require("./NodeWriter.js");
exports.default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = core_js_1.defaultTestResourceRequirement) => {
    const mrt = new core_js_2.default(input, testSpecification, testImplementation, testInterface, testResourceRequirement, testInterface.assertioner || (async (t) => t), testInterface.beforeEach || async function (subject, initialValues, testResource) {
        return subject;
    }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (a) => a), testInterface.andWhen, testInterface.actionHandler ||
        function (b) {
            return b;
        }, NodeWriter_js_1.NodeWriter);
    const t = mrt.testJobs[0];
    const testResourceArg = process.argv[2] || `{}`;
    try {
        const partialTestResource = JSON.parse(testResourceArg);
        if (testResourceRequirement.ports == 0) {
            const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
            Promise.all([...artifacts, logPromise]).then(async () => {
                process.exit(await failed ? 1 : 0);
            });
        }
        else {
            console.log("test configuration is incomplete", partialTestResource);
            if (process.send) {
                console.log("requesting test resources via IPC ...", testResourceRequirement);
                /* @ts-ignore:next-line */
                process.send({
                    type: "testeranto:hola",
                    data: {
                        requirement: Object.assign(Object.assign({}, testResourceRequirement), { name: partialTestResource.name })
                    },
                });
                console.log("awaiting test resources via IPC...");
                process.on("message", async function (packet) {
                    console.log("message: ", packet);
                    const resourcesFromPm2 = packet.data.testResourceConfiguration;
                    const secondTestResource = Object.assign(Object.assign({ fs: "." }, JSON.parse(JSON.stringify(partialTestResource))), JSON.parse(JSON.stringify(resourcesFromPm2)));
                    console.log("secondTestResource", secondTestResource);
                    const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
                    /* @ts-ignore:next-line */
                    process.send({
                        type: "testeranto:adios",
                        data: {
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
                });
            }
            else {
                console.log("Pass run-time test resources by STDIN", process.stdin);
                process.stdin.on("data", async (data) => {
                    console.log("data: ", data);
                    const resourcesFromStdin = JSON.parse(data.toString());
                    const secondTestResource = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(resourcesFromStdin))), JSON.parse(JSON.stringify(partialTestResource)));
                    await t.receiveTestResourceConfig(secondTestResource);
                });
            }
        }
    }
    catch (e) {
        console.error(e);
        process.exit(-1);
    }
};
