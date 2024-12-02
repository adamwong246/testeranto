import Testeranto from "./lib/core.js";
import {
  defaultTestResourceRequirement,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
} from "./lib/index.js";

import type {
  IBaseTest,
  ITestImplementation,
  ITestSpecification,
} from "./Types.js";
import { ITestInterface, INodeTestInterface } from "./lib/types.js";

import { PM_Node } from "./PM/node.js";

class NodeTesteranto<
  TestShape extends IBaseTest
> extends Testeranto<TestShape> {
  constructor(
    input: TestShape["iinput"],
    testSpecification: ITestSpecification<TestShape>,
    testImplementation: ITestImplementation<TestShape>,
    testResourceRequirement: ITTestResourceRequest,
    testInterface: Partial<ITestInterface<TestShape>>
  ) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testInterface
    );
  }

  async receiveTestResourceConfig(
    // t: ITestJob,
    partialTestResource: string
  ) {
    console.log(
      "receiveTestResourceConfig!!",
      this.testJobs[0].receiveTestResourceConfig
    );

    const t: ITTestResourceConfiguration = JSON.parse(partialTestResource);
    const pm = new PM_Node(t);
    const { failed, artifacts, logPromise } =
      await this.testJobs[0].receiveTestResourceConfig(pm);

    console.log("test is done, awaiting test result write to fs");

    console.log(failed);
    console.log(artifacts);
    console.log(logPromise);

    Promise.all([...artifacts, logPromise]).then(async () => {
      // process.exit((await failed) ? 1 : 0);
    });
  }
}

export default async <ITestShape extends IBaseTest>(
  input: ITestShape["iinput"],
  testSpecification: ITestSpecification<ITestShape>,
  testImplementation: ITestImplementation<ITestShape>,
  testInterface: Partial<INodeTestInterface<ITestShape>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<Testeranto<ITestShape>> => {
  return new NodeTesteranto<ITestShape>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface
  );
};
