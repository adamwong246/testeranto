import React, { useEffect, useRef, } from "react";
import { createPortal } from 'react-dom';

import Testeranto from "../../../Web";
import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";

import {
  IInput,
  ISelection,
  IStore,
} from "./index";

export type ISubject = HTMLElement;

export default <ITestShape extends IBaseTest>(
  testImplementations: ITestImplementation<
    ITestShape,
    object
  >,
  testSpecifications: ITestSpecification<
    ITestShape
  >,
  testInput: IInput
) => {
  document.addEventListener("DOMContentLoaded", function () {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      const TesterantoComponent = function ({ done, innerComp }: { done: (ref: React.MutableRefObject<any>) => any, innerComp: IInput }) {
        const myContainer = useRef<any>(null);
        useEffect(() => {
          console.log(
            "useEffect called", myContainer.current
          );
          done(myContainer.current);
        }, []);

        return React.createElement(
          'div',
          { ref: myContainer },
          innerComp()
        );
      };

      Testeranto<
        ITestShape
      >(
        testInput,
        testSpecifications,
        testImplementations,
        {
          beforeAll: async (
            input,
            artificer
          ): Promise<HTMLElement> => {
            return await new Promise((resolve, rej) => {
              resolve(rootElement);
            })
          },

          beforeEach: async (
            subject,
            ndx,
            testRsource,
            artificer
          ): Promise<IStore> => {
            return new Promise((resolve, rej) => {
              createPortal(
                TesterantoComponent({
                  innerComp: testInput,
                  done: (reactElement: any) => {
                    process.nextTick(() => {
                      resolve(reactElement)
                    })
                  }
                },
                ),
                rootElement
              );
            });
          },
          andWhen: function (s: IStore, whenCB): Promise<ISelection> {
            return new Promise((resolve, rej) => {
              process.nextTick(() => { resolve(whenCB()(s)) })
            });
          },
          butThen: async function (s: IStore): Promise<ISelection> {
            return new Promise((resolve, rej) => {
              process.nextTick(() => { resolve(s) })
            });
          },
          afterEach: async function (
            store: IStore,
            ndx,
            artificer
          ) {
            return new Promise((resolve, rej) => {
              process.nextTick(() => { resolve({}) })
            });
          },
          afterAll: (store: IStore, artificer) => {
            return new Promise((resolve, rej) => {
              process.nextTick(() => { resolve({}) })
            });
          },
        },
      )
    }
  });
};
