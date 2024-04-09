
import Testeranto from "./core.js";
import {
  defaultTestResourceRequirement, ITestArtificer, ITestJob, ITTestResourceConfiguration, ITTestResourceRequest
} from "./lib.js";
import { NodeWriter } from "./nodeWriter.js";
import { ITestSpecification, ITTestShape } from "./Types.js";

const receiveTestResourceConfigUnscheduled = async (t, testresource) => {
  const {
    failed,
    artifacts,
    logPromise
  } = await t.receiveTestResourceConfig(testresource);

  Promise.all([...artifacts, logPromise]).then(async () => {
    process.exit(await failed ? 1 : 0);
  })
}

const receiveTestResourceConfigScheduled = async (t, testresource) => {
  const {
    failed,
    artifacts,
    logPromise
  } = await t.receiveTestResourceConfig(testresource);

  /* @ts-ignore:next-line */
  process.send(
    {
      type: "testeranto:adios",
      data: {
        failed,
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
    });
}

export default async <
  TestShape extends ITTestShape,
  IInput,
  ISubject,
  IStore,
  ISelection,
  IWhenShape,
  IThenShape,
  IState
>(
  input: IInput,
  testSpecification: ITestSpecification<
    TestShape,
    ISubject,
    IStore,
    ISelection,
    IThenShape
  >,
  testImplementation,
  testInterface: {
    actionHandler?: (b: (...any) => any) => any;
    andWhen: (
      store: IStore,
      actioner,
      testResource: ITTestResourceConfiguration
    ) => Promise<ISelection>;
    butThen?: (
      store: IStore,
      callback,
      testResource: ITTestResourceConfiguration
    ) => Promise<ISelection>;
    assertioner?: (t: IThenShape) => any;

    afterAll?: (store: IStore, artificer: ITestArtificer) => any;
    afterEach?: (
      store: IStore,
      key: string,
      artificer: ITestArtificer
    ) => Promise<unknown>;
    beforeAll?: (input: IInput, artificer: ITestArtificer) => Promise<ISubject>;
    beforeEach?: (
      subject: ISubject,
      initialValues,
      testResource: ITTestResourceConfiguration,
      artificer: ITestArtificer
    ) => Promise<IStore>;
  },
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
) => {

  const mrt = new Testeranto(
    input,
    testSpecification,
    testImplementation,
    testInterface,
    testResourceRequirement,
    testInterface.assertioner || (async (t) => t as any),
    testInterface.beforeEach || async function (subject: ISubject, initialValues: any, testResource: any) {
      return subject as any;
    },
    testInterface.afterEach || (async (s) => s),
    testInterface.afterAll || ((store: IStore) => undefined),
    testInterface.butThen || (async (a) => a as any),
    testInterface.andWhen,
    testInterface.actionHandler ||
    function (b: (...any: any[]) => any) {
      return b;
    },
    NodeWriter
  );

  const tl2: Testeranto<any, any, any, any, any, any, any, any> = mrt;
  const t: ITestJob = tl2.testJobs[0];
  const testResourceArg = process.argv[2] || `{}`;

  try {
    const partialTestResource = JSON.parse(
      testResourceArg
    ) as ITTestResourceConfiguration;

    if (partialTestResource.scheduled) {
      console.log("test is scheduled", partialTestResource);

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
          const resourcesFromPm2 = packet.data.testResourceConfiguration;
          const secondTestResource = {
            fs: ".",
            ...JSON.parse(JSON.stringify(partialTestResource)),
            ...JSON.parse(JSON.stringify(resourcesFromPm2)),
          } as ITTestResourceConfiguration;
          receiveTestResourceConfigScheduled(t, secondTestResource);

        }
      );
    } else {
      receiveTestResourceConfigUnscheduled(t, partialTestResource);
    }
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
};
