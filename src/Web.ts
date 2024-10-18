import type {
  IBaseTest,
  ITestImplementation,
  ITestSpecification,
} from "./Types";
import Testeranto from "./lib/core.js";
import {
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  ITestJob,
  defaultTestResourceRequirement,
} from "./lib/index.js";
import { ITestInterface } from "./lib/types";

const remote = require("@electron/remote");

class WebTesteranto<TestShape extends IBaseTest> extends Testeranto<TestShape> {
  constructor(
    input: TestShape["iinput"],
    testSpecification: ITestSpecification<TestShape>,
    testImplementation: ITestImplementation<TestShape, object>,
    testResourceRequirement: ITTestResourceRequest,
    testInterface: Partial<ITestInterface<TestShape>>
  ) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      (window as any).NodeWriter,
      testInterface
      // BrowserWindow
    );

    if (process.argv[2]) {
      const testResourceArg = decodeURIComponent(
        new URLSearchParams(location.search).get("requesting") || ""
      );

      try {
        const partialTestResource = JSON.parse(
          testResourceArg
        ) as ITTestResourceConfiguration;

        this.receiveTestResourceConfig(this.testJobs[0], partialTestResource);
      } catch (e) {
        console.error(e);
        // process.exit(-1);
      }
    } else {
      // no-op
    }

    const requesting = new URLSearchParams(location.search).get("requesting");
    if (requesting) {
      const testResourceArg = decodeURIComponent(requesting);

      try {
        const partialTestResource = JSON.parse(
          testResourceArg
        ) as ITTestResourceConfiguration;

        console.log("initial test resource", partialTestResource);
        this.receiveTestResourceConfig(this.testJobs[0], partialTestResource);
      } catch (e) {
        console.error(e);
        // process.exit(-1);
      }
    }
    // const t: ITestJob = this.testJobs[0];
  }

  async receiveTestResourceConfig(
    t: ITestJob,
    partialTestResource: ITTestResourceConfiguration
  ) {
    const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(
      partialTestResource,
      remote
    );

    Promise.all([...artifacts, logPromise]).then(async () => {
      var window = remote.getCurrentWindow();
      window.close();
    });
  }
}

export default async <ITestShape extends IBaseTest>(
  input: ITestShape["iinput"],
  testSpecification: ITestSpecification<ITestShape>,
  testImplementation: ITestImplementation<ITestShape, object>,
  testInterface: Partial<ITestInterface<ITestShape>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<Testeranto<ITestShape>> => {
  return new WebTesteranto<ITestShape>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface
  );
};
