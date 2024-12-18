import React from "react";

import Testeranto from "../Node.js";

import {
  IBaseTest,
  IPartialNodeInterface,
  ITestImplementation,
  ITestSpecification,
} from "../Types";

type IInput = string;
type ISelection = any;
type IStore = any;
type ISubject = any;

export type IImpl<ISpec extends IBaseTest> = ITestImplementation<ISpec>;

export type ISpec<T extends IBaseTest> = ITestSpecification<T>;

export default <ITestShape extends IBaseTest>(
  testInput: IInput,
  testSpecifications: ISpec<ITestShape>,
  testImplementations: ITestImplementation<ITestShape>,
  testInterface?: IPartialNodeInterface<ITestShape>
) => {
  return Testeranto<ITestShape>(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeAll(x) {
        // process.parentPort.postMessage(
        //   `/docs/web/src/ClassicalComponent/test.html`
        // );

        return x;
      },
      beforeEach: async (): Promise<IStore> => {
        return new Promise((resolve, rej) => {
          resolve(React.createElement(testInput, {}, []));
        });
      },
      andWhen: function (s: IStore, whenCB): Promise<ISelection> {
        return whenCB()(s);
      },

      ...testInterface,
    }
  );
};
