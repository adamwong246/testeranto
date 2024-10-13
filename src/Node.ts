
import Testeranto from "./lib/core.js";
import {
  DefaultTestInterface,
  defaultTestResourceRequirement,
  ITestJob,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
} from "./lib/index.js";
import { NodeWriter } from "./NodeWriter.js";
import {
  IBaseTest,
  ITestImplementation,
  ITestInterface,
  ITestSpecification
} from "./Types.js";

class NodeTesteranto<
  TestShape extends IBaseTest
> extends Testeranto<
  TestShape
> {
  constructor(
    input: TestShape["iinput"],
    testSpecification: ITestSpecification<TestShape>,
    testImplementation: ITestImplementation<TestShape, object>,
    testResourceRequirement: ITTestResourceRequest,
    testInterface: Partial<ITestInterface<TestShape>>,
  ) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      NodeWriter,
      testInterface,
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
  testSpecification: ITestSpecification<ITestShape>,
  testImplementation: ITestImplementation<ITestShape, object>,
  testInterface: Partial<ITestInterface<ITestShape>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
) => {
  new NodeTesteranto<ITestShape>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface,
  )

};
