import React, { ReactNode, createElement } from "react";

import { Ibdd_in } from "../../../Types";

type IInput = typeof React.Component;

export type ISelection = ReactNode;
export type IStore = ReactNode;
export type ISubject = ReactNode;

export type I = Ibdd_in<
  IInput,
  ISubject,
  IStore,
  ISelection,
  unknown,
  (s: IStore) => IStore,
  unknown
>;

export const testInterfacer: (testInput: any) => any = (testInput) => {
  return {
    beforeEach: async (): Promise<IStore> => {
      return new Promise((resolve, rej) => {
        resolve(createElement(testInput));
      });
    },
    andWhen: async function (s, whenCB) {
      return whenCB(s);
    },
    butThen: async function (s) {
      return s;
    },
    afterEach: async function () {
      return {};
    },
    afterAll: () => {
      return;
    },
  };
};
