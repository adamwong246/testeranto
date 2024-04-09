import React from "react";

import Testeranto from "../../../Node";
import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../Types";

type IWhenShape = any;
type IThenShape = any;

type IInput = typeof React.Component;
type ISelection = React.CElement<any, any>
type IStore = React.CElement<any, any>
type ISubject = React.CElement<any, any>

export type IImpl<
  ISpec extends ITTestShape,
  IState
> = ITestImplementation<
  IInput,
  IState,
  ISelection,
  IWhenShape,
  IThenShape,
  ISpec
>

export type ISpec<
  T extends ITTestShape
> = ITestSpecification<
  T,
  ISubject,
  IStore,
  ISelection,
  IThenShape
>;

export default <
  ITestShape extends ITTestShape,
  IState
>(
  testImplementations: ITestImplementation<
    IInput,
    IState,
    ISelection,
    IWhenShape,
    IThenShape,
    ITestShape
  >,
  testSpecifications: ISpec<ITestShape>,
  testInput: IInput
) => {
  return Testeranto<
    ITestShape,
    IInput,
    ISubject,
    IStore,
    ISelection,
    IThenShape,
    IWhenShape,
    IState
  >(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeEach: async (
      ): Promise<IStore> => {
        return new Promise((resolve, rej) => {
          resolve(React.createElement(testInput, {
          }, []));
        });
      },
      andWhen: function (s: IStore, actioner): Promise<ISelection> {
        return actioner()(s);
      },
    },
  )
};
