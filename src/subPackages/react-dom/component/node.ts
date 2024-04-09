import React, { ReactNode, createElement } from "react";
import { renderToStaticMarkup, renderToStaticNodeStream } from "react-dom/server";
import Stream from 'stream'

import Testeranto from "../../../Node";
import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../Types";

type IInput = typeof React.Component;
type InitialState = unknown;
type IWhenShape = any;
export type IThenShape = any;
export type ISelection = ReactNode;
export type IStore = ReactNode;
export type ISubject = ReactNode;

export {
  renderToStaticMarkup, renderToStaticNodeStream, Stream
}

export default <ITestShape extends ITTestShape>(
  testImplementations: ITestImplementation<
    IInput,
    InitialState,
    ISelection,
    IWhenShape,
    IThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<
    ITestShape,
    ISubject,
    IStore,
    ISelection,
    IThenShape
  >,
  testInput: IInput
) => {
  return Testeranto<
    ITestShape,
    IInput,
    ISubject,
    IStore,
    ISelection,
    IThenShape,
    IWhenShape,
    InitialState
  >(
    testInput,
    testSpecifications,
    testImplementations,
    {
      // beforeAll: async (
      //   prototype,
      //   artificer
      // ): Promise<ISubject> => {
      //   return await new Promise((resolve, rej) => {
      //     const elem = document.getElementById("root");
      //     if (elem) {
      //       resolve({ htmlElement: elem });
      //     }

      //   })
      // },
      beforeEach: async (
        reactComponent,
        ndx,
        testRsource,
        artificer
      ): Promise<IStore> => {
        return new Promise((resolve, rej) => {
          // Ignore these type errors
          resolve(createElement(testInput));
        });
      },
      andWhen: async function (s: IStore, actioner): Promise<ISelection> {
        // return actioner()(s);
        return s
      },
      butThen: async function (s: IStore): Promise<ISelection> {
        return s;
      },
      afterEach: async function (
        store: IStore,
        ndx,
        artificer
      ) {
        return {};
      },
      afterAll: (store: IStore, artificer) => {
        return;
      },
    },
  )
};
