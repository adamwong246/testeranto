import {
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  ITTestShape,
  ITestArtificer,
  ITestJob,
  ITestSpecification,
  defaultTestResourceRequirement,
} from "./core";
import TesterantoLevelTwo from "./core";

const webSocket = new WebSocket("ws://localhost:8080");

export default async <
  TestShape extends ITTestShape,
  Input,
  Subject,
  Store,
  Selection,
  WhenShape,
  ThenShape,
  InitialStateShape
>(
  input: Input,
  testSpecification: ITestSpecification<TestShape>,
  testImplementation,
  testInterface: {
    actionHandler?: (b: (...any) => any) => any;
    andWhen: (
      store: Store,
      actioner,
      testResource: ITTestResourceConfiguration
    ) => Promise<Selection>;
    butThen?: (
      store: Store,
      callback,
      testResource: ITTestResourceConfiguration
    ) => Promise<Selection>;
    assertioner?: (t: ThenShape) => any;

    afterAll?: (store: Store, artificer: ITestArtificer) => any;
    afterEach?: (
      store: Store,
      key: string,
      artificer: ITestArtificer
    ) => Promise<unknown>;
    beforeAll?: (input: Input, artificer: ITestArtificer) => Promise<Subject>;
    beforeEach?: (
      subject: Subject,
      initialValues,
      testResource: ITTestResourceConfiguration,
      artificer: ITestArtificer
    ) => Promise<Store>;
  },
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
) => {

  const mrt = new TesterantoLevelTwo(
    input,
    testSpecification,
    testImplementation,
    testInterface,
    testResourceRequirement,
    testInterface.assertioner || (async (t) => t as any),
    testInterface.beforeEach ||
    async function (subject: any, initialValues: any, testResource: any) {
      return subject as any;
    },
    testInterface.afterEach || (async (s) => s),
    testInterface.afterAll || ((store: Store) => undefined),
    testInterface.butThen || (async (a) => a as any),
    testInterface.andWhen,
    testInterface.actionHandler ||
    function (b: (...any: any[]) => any) {
      return b;
    },
    (window as any).NodeWriter
  );

  const tl2: TesterantoLevelTwo<any, any, any, any, any, any, any, any> = mrt;
  const t: ITestJob = tl2.testJobs[0];
  const testResourceArg = decodeURIComponent(
    new URLSearchParams(location.search).get('requesting') || ''
  );

  try {
    const partialTestResource = JSON.parse(
      testResourceArg
    ) as ITTestResourceConfiguration;

    if (partialTestResource.fs && partialTestResource.ports) {
      // const failed = await t.receiveTestResourceConfig(partialTestResource);
      // (window as any).exit(failed)

      const {
        failed,
        artifacts,
        logPromise
      } = await t.receiveTestResourceConfig(partialTestResource);
      Promise.all([...artifacts, logPromise]).then(async () => {
        // process.exit(await failed ? 1 : 0);
        (window as any).exit(failed)
      })


    } else {
      console.log("test configuration is incomplete", partialTestResource);
      console.log(
        "requesting test resources via ws",
        testResourceRequirement
      );

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
        webSocket.onmessage = (
          async (msg: MessageEvent<any>) => {
            console.log("message: ", msg);

            const resourcesFromPm2 = msg.data.testResourceConfiguration;
            const secondTestResource = {
              fs: ".",
              ...JSON.parse(JSON.stringify(partialTestResource)),
              ...JSON.parse(JSON.stringify(resourcesFromPm2)),
            } as ITTestResourceConfiguration;

            console.log("secondTestResource", secondTestResource);

            const {
              failed,
              artifacts,
              logPromise
            } = await t.receiveTestResourceConfig(partialTestResource);
            Promise.all([...artifacts, logPromise]).then(async () => {
              // process.exit(await failed ? 1 : 0);
              (window as any).exit(failed)
            })

            webSocket.send(
              JSON.stringify({
                type: "testeranto:adios",
                data: {
                  testResourceConfiguration:
                    t.test.testResourceConfiguration,
                  results: t.toObj(),
                },
              })
            );

            document.write("all done")
            // app.exit(failed ? 1 : 0);
            // process.exit(failed ? 1 : 0);
          }
        );
      });
    }

  } catch (e) {
    console.error(e);
    // process.exit(-1);
  }
};
