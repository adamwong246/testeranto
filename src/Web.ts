import {
  IBaseTest,
  ITestInterface,
  ITestSpecification
} from "./Types";
import Testeranto from "./core";
import {
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  ITestJob,
  defaultTestResourceRequirement
} from "./lib";

let webSocket: WebSocket;
try {
  webSocket = new WebSocket("ws://localhost:8080");
} catch (e) {
  console.error(e)
}

class WebTesteranto<
  TestShape extends IBaseTest,
> extends Testeranto<
  TestShape
> {
  constructor(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    beforeAll,
    beforeEach,
    afterEach,
    afterAll,
    butThen,
    andWhen,
    assertThis,
  ) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      (window as any).NodeWriter,
      beforeAll,
      beforeEach,
      afterEach,
      afterAll,
      butThen,
      andWhen,
      assertThis,
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
  testSpecification: ITestSpecification<
    ITestShape
  >,
  testImplementation,
  testInterface: ITestInterface<
    ITestShape
  >,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
) => {
  new WebTesteranto(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface.beforeAll || (async (s) => s),
    testInterface.beforeEach || async function (subject: any, initialValues: any, testResource: any) { return subject as any; },
    testInterface.afterEach || (async (s) => s),
    testInterface.afterAll || ((store: ITestShape['istore']) => undefined),
    testInterface.butThen || (async (store: ITestShape['istore'], thenCb) => thenCb(store)),
    testInterface.andWhen || ((a) => a),
    testInterface.assertThis || (() => null),
  )

};
