import Testeranto from "./lib/core.js";
import {
  defaultTestResourceRequirement,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
} from "./lib/index.js";
import type {
  Ibdd_in,
  Ibdd_out,
  INodeTestInterface,
  ITestImplementation,
  ITestInterface,
  ITestSpecification,
} from "./Types.js";
import { PM_Node } from "./PM/node.js";

export class NodeTesteranto<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> extends Testeranto<I, O> {
  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O>,
    testResourceRequirement: ITTestResourceRequest,
    testInterface: Partial<ITestInterface<I>>
  ) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testInterface,
      () => {
        // no-op
      }
    );
  }

  async receiveTestResourceConfig(partialTestResource: string) {
    const t: ITTestResourceConfiguration = JSON.parse(partialTestResource);
    const pm = new PM_Node(t);
    const { failed, artifacts, logPromise, features } =
      await this.testJobs[0].receiveTestResourceConfig(pm);
    // pm.customclose();
    return { features, failed };
  }
}

export default async <
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
>(
  input: I["iinput"],
  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O>,
  testInterface: Partial<INodeTestInterface<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<Testeranto<I, O>> => {
  return new NodeTesteranto<I, O>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface
  );
};
