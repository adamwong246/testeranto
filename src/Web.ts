import { PM_Web } from "./PM/web";
import type {
  Ibdd_in,
  Ibdd_out,
  ITestImplementation,
  ITestInterface,
  ITestSpecification,
  IWebTestInterface,
} from "./Types";
import Testeranto from "./lib/core.js";
import {
  IFinalResults,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  defaultTestResourceRequirement,
} from "./lib/index.js";

let errorCallback = (e: any) => {};
let unhandledrejectionCallback = (event: PromiseRejectionEvent) => {
  console.log("window.addEventListener unhandledrejection", event);
  // cb({ error: event.reason.message });
  // throw event;
};

export class WebTesteranto<
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
    const { failed, artifacts, logPromise, features } =
      await this.testJobs[0].receiveTestResourceConfig(pm);
    return new Promise<IFinalResults>((res, rej) => {
      res({ features, failed });
    });
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
  testInterface: Partial<IWebTestInterface<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<Testeranto<I, O>> => {
  return new WebTesteranto<I, O>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface
  );
};
