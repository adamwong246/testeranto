import { Ibdd_in } from "../dist/types/src/CoreTypes.js";
import {
  Ibdd_in_any,
  Ibdd_out,
  ITestImplementation,
  ITestInterface,
  ITestSpecification,
} from "./CoreTypes.js";
import Testeranto from "./lib/core.js";
import {
  defaultTestResourceRequirement,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
} from "./lib/index.js";

import { PM_Pure } from "./PM/pure.js";

export class PureTesteranto<
  I extends Ibdd_in_any,
  O extends Ibdd_out,
  M
> extends Testeranto<I, O, M> {
  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O, M>,
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
    const pm = new PM_Pure(t);
    return await this.testJobs[0].receiveTestResourceConfig(pm);
    // const { failed, artifacts, logPromise, features, fails } =
    //   await this.testJobs[0].receiveTestResourceConfig(pm);
    // // pm.customclose();
    // return { features, failed, fails };
  }
}

export default async <I extends Ibdd_in_any, O extends Ibdd_out, M>(
  input: I["iinput"],
  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O, M>,
  testInterface: Partial<INodeTestInterface<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<Testeranto<I, O, M>> => {
  return new PureTesteranto<I, O, M>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface
  );
};
