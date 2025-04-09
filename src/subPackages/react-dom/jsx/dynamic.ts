import { createElement } from "react";

import { Ibdd_in, IPartialInterface } from "../../../Types";

import { IInput, ISelection, IStore, IWhenShape, IThenShape } from ".";

export type ISubject = HTMLElement;

export type I = Ibdd_in<
  IInput,
  ISubject,
  ISelection,
  IStore,
  unknown,
  IWhenShape,
  IThenShape
>;

export const testInterfacer = (
  testInput: I["iinput"]
): IPartialInterface<I> => {
  return {
    beforeAll: async (prototype, artificer) => {
      return await new Promise((resolve, rej) => {
        resolve(null);
      });
    },
    beforeEach: async () => {
      return new Promise((resolve, rej) => {
        resolve(createElement(testInput));
      });
    },
    andWhen: async function (s, whenCB) {
      return s;
    },
    butThen: async function (s) {
      return s;
    },
    afterEach: async function (store, ndx, artificer) {
      return {};
    },
    afterAll: (store, artificer) => {
      return;
    },
  };
};
