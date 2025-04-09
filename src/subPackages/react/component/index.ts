import React from "react";

import { Ibdd_in, IPartialInterface } from "../../../Types";

export type I = Ibdd_in<
  typeof React.Component,
  React.CElement<any, any>,
  React.CElement<any, any>,
  React.CElement<any, any>,
  unknown,
  () => (s: React.CElement<any, any>) => any,
  unknown
>;

export const reactInterfacer = (
  testInput: I["iinput"]
): IPartialInterface<I> => {
  return {
    beforeEach: async () => {
      return new Promise((resolve, rej) => {
        resolve(React.createElement(testInput, {}, []));
      });
    },
    andWhen: function (s, whenCB) {
      return whenCB()(s);
    },
  };
};
