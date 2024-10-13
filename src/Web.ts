import {
  IBaseTest,
  ITestImplementation,
  ITestInterface,
  ITestSpecification
} from "./Types";
import Testeranto from "./lib/core";
import {
  DefaultTestInterface,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  ITTestResourceRequirement,
  ITestJob,
  defaultTestResourceRequirement
} from "./lib";
import { NodeWriter } from "./nodeWriter";
import { NodeWriterElectron } from "./nodeWriterElectron";

console.log("(window as any).NodeWriter", (window as any).NodeWriter);

class WebTesteranto<
  TestShape extends IBaseTest,
> extends Testeranto<
  TestShape
> {
  constructor(
    input: TestShape["iinput"],
    testSpecification: ITestSpecification<TestShape>,
    testImplementation: ITestImplementation<TestShape, object>,
    testResourceRequirement: ITTestResourceRequest,
    testInterface: Partial<ITestInterface<TestShape>>,
  ) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      (window as any).NodeWriter,
      testInterface,
    );

    const t: ITestJob = this.testJobs[0];
    const testResourceArg = decodeURIComponent(
      new URLSearchParams(location.search).get('requesting') || ''
    );

    try {
      const partialTestResource = JSON.parse(
        testResourceArg
      ) as ITTestResourceConfiguration;

      console.log("initial test resource", partialTestResource);
      this.receiveTestResourceConfig(t, partialTestResource);

    } catch (e) {
      console.error(e);
      // process.exit(-1);
    }
  }

  async receiveTestResourceConfig(t: ITestJob, partialTestResource: ITTestResourceConfiguration) {
    const {
      failed,
      artifacts,
      logPromise
    } = await t.receiveTestResourceConfig(partialTestResource);

    Promise.all([...artifacts, logPromise]).then(async () => {
      // ipcRenderer.invoke('quit-app', failed);
      // (window as any).exit(failed)
    })
  }

};

export default async <
  ITestShape extends IBaseTest,
>(
  input: ITestShape['iinput'],
  testSpecification: ITestSpecification<ITestShape>,
  testImplementation: ITestImplementation<ITestShape, object>,
  testInterface: Partial<ITestInterface<ITestShape>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
) => {
  new WebTesteranto<ITestShape>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface,
  )

};
