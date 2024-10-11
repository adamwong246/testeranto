import Testeranto from "./core";
import { defaultTestResourceRequirement } from "./lib";
let webSocket;
try {
    webSocket = new WebSocket("ws://localhost:8080");
}
catch (e) {
    console.error(e);
}
class WebTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertThis) {
        super(input, testSpecification, testImplementation, testResourceRequirement, window.NodeWriter, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertThis);
        const t = this.testJobs[0];
        const testResourceArg = decodeURIComponent(new URLSearchParams(location.search).get('requesting') || '');
        try {
            const partialTestResource = JSON.parse(testResourceArg);
            console.log("initial test resource", partialTestResource);
            if (partialTestResource.scheduled) {
                console.log("test is scheduled");
                console.log("awaiting test resources via WS...");
                webSocket.addEventListener("open", (event) => {
                    webSocket.addEventListener("message", (event) => {
                        console.log("Message from server ", event.data);
                    });
                    const r = JSON.stringify({
                        type: "testeranto:hola",
                        data: {
                            requirement: Object.assign(Object.assign({}, testResourceRequirement), { name: partialTestResource.name })
                        },
                    });
                    webSocket.send(r);
                    console.log("awaiting test resources via websocket...", r);
                    webSocket.onmessage = (async (msg) => {
                        console.log("message: ", msg);
                        const resourcesFromWs = JSON.parse(msg.data);
                        console.log("secondary test resource", resourcesFromWs);
                        const secondTestResource = Object.assign(Object.assign({ fs: "." }, JSON.parse(JSON.stringify(partialTestResource))), JSON.parse(JSON.stringify(resourcesFromWs)));
                        console.log("final test resource", secondTestResource);
                        this.receiveTestResourceConfigScheduled(t, secondTestResource);
                    });
                });
            }
            else {
                this.receiveTestResourceConfigUnscheduled(t, partialTestResource);
            }
            // const partialTestResource = JSON.parse(
            //   testResourceArg
            // ) as ITTestResourceConfiguration;
            // if (partialTestResource.fs && partialTestResource.ports) {
            //   receiveTestResourceConfig(t, partialTestResource);
            // } else {
            //   console.log("test configuration is incomplete", partialTestResource);
            //   console.log(
            //     "requesting test resources via ws",
            //     testResourceRequirement
            //   );
            //   webSocket.addEventListener("open", (event) => {
            //     webSocket.addEventListener("message", (event) => {
            //       console.log("Message from server ", event.data);
            //     });
            //     const r = JSON.stringify({
            //       type: "testeranto:hola",
            //       data: {
            //         testResourceRequirement,
            //       },
            //     });
            //     webSocket.send(r);
            //     console.log("awaiting test resources via websocket...", r);
            //     webSocket.onmessage = (
            //       async (msg: MessageEvent<any>) => {
            //         console.log("message: ", msg);
            //         const resourcesFromPm2 = msg.data.testResourceConfiguration;
            //         const secondTestResource = {
            //           fs: ".",
            //           ...JSON.parse(JSON.stringify(partialTestResource)),
            //           ...JSON.parse(JSON.stringify(resourcesFromPm2)),
            //         } as ITTestResourceConfiguration;
            //         console.log("secondTestResource", secondTestResource);
            //         receiveTestResourceConfig(t, secondTestResource);
            //       }
            //     );
            //   });
            // }
        }
        catch (e) {
            console.error(e);
            // process.exit(-1);
        }
    }
    async receiveTestResourceConfigUnscheduled(t, partialTestResource) {
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
        Promise.all([...artifacts, logPromise]).then(async () => {
            // ipcRenderer.invoke('quit-app', failed);
            window.exit(failed);
        });
    }
    async receiveTestResourceConfigScheduled(t, partialTestResource) {
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
        webSocket.send(JSON.stringify({
            type: "testeranto:adios",
            data: {
                failed,
                testResourceConfiguration: t.test.testResourceConfiguration,
                results: t.toObj(),
            },
        }));
        Promise.all([...artifacts, logPromise]).then(async () => {
            // app.quit()
            // ipcRenderer.invoke('quit-app', failed);
            window.exit(failed);
        });
    }
}
;
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface.beforeAll || (async (s) => s), testInterface.beforeEach || async function (subject, initialValues, testResource) { return subject; }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (store, thenCb) => thenCb(store)), testInterface.andWhen || ((a) => a), testInterface.assertThis || (() => null));
};
