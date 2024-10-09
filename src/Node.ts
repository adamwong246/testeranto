
import Testeranto from "./core.js";
import {
  defaultTestResourceRequirement,
  ITestJob,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  ITTestShape
} from "./lib.js";
import { NodeWriter } from "./nodeWriter.js";
import { ITestInterface, ITestSpecification } from "./Types.js";

class NodeTesteranto<
  TestShape extends ITTestShape,
  IState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape,
  IThenShape,
  IInput,
  IGivenShape
> extends Testeranto<
  TestShape,
  IState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape,
  IThenShape,
  IInput,
  IGivenShape
> {
  constructor(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    beforeAll,
    beforeEach,
    afterEach,
    afterAll,
    butThen,
    andWhen,
  ) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      NodeWriter,
      beforeAll,
      beforeEach,
      afterEach,
      afterAll,
      butThen,
      andWhen
    );

    const t: ITestJob = this.testJobs[0];
    const testResourceArg = process.argv[2] || `{}`;

    try {
      const partialTestResource = JSON.parse(
        testResourceArg
      ) as ITTestResourceConfiguration;

      if (partialTestResource.scheduled) {
        console.log("test is scheduled", partialTestResource);

        console.log(
          "requesting test resources via IPC ...",
          this.testResourceRequirement
        );
        /* @ts-ignore:next-line */
        process.send({
          type: "testeranto:hola",
          data: {
            requirement: {
              ...this.testResourceRequirement,
              name: partialTestResource.name
            }
          },
        });

        console.log("awaiting test resources via IPC...");
        process.on(
          "message",
          async (packet: { data: { testResourceConfiguration } }) => {
            const resourcesFromPm2 = packet.data.testResourceConfiguration;
            const secondTestResource = {
              fs: ".",
              ...JSON.parse(JSON.stringify(partialTestResource)),
              ...JSON.parse(JSON.stringify(resourcesFromPm2)),
            } as ITTestResourceConfiguration;
            console.log("receiveTestResourceConfigScheduled", this)
            this.receiveTestResourceConfigScheduled(t, secondTestResource);

          }
        );
      } else {
        console.log("receiveTestResourceConfigUnscheduled", this.receiveTestResourceConfigUnscheduled)
        this.receiveTestResourceConfigUnscheduled(t, partialTestResource);
      }
    } catch (e) {
      console.error(e);
      process.exit(-1);
    }

  }


  async receiveTestResourceConfigUnscheduled(t: ITestJob, partialTestResource: ITTestResourceConfiguration) {
    const {
      failed,
      artifacts,
      logPromise
    } = await t.receiveTestResourceConfig(partialTestResource);

    Promise.all([...artifacts, logPromise]).then(async () => {
      process.exit(await failed ? 1 : 0);
    })
  }
  async receiveTestResourceConfigScheduled(t: ITestJob, partialTestResource: ITTestResourceConfiguration) {
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

};

export default async <
  TestShape extends ITTestShape,
  IInput,
  ISubject,
  IStore,
  ISelection,
  IWhenShape,
  IThenShape,
  IState,
  IGivenShape
>(
  input: IInput,
  testSpecification: ITestSpecification<
    TestShape,
    ISubject,
    IStore,
    ISelection,
    IThenShape,
    IGivenShape
  >,
  testImplementation,
  testInterface: ITestInterface<IStore, ISelection, ISubject, IThenShape, IInput>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
) => {
  new NodeTesteranto(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface.beforeAll || (async (s) => s),
    testInterface.beforeEach || async function (subject: any, initialValues: any, testResource: any) { return subject as any; },
    testInterface.afterEach || (async (s) => s),
    testInterface.afterAll || ((store: IStore) => undefined),
    testInterface.butThen || (async (a) => a as any),
    testInterface.andWhen,
  )

};
