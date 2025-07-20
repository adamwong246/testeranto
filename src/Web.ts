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

import Testeranto from "./lib/core.js";
import {
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  defaultTestResourceRequirement,
} from "./lib/index.js";

let errorCallback = (e: any) => {};
let unhandledrejectionCallback = (event: PromiseRejectionEvent) => {
  console.log("window.addEventListener unhandledrejection", event);
};

export class WebTesteranto<
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
      (cb) => {
        window.removeEventListener("error", errorCallback);

        errorCallback = (e) => {
          console.log("window.addEventListener error", e);
          cb(e);
          // throw e;
        };

        window.addEventListener("error", errorCallback);

        window.removeEventListener(
          "unhandledrejection",
          unhandledrejectionCallback
        );
        /////////////////////

        window.removeEventListener(
          "unhandledrejection",
          unhandledrejectionCallback
        );

        unhandledrejectionCallback = (event: PromiseRejectionEvent) => {
          console.log("window.addEventListener unhandledrejection", event);
          cb({ error: event.reason.message });
          // throw event;
        };

        window.addEventListener(
          "unhandledrejection",
          unhandledrejectionCallback
        );
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
): Promise<Testeranto<I, O, M>> => {
  return new WebTesteranto<I, O, M>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testAdapter
  );
};
