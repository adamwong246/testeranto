import Testeranto from "../../../Web";

import React, {
  useEffect, useRef,
} from "react";
import ReactDom from "react-dom/client";

import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../core";
import {
  IInput, ISelection, IStore,
  IThenShape, IWhenShape, IState
} from ".";

export type ISubject = HTMLElement;

export default <ITestShape extends ITTestShape>(
  testImplementations: ITestImplementation<
    IState,
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

          if (!myContainer.current) {
            // do componentDidMount logic
            myContainer.current = true;
          } else {
            // do componentDidUpdate logic
          }

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
          ): Promise<ISubject> => {
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

              ReactDom.createRoot(rootElement).
                render(
                  // ignore this type error
                  React.createElement(
                    TesterantoComponent, {
                    done: (reactElement: any) => {
                      process.nextTick(() => {
                        resolve(reactElement)// do something
                      });

                    },
                    innerComp: testInput
                  },
                    []));
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
