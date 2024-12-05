import React, { useEffect, useRef } from "react";
import { CElement, createElement } from "react";
import ReactDom from "react-dom/client";
import { createPortal } from "react-dom";

import Testeranto from "../../../Web.js";
import {
  IBaseTest,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types";

import type { IInput, ISelection, IStore } from "./index";

export type ISubject = HTMLElement;

export default <ITestShape extends IBaseTest>(
  testImplementations: ITestImplementation<ITestShape>,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: IInput
) => {
  console.log("testInput", testInput);
  const TesterantoComponent = function ({
    done,
    innerComp,
  }: {
    done: (ref: React.MutableRefObject<any>) => any;
    innerComp: IInput;
  }) {
    const myContainer = useRef<any>(null);
    useEffect(() => {
      console.log("useEffect called!", myContainer.current);
      done(myContainer.current);
    }, []);

    // debugger;
    return React.createElement("div", { ref: myContainer }, innerComp());
  };

  const t = Testeranto<ITestShape>(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeAll: async (reactElement, itr): Promise<any> => {
        return await new Promise((resolve, rej) => {
          const htmlElement = document.getElementById("root");
          if (htmlElement) {
            const domRoot = ReactDom.createRoot(htmlElement);

            domRoot.render(
              createElement(
                TesterantoComponent,
                {
                  // ...initialProps,
                  innerComp: reactElement,
                  done: (reactElement) => {
                    resolve({
                      htmlElement,
                      reactElement,
                      domRoot,
                    });
                  },
                },
                []
              )
            );

            // resolve({ htmlElement });
          }
        });
      },

      beforeEach: async (
        subject,
        initializer,
        artificer,
        testResource,
        pm
      ): Promise<IStore> => {
        return new Promise((resolve, rej) => {
          createPortal(
            TesterantoComponent({
              innerComp: () =>
                testInput({
                  port: 3003,
                  address: "some-address",
                  secretKey: "someSecretKey",
                  abi: "foo",
                }),
              done: (reactElement: any) => {
                process.nextTick(() => {
                  resolve(reactElement);
                });
              },
            }),
            subject.domRoot
          );
        });
      },
      andWhen: function (s: IStore, whenCB): Promise<ISelection> {
        return new Promise((resolve, rej) => {
          process.nextTick(() => {
            resolve(whenCB()(s));
          });
        });
      },
      butThen: async function (s: IStore): Promise<ISelection> {
        return new Promise((resolve, rej) => {
          process.nextTick(() => {
            resolve(s);
          });
        });
      },
      afterEach: async function (store: IStore, ndx, artificer) {
        return new Promise((resolve, rej) => {
          process.nextTick(() => {
            resolve({});
          });
        });
      },
      afterAll: (store: IStore, artificer) => {
        return new Promise((resolve, rej) => {
          process.nextTick(() => {
            resolve({});
          });
        });
      },
    }
  );

  document.addEventListener("DOMContentLoaded", function () {
    const rootElement = document.getElementById("root");
    if (rootElement) {
    }
  });

  return t;
};
