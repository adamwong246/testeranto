import React from "react";

// const { BrowserWindow, app } = require("electron");

import Testeranto from "../Node";

import { IBaseTest, IPartialInterface, ITestImplementation, ITestSpecification } from "../Types";

type IInput = string;
type ISelection = any;
type IStore = any
type ISubject = any

export type IImpl<ISpec extends IBaseTest> = ITestImplementation<ISpec, object>

export type ISpec<T extends IBaseTest> = ITestSpecification<T>;

export default <ITestShape extends IBaseTest>(
  testInput: IInput,
  testSpecifications: ISpec<ITestShape>,
  testImplementations: ITestImplementation<ITestShape, object>,
  testInterface?: IPartialInterface<ITestShape>
) => {
  return Testeranto<ITestShape>(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeAll(x) {
        process.parentPort.postMessage(`/dist/web/src/ClassicalComponent/test.html`)

        return x;
      },
      beforeEach: async (
      ): Promise<IStore> => {
        return new Promise((resolve, rej) => {
          resolve(React.createElement(testInput, {
          }, []));
        });
      },
      andWhen: function (s: IStore, whenCB): Promise<ISelection> {
        return whenCB()(s);
      },

      ...testInterface
    },
  )
};
