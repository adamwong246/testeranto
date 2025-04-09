import React, { ReactNode, createElement } from "react";
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

type IInput = typeof React.Component;

export type ISelection = ReactNode;
export type IStore = ReactNode;
export type ISubject = ReactNode;

export { renderToStaticMarkup, renderToStaticNodeStream, Stream };

export type I = Ibdd_in<
  IInput,
  ISubject,
  IStore,
  ISelection,
  unknown,
  (s: IStore) => IStore,
  unknown
>;
export default <
  I,
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
  testInput: IInput
) => {
  return Testeranto<I, O>(testInput, testSpecifications, testImplementations, {
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
  });
};

// type IInput = typeof React.Component;
// type InitialState = unknown;
// type IWhenShape = any;
// type IThenShape = any;
// type ISelection = string;
// type IStore = string;
// type ISubject = string

// export default <ITestShape extends ITTestShape>(
//   testImplementations: ITestImplementation<
//     InitialState,
//     ISelection,
//     IWhenShape,
//     IThenShape,
//     ITestShape
//   >,
//   testSpecifications: ITestSpecification<
//     ITestShape,
//     ISubject,
//     IStore,
//     ISelection,
//     IThenShape
//   >,
//   testInput: IInput
// ) => {
//   return Testeranto<
//     ITestShape,
//     IInput,
//     ISubject,
//     IStore,
//     ISelection,
//     IThenShape,
//     IWhenShape,
//     InitialState
//   >(
//     testInput,
//     testSpecifications,
//     testImplementations,
//     {
//       beforeEach: async (
//         element,
//         ndx,
//         testResource,
//         artificer
//       ): Promise<IStore> => {
//         return new Promise((resolve, rej) => {
//           resolve(ReactDOMServer.renderToStaticMarkup(element));
//         });
//       },
//       andWhen: function (s: IStore, whenCB): Promise<ISelection> {
//         throw new Error(`"andWhens" are not permitted`);
//       }
//     },
//   )
// };
