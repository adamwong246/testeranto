import React from "react";

import Testeranto from "../../../Node.js";

import {
  Ibdd_in,
  Ibdd_out,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types";

type IInput = typeof React.Component;
type ISelection = React.CElement<any, any>;
type IStore = React.CElement<any, any>;
type ISubject = React.CElement<any, any>;

export type IImpl<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = ITestImplementation<I, O>;

export type ISpec<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = ITestSpecification<I, O>;

export default <
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
>(
  testImplementations: ITestImplementation<I, O>,
  testSpecifications: ISpec<I, O>,
  testInput: IInput
) => {
  return Testeranto<I, O>(testInput, testSpecifications, testImplementations, {
    beforeEach: async (): Promise<IStore> => {
      return new Promise((resolve, rej) => {
        resolve(React.createElement(testInput, {}, []));
      });
    },
    andWhen: function (s: IStore, whenCB): Promise<ISelection> {
      return whenCB()(s);
    },
  });
};
