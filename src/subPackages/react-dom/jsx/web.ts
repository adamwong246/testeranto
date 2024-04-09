import Testeranto from "../../../Web";

import React, {
  useEffect, useRef,
} from "react";
import { createPortal } from 'react-dom';

import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../Types";

import {
  IInput, ISelection, IStore,
  IThenShape, IWhenShape, IState
} from "./index";

export type ISubject = HTMLElement;

export default <
  ITestShape extends ITTestShape,
// IProps
>(
  testImplementations: ITestImplementation<
    IInput,
    IState,
    ISelection,
    IWhenShape,
    IThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<
    ITestShape,
    // [HTMLElement, IProps], // ISubject,
    ISubject,
    IStore,
    ISelection,
    IThenShape
  >,
  testInput: IInput
) => {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded");
    const rootElement = document.getElementById("root");
    if (rootElement) {

      const TesterantoComponent = function ({ done, innerComp }: { done: (ref: React.MutableRefObject<any>) => any, innerComp: IInput }) {
        const myContainer = useRef<any>(null);
        useEffect(() => {
          console.log(
            "useEffect called", myContainer.current
          );

          // if (!myContainer.current) {
          //   // do componentDidMount logic
          //   myContainer.current = true;
          // } else {
          //   // do componentDidUpdate logic
          // }

          done(myContainer.current);
        }, []);

        return React.createElement(
          'div',
          { ref: myContainer },
          innerComp()
        );
      };

      Testeranto<
        ITestShape,
        IInput,
        // [HTMLElement, IProps], // ISubject,
        ISubject,
        IStore,
        ISelection,
        IThenShape,
        IWhenShape,
        IState
      >(
        testInput,
        testSpecifications,
        testImplementations,
        {
          beforeAll: async (
            input,
            artificer
          ): Promise<HTMLElement> => {
            console.log("beforeAll", input);
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

              console.log("beforeEach", subject);

              createPortal(
                TesterantoComponent({
                  innerComp: testInput,
                  done: (reactElement: any) => {
                    process.nextTick(() => {
                      resolve(reactElement)// do something
                    })
                  }
                }
                  ,
                ),
                rootElement
              );
            });
          },
          andWhen: function (s: IStore, actioner): Promise<ISelection> {
            return new Promise((resolve, rej) => {
              process.nextTick(() => { resolve(actioner()(s)) })
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
