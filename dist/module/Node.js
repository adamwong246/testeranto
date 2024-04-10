import Testeranto from "./core.js";
import { defaultTestResourceRequirement } from "./lib.js";
import { NodeWriter } from "./nodeWriter.js";
const receiveTestResourceConfigUnscheduled = async (t, testresource) => {
    const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(testresource);
    Promise.all([...artifacts, logPromise]).then(async () => {
        process.exit(await failed ? 1 : 0);
    });
};
const receiveTestResourceConfigScheduled = async (t, testresource) => {
    const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(testresource);
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
};
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    const mrt = new Testeranto(input, testSpecification, testImplementation, testInterface, testResourceRequirement, NodeWriter, testInterface.beforeEach || async function (subject, initialValues, testResource) { return subject; }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (a) => a), testInterface.andWhen, testInterface.actionHandler || function (b) { return b; }, testInterface.assertioner || (async (t) => t));
    const tl2 = mrt;
    const t = tl2.testJobs[0];
    const testResourceArg = process.argv[2] || `{}`;
    try {
        const partialTestResource = JSON.parse(testResourceArg);
        if (partialTestResource.scheduled) {
            console.log("test is scheduled", partialTestResource);
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
                const resourcesFromPm2 = packet.data.testResourceConfiguration;
                const secondTestResource = Object.assign(Object.assign({ fs: "." }, JSON.parse(JSON.stringify(partialTestResource))), JSON.parse(JSON.stringify(resourcesFromPm2)));
                receiveTestResourceConfigScheduled(t, secondTestResource);
            });
        }
        else {
            receiveTestResourceConfigUnscheduled(t, partialTestResource);
        }
    }
    catch (e) {
        console.error(e);
        process.exit(-1);
    }
};
