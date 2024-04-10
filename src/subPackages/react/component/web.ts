import React from "react";

import Testeranto from "../../../Web";
import { ITTestShape } from "../../../lib";
import { ITestImplementation, ITestSpecification } from "../../../Types";

type IWhenShape = any;
type IThenShape = any;

type IInput = typeof React.Component;  //Super<React.Element>;  //number;  //typeof React.Component;
// type IState  is the props
type ISelection = React.CElement<any, any>
type Store = React.CElement<any, any>
type Subject = React.CElement<any, any>

export type IImpl<
  ISpec extends ITTestShape,
  IState
> = ITestImplementation<
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
  Subject,
  Store,
  ISelection,
  IThenShape
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
    ITestShape
  >,
  testSpecifications: ISpec<ITestShape>,
  testInput: IInput
) => {
  return Testeranto<
    ITestShape,
    IInput,
    Subject,
    Store,
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
      ): Promise<Store> => {
        return new Promise((resolve, rej) => {
          resolve(React.createElement(testInput, {
          }, []));
        });
      },
      andWhen: function (s: Store, whenCB): Promise<ISelection> {
        return whenCB()(s);
      },
    },
  )
};
