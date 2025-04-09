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
  IT,
  ITestImplementation,
  ITestInterface,
  ITestSpecification,
  OT,
} from "./Types.js";

import { PM_Pure } from "./PM/pure.js";

export class PureTesteranto<I extends IT, O extends OT, M> extends Testeranto<
  I,
  O,
  M
> {
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

export default async <I extends IT, O extends OT, M>(
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
