import { defaultTestResourceRequirement, } from "./core";
import TesterantoLevelTwo from "./core";
const webSocket = new WebSocket("ws://localhost:8080");
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    const mrt = new TesterantoLevelTwo(input, testSpecification, testImplementation, testInterface, testResourceRequirement, testInterface.assertioner || (async (t) => t), testInterface.beforeEach ||
        async function (subject, initialValues, testResource) {
            return subject;
        }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (a) => a), testInterface.andWhen, testInterface.actionHandler ||
        function (b) {
            return b;
        }, window.NodeWriter);
    const tl2 = mrt;
    const t = tl2.testJobs[0];
    const testResourceArg = decodeURIComponent(new URLSearchParams(location.search).get('requesting') || '');
    try {
        const partialTestResource = JSON.parse(testResourceArg);
        if (partialTestResource.fs && partialTestResource.ports) {
            // const failed = await t.receiveTestResourceConfig(partialTestResource);
            // (window as any).exit(failed)
            const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
            Promise.all([...artifacts, logPromise]).then(async () => {
                // process.exit(await failed ? 1 : 0);
                window.exit(failed);
            });
        }
        else {
            console.log("test configuration is incomplete", partialTestResource);
            console.log("requesting test resources via ws", testResourceRequirement);
            webSocket.addEventListener("open", (event) => {
                webSocket.addEventListener("message", (event) => {
                    console.log("Message from server ", event.data);
                });
                const r = JSON.stringify({
                    type: "testeranto:hola",
                    data: {
                        testResourceRequirement,
                    },
                });
                webSocket.send(r);
                console.log("awaiting test resources via websocket...", r);
                webSocket.onmessage = (async (msg) => {
                    console.log("message: ", msg);
                    const resourcesFromPm2 = msg.data.testResourceConfiguration;
                    const secondTestResource = Object.assign(Object.assign({ fs: "." }, JSON.parse(JSON.stringify(partialTestResource))), JSON.parse(JSON.stringify(resourcesFromPm2)));
                    console.log("secondTestResource", secondTestResource);
                    const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
                    Promise.all([...artifacts, logPromise]).then(async () => {
                        // process.exit(await failed ? 1 : 0);
                        window.exit(failed);
                    });
                    webSocket.send(JSON.stringify({
                        type: "testeranto:adios",
                        data: {
                            testResourceConfiguration: t.test.testResourceConfiguration,
                            results: t.toObj(),
                        },
                    }));
                    document.write("all done");
                    // app.exit(failed ? 1 : 0);
                    // process.exit(failed ? 1 : 0);
                });
            });
        }
    }
    catch (e) {
        console.error(e);
        // process.exit(-1);
    }
};
