"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
const core_2 = __importDefault(require("./core"));
const webSocket = new WebSocket("ws://localhost:8080");
exports.default = async (input, testSpecification, testImplementation, testInterface, 
// nameKey: string,
testResourceRequirement = core_1.defaultTestResourceRequirement) => {
    const mrt = new core_2.default(input, testSpecification, testImplementation, testInterface, 
    // nameKey,
    testResourceRequirement, testInterface.assertioner || (async (t) => t), testInterface.beforeEach ||
        async function (subject, initialValues, testResource) {
            return subject;
        }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (a) => a), testInterface.andWhen, testInterface.actionHandler ||
        function (b) {
            return b;
        }, 
    // {
    //   createWriteStream: window.createWriteStream(),
    // }
    window.NodeWriter());
    const t = mrt[0];
    // const testResourceArg = `{"fs": ".", "ports": []}`;
    const testResourceArg = `{}`;
    try {
        console.log("core-puppeteer startup", testResourceArg);
        const partialTestResource = JSON.parse(testResourceArg);
        if (partialTestResource.fs && partialTestResource.ports) {
            await t.receiveTestResourceConfig(partialTestResource);
            // process.exit(0); // :-)
        }
        else {
            console.log("test configuration is incomplete", partialTestResource);
            console.log("requesting test resources via ws", testResourceRequirement);
            webSocket.addEventListener("open", (event) => {
                // console.log("Hello webSockets!");
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
                    if (await t.receiveTestResourceConfig(secondTestResource)) {
                        webSocket.send(JSON.stringify({
                            type: "testeranto:adios",
                            data: {
                                testResourceConfiguration: t.test.testResourceConfiguration,
                                results: t.toObj(),
                            },
                        }));
                        document.write("all done");
                    }
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
        // const webSocket = new WebSocket("ws://localhost:8080");
        // webSocket.addEventListener("open", (event) => {
        //   console.log("Hello webSockets!");
        //   webSocket.addEventListener("message", (event) => {
        //     console.log("Message from server ", event.data);
        //   });
        //   console.log("sending...");
        //   webSocket.send(JSON.stringify({
        //     type: "testeranto:hola",
        //     name,
        //     data: {
        //       testResourceRequirement,
        //     },
        //   }))
        // });
    }
    catch (e) {
        console.error(e);
        // process.exit(-1);
    }
};
