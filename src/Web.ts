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
import {
  INodeUtils,
  ITestInterface,
  IWebTestInterface,
  IWebUtils,
} from "./lib/types";

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
    );

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
  }

  async receiveTestResourceConfig(
    t: ITestJob<IWebUtils>,
    partialTestResource: ITTestResourceConfiguration
  ) {
    const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(
      partialTestResource,
      {
        browser: await (window as any).browser,
        ipc: (window as any).ipcRenderer,
      }
    );

    Promise.all([...artifacts, logPromise]).then(async () => {
      // var window = remote.getCurrentWindow();
      // window.close();
    });
  }
}

export default async <ITestShape extends IBaseTest>(
  input: ITestShape["iinput"],
  testSpecification: ITestSpecification<ITestShape>,
  testImplementation: ITestImplementation<ITestShape, object>,
  testInterface: Partial<IWebTestInterface<ITestShape>>,
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
