import {
  ITTestResourceConfiguration,
  ITTestResourceRequirement,
  ITTestShape,
  ITestArtificer,
  ITestJob,
  ITestSpecification,
  defaultTestResourceRequirement,
} from "./core";
import TesterantoLevelTwo from "./core";

console.log("hello core-electron");

const webSocket = new WebSocket("ws://localhost:8080");

const startup = async (
  testResourceArg: string,
  t: ITestJob,
  testResourceRequirement: ITTestResourceRequirement
) => {

  console.log("core-electron startup", testResourceArg);

  const partialTestResource = JSON.parse(
    testResourceArg
  ) as ITTestResourceConfiguration;

  if (partialTestResource.fs && partialTestResource.ports) {
    await t.receiveTestResourceConfig(partialTestResource);
    // process.exit(0); // :-)
  } else {
    console.log("test configuration is incomplete", partialTestResource);
    console.log(
      "requesting test resources via ws",
      testResourceRequirement
    );

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

          if (await t.receiveTestResourceConfig(secondTestResource)) {
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
          }
        }
      );

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

export default async <
  TestShape extends ITTestShape,
  Input,
  Subject extends Input,
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
  nameKey: string,
  testResourceRequirement: ITTestResourceRequirement = defaultTestResourceRequirement
) => {
  const mrt = new TesterantoLevelTwo(
    input,
    testSpecification,
    testImplementation,
    testInterface,
    nameKey,
    testResourceRequirement,
    testInterface.assertioner || (async (t) => t as any),
    testInterface.beforeEach ||
    async function (subject: Input, initialValues: any, testResource: any) {
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
    {
      ...(window as any).NodeWriter,
      startup,
    }
  );
  const t: ITestJob = mrt[0];
  const testResourceArg = decodeURIComponent(new URLSearchParams(location.search).get('requesting') || '');
  try {
    startup(testResourceArg, t, testResourceRequirement);
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
};
