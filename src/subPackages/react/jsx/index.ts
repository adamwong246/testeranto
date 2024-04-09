import { CElement } from "react";

import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../Types";

export type IWhenShape = any;
export type IThenShape = any;
export type InitialState = unknown;
export type IInput = () => JSX.Element;
export type ISelection = CElement<any, any>
export type IStore = CElement<any, any>
export type ISubject = CElement<any, any>

export type ITestImpl<
  ITestShape extends ITTestShape
> = ITestImplementation<
  IInput,
  InitialState,
  ISelection,
  IWhenShape,
  IThenShape,
  ITestShape
>

export type ITestSpec<
  ITestShape extends ITTestShape
> = ITestSpecification<
  ITestShape,
  ISubject,
  IStore,
  ISelection,
  IThenShape
>

export const testInterface = (testInput) => {
  return {
    beforeEach: async (
      x,
      ndx,
      testRsource,
      artificer
    ): Promise<IStore> => {
      return new Promise((resolve, rej) => {
        resolve(testInput())
      });
    },
    andWhen: function (s: IStore, actioner): Promise<ISelection> {
      return actioner()(s);
    },
  }
}