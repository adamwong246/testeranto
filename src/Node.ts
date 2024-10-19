import http from "http";
import puppeteer from "puppeteer-core";

import Testeranto from "./lib/core.js";
import {
  defaultTestResourceRequirement,
  ITestJob,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
} from "./lib/index.js";
import { NodeWriter } from "./NodeWriter.js";
import type {
  IBaseTest,
  ITestImplementation,
  ITestSpecification,
} from "./Types.js";
import { ITestInterface, INodeTestInterface } from "./lib/types.js";

import puppeteerConfiger from "./puppeteerConfiger";

class NodeTesteranto<
  TestShape extends IBaseTest
> extends Testeranto<TestShape> {
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
      NodeWriter,
      testInterface
    );

    if (process.argv[2]) {
      const testResourceArg = process.argv[2];

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
  }

  async receiveTestResourceConfig(
    t: ITestJob,
    partialTestResource: ITTestResourceConfiguration
  ) {
    const browser = await puppeteerConfiger("2999").then(async (json) => {
      const b = await puppeteer.connect({
        browserWSEndpoint: json.webSocketDebuggerUrl,
        defaultViewport: null,
      });
      console.log("connected!", b.isConnected());
      return b;
    });

    const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(
      partialTestResource,
      {
        browser,
        ipc: process.parentPort,
      }
    );

    Promise.all([...artifacts, logPromise]).then(async () => {
      // process.exit((await failed) ? 1 : 0);
    });
  }
}

export default async <ITestShape extends IBaseTest>(
  input: ITestShape["iinput"],
  testSpecification: ITestSpecification<ITestShape>,
  testImplementation: ITestImplementation<ITestShape, object>,
  testInterface: Partial<INodeTestInterface<ITestShape>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<Testeranto<ITestShape>> => {
  return new NodeTesteranto<ITestShape>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface
  );
};
