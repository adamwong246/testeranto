import { ITestInterface, ITestSpecification } from "./Types";
import Testeranto from "./core";
import {
  ITTestResourceConfiguration, ITTestResourceRequest, ITTestShape, ITestArtificer, ITestJob, defaultTestResourceRequirement
} from "./lib";

let webSocket: WebSocket;
try {
  webSocket = new WebSocket("ws://localhost:8080");
} catch (e) {
  console.error(e)
}

const receiveTestResourceConfigUnscheduled = async (t, testresource) => {
  const {
    failed,
    artifacts,
    logPromise
  } = await t.receiveTestResourceConfig(testresource);

  Promise.all([...artifacts, logPromise]).then(async () => {
    // ipcRenderer.invoke('quit-app', failed);
    (window as any).exit(failed)
  })
}

const receiveTestResourceConfigScheduled = async (t, testresource) => {
  const {
    failed,
    artifacts,
    logPromise
  } = await t.receiveTestResourceConfig(testresource);

  webSocket.send(
    JSON.stringify({
      type: "testeranto:adios",
      data: {
        failed,
        testResourceConfiguration:
          t.test.testResourceConfiguration,
        results: t.toObj(),
      },
    })
  );

  Promise.all([...artifacts, logPromise]).then(async () => {
    // app.quit()
    // ipcRenderer.invoke('quit-app', failed);
    (window as any).exit(failed)
  })
}

export default async <
  TestShape extends ITTestShape,
  IInput,
  ISubject,
  IStore,
  ISelection,
  WhenShape,
  IThenShape,
  IState
>(
  input: IInput,
  testSpecification: ITestSpecification<
    TestShape,
    ISubject,
    IStore,
    ISelection,
    IThenShape,
    any
  >,
  testImplementation,
  testInterface: ITestInterface<IStore, ISelection, ISubject, IThenShape, IInput>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
) => {
  const mrt = new Testeranto(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    (window as any).NodeWriter,
    testInterface.beforeAll || (async (s) => s),
    testInterface.beforeEach || async function (subject: any, initialValues: any, testResource: any) { return subject as any; },
    testInterface.afterEach || (async (s) => s),
    testInterface.afterAll || ((store: IStore) => undefined),
    testInterface.butThen || (async (a) => a as any),
    testInterface.andWhen,
  );

  const tl2: Testeranto<any, any, any, any, any, any, any, any, any> = mrt;
  const t: ITestJob = tl2.testJobs[0];
  const testResourceArg = decodeURIComponent(
    new URLSearchParams(location.search).get('requesting') || ''
  );

  try {
    const partialTestResource = JSON.parse(
      testResourceArg
    ) as ITTestResourceConfiguration;

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
            requirement: {
              ...testResourceRequirement,
              name: partialTestResource.name
            }
          },
        });

        webSocket.send(r);

        console.log("awaiting test resources via websocket...", r);
        webSocket.onmessage = (
          async (msg: MessageEvent<any>) => {
            console.log("message: ", msg);

            const resourcesFromWs = JSON.parse(msg.data);
            console.log("secondary test resource", resourcesFromWs);

            const secondTestResource = {
              fs: ".",
              ...JSON.parse(JSON.stringify(partialTestResource)),
              ...JSON.parse(JSON.stringify(resourcesFromWs)),
            } as ITTestResourceConfiguration;

            console.log("final test resource", secondTestResource);
            receiveTestResourceConfigScheduled(t, secondTestResource);
          }
        );
      });
    } else {
      receiveTestResourceConfigUnscheduled(t, partialTestResource);
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

  } catch (e) {
    console.error(e);
    // process.exit(-1);
  }
};
