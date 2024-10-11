import Testeranto from "../../../Node";

import { createElement } from "react";
import { renderToStaticMarkup, renderToStaticNodeStream } from "react-dom/server";
import Stream from 'stream'

import {
  IBaseTest,
  ITestImplementation,
  ITestSpecification
} from "../../../Types";

export {
  renderToStaticMarkup, renderToStaticNodeStream, Stream
}

export default <ITestShape extends IBaseTest>(
  testImplementations: ITestImplementation<
    ITestShape,
    any
  >,
  testSpecifications: ITestSpecification<
    ITestShape
  >,
  testInput: ITestShape['iinput']
) => {
  return Testeranto<
    ITestShape
  >(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeAll: async (
        prototype,
        artificer
      ) => {
        return await new Promise((resolve, rej) => {
          resolve(null);
        })
      },
      beforeEach: async (
        reactComponent,
        ndx,
        testRsource,
        artificer
      ): Promise<ITestShape['istore']> => {
        return new Promise((resolve, rej) => {
          // Ignore these type errors
          resolve(createElement(testInput));
        });
      },
      andWhen: async function (s, whenCB) {
        return s
      },
      butThen: async function (s: ITestShape['istore']): Promise<ITestShape['iselection']> {
        return s;
      },
      afterEach: async function (
        store: ITestShape['istore'],
        ndx,
        artificer
      ) {
        return {};
      },
      afterAll: (
        store: ITestShape['istore'],
        artificer) => {
        return;
      },
    },
  )
};
