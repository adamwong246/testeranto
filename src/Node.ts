
import Testeranto from "./core.js";
import {
  defaultTestResourceRequirement,
  ITestJob,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
} from "./lib.js";
import { NodeWriter } from "./nodeWriter.js";
import {
  IBaseTest,
  ITestInterface,
  ITestSpecification
} from "./Types.js";

class NodeTesteranto<
  TestShape extends IBaseTest
> extends Testeranto<
  TestShape
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
    assertioner,
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
      andWhen,
      assertioner
    );

    const t: ITestJob = this.testJobs[0];
    const testResourceArg = process.argv[2] || `{}`;

    try {
      const partialTestResource = JSON.parse(
        testResourceArg
      ) as ITTestResourceConfiguration;

      this.receiveTestResourceConfig(t, partialTestResource);

    } catch (e) {
      console.error(e);
      process.exit(-1);
    }
  }

  async receiveTestResourceConfig(t: ITestJob, partialTestResource: ITTestResourceConfiguration) {
    const {
      failed,
      artifacts,
      logPromise
    } = await t.receiveTestResourceConfig(partialTestResource);

    Promise.all([...artifacts, logPromise]).then(async () => {
      process.exit(await failed ? 1 : 0);
    })
  }

};

export default async <
  ITestShape extends IBaseTest,
>(
  input: ITestShape['iinput'],
  testSpecification: ITestSpecification<
    ITestShape
  >,
  testImplementation,
  testInterface: ITestInterface<
    ITestShape
  >,
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
    testInterface.afterAll || ((store: ITestShape['istore']) => undefined),
    testInterface.butThen || (async (store: ITestShape['istore'], thenCb) => thenCb(store)),
    testInterface.andWhen || ((a) => a),
    testInterface.assertThis || (() => null),
  )

};
