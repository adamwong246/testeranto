import React from "react";

import Testeranto from "../Node.js";

import {
  Ibdd_in,
  Ibdd_out,
  IPartialNodeInterface,
  ITestImplementation,
  ITestSpecification,
} from "../Types";

type IInput = string;
type ISelection = any;
type IStore = any;

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
  testInput: IInput,
  testSpecifications: ISpec<I, O>,
  testImplementations: ITestImplementation<I, O>,
  testInterface?: IPartialNodeInterface<I>
) => {
  return Testeranto<I, O>(testInput, testSpecifications, testImplementations, {
    beforeAll: (x) => {
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
  });
};
