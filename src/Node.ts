import {
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  ITTestShape,
  ITestArtificer,
  ITestJob,
  ITestSpecification,
  defaultTestResourceRequirement,
} from "./core.js";
import TesterantoLevelTwo from "./core.js";
import { NodeWriter } from "./NodeWriter.js";

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
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
) => {

  const mrt = new TesterantoLevelTwo(
    input,
    testSpecification,
    testImplementation,
    testInterface,
    testResourceRequirement,
    testInterface.assertioner || (async (t) => t as any),
    testInterface.beforeEach || async function (subject: Subject, initialValues: any, testResource: any) {
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
    NodeWriter
  );

  const t: ITestJob = mrt.testJobs[0];
  const testResourceArg = process.argv[2] || `{}`;

  try {
    const partialTestResource = JSON.parse(
      testResourceArg
    ) as ITTestResourceConfiguration;

    if (testResourceRequirement.ports == 0) {

      const {
        failed,
        artifacts,
        logPromise
      } = await t.receiveTestResourceConfig(partialTestResource);
      Promise.all([...artifacts, logPromise]).then(async () => {
        process.exit(await failed ? 1 : 0);
      })

    } else {
      console.log("test configuration is incomplete", partialTestResource);
      if (process.send) {
        console.log(
          "requesting test resources via IPC ...",
          testResourceRequirement
        );
        /* @ts-ignore:next-line */
        process.send({
          type: "testeranto:hola",
          data: {
            requirement: {
              ...testResourceRequirement,
              name: partialTestResource.name
            }
          },
        });

        console.log("awaiting test resources via IPC...");
        process.on(
          "message",
          async function (packet: { data: { testResourceConfiguration } }) {
            console.log("message: ", packet);

            const resourcesFromPm2 = packet.data.testResourceConfiguration;
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

            /* @ts-ignore:next-line */
            process.send(
              {
                type: "testeranto:adios",
                data: {
                  testResourceConfiguration:
                    t.test.testResourceConfiguration,
                  results: t.toObj(),
                },
              },
              async (err) => {
                if (!err) {
                  Promise.all([...artifacts, logPromise]).then(async () => {
                    process.exit(await failed ? 1 : 0);
                  })
                } else {
                  console.error(err);
                  process.exit(1);
                }
              }
            );
          }
        );
      } else {
        console.log("Pass run-time test resources by STDIN", process.stdin);
        process.stdin.on("data", async (data) => {
          console.log("data: ", data);

          const resourcesFromStdin = JSON.parse(data.toString());
          const secondTestResource = {
            ...JSON.parse(JSON.stringify(resourcesFromStdin)),
            ...JSON.parse(JSON.stringify(partialTestResource)),
          } as ITTestResourceConfiguration;
          await t.receiveTestResourceConfig(secondTestResource);
        });
      }
    }

  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
};
