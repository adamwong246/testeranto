import {
  Ibdd_in_any,
  Ibdd_out,
  ITestImplementation,
  ITestAdapter,
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
    console.log(
      "[DEBUG] receiveTestResourceConfig called with:",
      partialTestResource
    );
    const t: ITTestResourceConfiguration = JSON.parse(partialTestResource);
    const pm = new PM_Pure(t);

    console.log("[DEBUG] Current test jobs:", this.testJobs?.length);

    if (!this.testJobs || this.testJobs.length === 0) {
      console.error(
        "[ERROR] No test jobs available - checking specs:",
        this.specs?.length
      );
      console.error("[ERROR] Test implementation:", this.testImplementation);
      return {
        failed: true,
        fails: 1,
        artifacts: [],
        logPromise: Promise.resolve(),
        features: [],
      };
    }

    try {
      console.log("[DEBUG] Executing test job with PM:", pm);
      const result = await this.testJobs[0].receiveTestResourceConfig(pm);
      console.log("[DEBUG] Test job completed with result:", result);
      return result;
    } catch (e) {
      console.error("[ERROR] Test job failed:", e);
      return {
        failed: true,
        fails: 1,
        artifacts: [],
        logPromise: Promise.resolve(),
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
): Promise<number | Testeranto<I, O, M>> => {
  return new PureTesteranto<I, O, M>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testAdapter
  );
};
