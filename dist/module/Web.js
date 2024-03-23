import { defaultTestResourceRequirement, } from "./core";
import TesterantoLevelTwo from "./core";
const webSocket = new WebSocket("ws://localhost:8080");
const startup = async (testResourceArg, t, testResourceRequirement) => {
    const partialTestResource = JSON.parse(testResourceArg);
    if (partialTestResource.fs && partialTestResource.ports) {
        const failed = await t.receiveTestResourceConfig(partialTestResource);
        window.exit(failed);
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
                const failed = await t.receiveTestResourceConfig(partialTestResource);
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
        // else {
        //   console.log("Pass run-time test resources by STDIN", process.stdin);
        //   process.stdin.on("data", async (data) => {
        //     console.log("data: ", data);
        //     const resourcesFromStdin = JSON.parse(data.toString());
        //     const secondTestResource = {
        //       ...JSON.parse(JSON.stringify(resourcesFromStdin)),
        //       ...JSON.parse(JSON.stringify(partialTestResource)),
        //     } as ITTestResourceConfiguration;
        //     await t.receiveTestResourceConfig(secondTestResource);
        //     // process.exit(0); // :-)
        //   });
        // }
    }
};
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    const mrt = new TesterantoLevelTwo(input, testSpecification, testImplementation, testInterface, testResourceRequirement, testInterface.assertioner || (async (t) => t), testInterface.beforeEach ||
        async function (subject, initialValues, testResource) {
            return subject;
        }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (a) => a), testInterface.andWhen, testInterface.actionHandler ||
        function (b) {
            return b;
        }, Object.assign(Object.assign({}, window.NodeWriter), { startup }));
    const t = mrt[0];
    const testResourceArg = decodeURIComponent(new URLSearchParams(location.search).get('requesting') || '');
    try {
        await startup(testResourceArg, t, testResourceRequirement);
        // process.exit(0);
    }
    catch (e) {
        console.error(e);
        process.exit(-1);
    }
};
