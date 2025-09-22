/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ITestSpecification,
  ITestImplementation,
  ITestAdapter,
  Ibdd_in_any,
  Ibdd_out,
} from "./CoreTypes";
import { PM_Web } from "./PM/web";
import Tiposkripto from "./lib/Tiposkripto";
import {
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  defaultTestResourceRequirement,
} from "./lib/index.js";

export class WebTesteranto<
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
      (cb) => {
        // todo
      }
    );
  }

  async receiveTestResourceConfig(partialTestResource: any) {
    const t: ITTestResourceConfiguration = partialTestResource; //JSON.parse(partialTestResource);
    const pm = new PM_Web(t);
    return await this.testJobs[0].receiveTestResourceConfig(pm);
  }
}

export default async <I extends Ibdd_in_any, O extends Ibdd_out, M>(
  input: I["iinput"],
  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O, M>,
  testAdapter: Partial<ITestAdapter<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<WebTesteranto<I, O, M>> => {
  return new WebTesteranto<I, O, M>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testAdapter
  );
};
