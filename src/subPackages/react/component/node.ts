import React from "react";

import Testeranto from "../../../Node";
import { ITTestShape } from "../../../lib";
import { ITestImplementation, ITestSpecification } from "../../../Types";

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
  IState,
  ISelection,
  IWhenShape,
  IThenShape,
  ISpec,
  any
>

export type ISpec<
  T extends ITTestShape
> = ITestSpecification<
  T,
  ISubject,
  IStore,
  ISelection,
  IThenShape,
  any
>;

export default <
  ITestShape extends ITTestShape,
  IState
>(
  testImplementations: ITestImplementation<
    IState,
    ISelection,
    IWhenShape,
    IThenShape,
    ITestShape,
    any
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
    IState,
    any
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
      andWhen: function (s: IStore, whenCB): Promise<ISelection> {
        return whenCB()(s);
      },
    },
  )
};
