import { defaultTestResourceRequirement, } from "./core.js";
import TesterantoLevelTwo from "./core.js";
import { NodeWriter } from "./NodeWriter.js";
console.log("node-core argv", process.argv);
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    const mrt = new TesterantoLevelTwo(input, testSpecification, testImplementation, testInterface, testResourceRequirement, testInterface.assertioner || (async (t) => t), testInterface.beforeEach || async function (subject, initialValues, testResource) {
        return subject;
    }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (a) => a), testInterface.andWhen, testInterface.actionHandler ||
        function (b) {
            return b;
        }, NodeWriter);
    const t = mrt[0];
    const testResourceArg = process.argv[2] || `{}`;
    try {
        const partialTestResource = JSON.parse(testResourceArg);
        if (testResourceRequirement.ports == 0) {
            await t.receiveTestResourceConfig(partialTestResource);
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
                    if (await t.receiveTestResourceConfig(secondTestResource)) {
                        /* @ts-ignore:next-line */
                        process.send({
                            type: "testeranto:adios",
                            data: {
                                testResourceConfiguration: t.test.testResourceConfiguration,
                                results: t.toObj(),
                            },
                        }, (err) => {
                            if (!err) {
                                console.log(`✅`);
                            }
                            else {
                                console.error(`❗️`, err);
                            }
                            // process.exit(0); // :-)
                        });
                    }
                });
            }
            else {
                console.log("Pass run-time test resources by STDIN", process.stdin);
                process.stdin.on("data", async (data) => {
                    console.log("data: ", data);
                    const resourcesFromStdin = JSON.parse(data.toString());
                    const secondTestResource = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(resourcesFromStdin))), JSON.parse(JSON.stringify(partialTestResource)));
                    await t.receiveTestResourceConfig(secondTestResource);
                    // process.exit(0); // :-)
                });
            }
        }
    }
    catch (e) {
        console.error(e);
        process.exit(-1);
    }
};