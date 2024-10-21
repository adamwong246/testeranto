import { CElement } from "react";

import {
  IBaseTest,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types";

export type IWhenShape = any;
export type IThenShape = any;
export type InitialState = unknown;
export type IInput = () => JSX.Element;
export type ISelection = CElement<any, any>;
export type IStore = CElement<any, any>;
export type ISubject = CElement<any, any>;

export type ITestImpl<ITestShape extends IBaseTest> =
  ITestImplementation<ITestShape>;

export type ITestSpec<ITestShape extends IBaseTest> =
  ITestSpecification<ITestShape>;

export const testInterface = {
  beforeEach: async (x, ndx, testRsource, artificer): Promise<IStore> => {
    return new Promise((resolve, rej) => {
      resolve(x());
    });
  },
  andWhen: function (s: IStore, whenCB): Promise<ISelection> {
    return whenCB(s);
  },
};
