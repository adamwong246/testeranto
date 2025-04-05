import { createElement } from "react";
import {
  renderToStaticMarkup,
  renderToStaticNodeStream,
} from "react-dom/server";
import Stream from "stream";

import Testeranto from "../../../Node.js";
import {
  Ibdd_in,
  Ibdd_out,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types";

import { IInput, ISelection, IStore } from "./index.js";

export { renderToStaticMarkup, renderToStaticNodeStream, Stream };

export default <
  I extends Ibdd_in<
    IInput,
    unknown,
    ISelection,
    IStore,
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
  testSpecifications: ITestSpecification<I, O>,
  testInput: I["iinput"]
) => {
  return Testeranto<I, O>(testInput, testSpecifications, testImplementations, {
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
    butThen: async function (s: I["istore"]): Promise<I["iselection"]> {
      return s;
    },
    afterEach: async function (store: I["istore"], ndx, artificer) {
      return {};
    },
    afterAll: (store: I["istore"], artificer) => {
      return;
    },
  });
};
