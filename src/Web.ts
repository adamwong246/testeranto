import { PM_Web } from "./PM/web";
import type {
  IBaseTest,
  ITestImplementation,
  ITestSpecification,
} from "./Types";
import Testeranto from "./lib/core.js";
import {
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  defaultTestResourceRequirement,
} from "./lib/index.js";
import { ITestInterface, IWebTestInterface } from "./lib/types";

class WebTesteranto<
  TestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> extends Testeranto<TestShape> {
  constructor(
    input: TestShape["iinput"],
    testSpecification: ITestSpecification<TestShape>,
    testImplementation: ITestImplementation<TestShape>,
    testResourceRequirement: ITTestResourceRequest,
    testInterface: Partial<ITestInterface<TestShape>>
  ) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testInterface
    );
  }

  async receiveTestResourceConfig(partialTestResource: any) {
    const t: ITTestResourceConfiguration = partialTestResource; //JSON.parse(partialTestResource);
    const pm = new PM_Web(t);
    const { failed, artifacts, logPromise, features } =
      await this.testJobs[0].receiveTestResourceConfig(pm);
    pm.customclose();
    return new Promise<string[]>((res, rej) => {
      res(features);
    });
    // return features;
    // Promise.all([...artifacts, logPromise]).then(async () => {
    //   console.log("hello world");
    //   pm.customclose();
    //   // we can't close the window becuase we might be taking a screenshot
    //   // window.close();
    //   // console.log(
    //   //   "(window as any).browser",
    //   //   JSON.stringify(await (window as any).browser)
    //   // );
    //   // var currentWindow = (await (window as any).browser).getCurrentWindow();
    //   // window.close();
    //   // var customWindow = window.open("", "_blank", "");
    //   // customWindow.close();
    //   // this.puppetMaster.browser.page
    //   // window["customclose"]();
    //   // console.log("goodbye", window["customclose"]());
    // });
  }
}

export default async <
  ITestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
>(
  input: ITestShape["iinput"],
  testSpecification: ITestSpecification<ITestShape>,
  testImplementation: ITestImplementation<ITestShape>,
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
