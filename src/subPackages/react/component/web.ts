import React from "react";

import Testeranto from "../../../Web.js";

import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";

type IInput = typeof React.Component;
type ISelection = React.CElement<any, any>
type Store = React.CElement<any, any>
type Subject = React.CElement<any, any>

export type IImpl<
  ISpec extends IBaseTest,
  IState
> = ITestImplementation<
  ISpec, object
>

export type ISpec<
  T extends IBaseTest
> = ITestSpecification<
  T
>;

export default <
  ITestShape extends IBaseTest,
>(
  testImplementations: ITestImplementation<
    ITestShape, object
  >,
  testSpecifications: ISpec<ITestShape>,
  testInput: IInput
) => {
  return Testeranto<
    ITestShape
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
