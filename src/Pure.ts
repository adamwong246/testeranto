import {
  Ibdd_in_any,
  Ibdd_out,
  ITestImplementation,
  ITestAdapter,
  ITestSpecification,
} from "./CoreTypes.js";

import {
  defaultTestResourceRequirement,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
} from "./lib/index.js";
import Tiposkripto from "./lib/Tiposkripto.js";

import { PM_Pure } from "./PM/pure.js";

export class PureTesteranto<
  I extends Ibdd_in_any,
  O extends Ibdd_out,
  M
> extends Tiposkripto<I, O, M> {
  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O, M>,
    testResourceRequirement: ITTestResourceRequest,
    testAdapter: Partial<ITestAdapter<I>>
  ) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      () => {
        // no-op
      }
    );
  }

  async receiveTestResourceConfig(partialTestResource: string) {
    const t: ITTestResourceConfiguration = JSON.parse(partialTestResource);
    const pm = new PM_Pure(t);

    try {
      const result = this.testJobs[0].receiveTestResourceConfig(pm);
      return result;
    } catch (e) {
      console.error("[ERROR] Test job failed:", e);
      return {
        failed: true,
        fails: -1,
        artifacts: [],
        // logPromise: Promise.resolve(),
        features: [],
      };
    }
  }
}

export default async <I extends Ibdd_in_any, O extends Ibdd_out, M>(
  input: I["iinput"],
  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O, M>,
  testAdapter: Partial<ITestAdapter<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<PureTesteranto<I, O, M>> => {
  return new PureTesteranto<I, O, M>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testAdapter
  );
};
