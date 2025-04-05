import React, { useEffect, useRef } from "react";
import { CElement, createElement } from "react";
import ReactDom from "react-dom";

import Testeranto from "../../../Web.js";
import {
  Ibdd_in,
  Ibdd_out,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types";

import type { IInput, ISelection, IStore } from "./index";

export type ISubject = HTMLElement;

const TesterantoComponent = ({
  done,
  innerComp,
}: {
  done: (ref: React.MutableRefObject<any>) => any;
  innerComp: IInput;
}) => {
  const myContainer = useRef<any>(null);
  useEffect(() => {
    console.log("useEffect called!", myContainer.current);
    done(myContainer.current);
  }, []);

  return React.createElement("div", { ref: myContainer }, innerComp());
};

export default <
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
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
  testInput: IInput
) => {
  const t = Testeranto<I, O>(
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
          resolve(subject);
          // const tc = TesterantoComponent({
          //   innerComp: () =>
          //     testInput({
          //       port: 3003,
          //       address: "some-address",
          //       secretKey: "someSecretKey",
          //       abi: "foo",
          //     }),
          //   done: (reactElement: any) => {
          //     console.log("mark9");
          //     resolve(reactElement);
          //     // process.nextTick(() => {
          //     //   resolve(reactElement);
          //     // });
          //   },
          // });
          // console.log("mark9", tc);
          // createPortal(tc, subject.domRoot);
        });
      },
      andWhen: function (s: IStore, whenCB, tr, utils): Promise<ISelection> {
        return whenCB(s, utils);
        // return new Promise(async (resolve, rej) => {
        //   // resolve(await whenCB(s, utils));
        //   // process.nextTick(() => {
        //   //   resolve(whenCB()(s));
        //   // });
        // });
      },
      butThen: async function (
        s: IStore,
        thenCB,
        tr,
        utils
      ): Promise<ISelection> {
        return new Promise((resolve, rej) => {
          resolve(thenCB(s, utils));
        });
      },
      afterEach: async function (store: IStore, ndx, artificer) {
        return new Promise((resolve, rej) => {
          resolve({});
        });
      },
      afterAll: (store: IStore, artificer) => {
        return new Promise((resolve, rej) => {
          resolve({});
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
