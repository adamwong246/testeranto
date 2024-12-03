import React, { CElement, createElement } from "react";
import ReactDom from "react-dom/client";

import Testeranto from "../../../Web.js";
import {
  IBaseTest,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types";

type IInput = typeof React.Component;
type InitialState = unknown;
type ISelection = {
  htmlElement: HTMLElement;
  reactElement: any; //CElement<any, any>;
};

type IStore = {
  htmlElement: HTMLElement;
  reactElement: any; //CElement<any, any>,
  domRoot: ReactDom.Root;
};

type ISubject = {
  htmlElement: HTMLElement;
  reactElement: any; //CElement<any, any>,
  domRoot: ReactDom.Root;
};

export default <ITestShape extends IBaseTest, IWhen, IGiven>(
  testInput: IInput,
  testSpecifications: ITestSpecification<ITestShape>,
  testImplementations: ITestImplementation<ITestShape, any>
) => {
  class TesterantoComponent extends testInput {
    done: (t: TesterantoComponent) => void;
    constructor(props) {
      super(props);
      this.done = props.done;
    }
    componentDidMount() {
      super.componentDidMount && super.componentDidMount();
      return this.done(this);
    }
  }

  const t = Testeranto<ITestShape>(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeAll: async (initialProps, artificer): Promise<ISubject> => {
        console.log("mark5", initialProps);
        return await new Promise((resolve, rej) => {
          const htmlElement = document.getElementById("root");
          if (htmlElement) {
            const domRoot = ReactDom.createRoot(htmlElement);
            // Ignore these type errors
            domRoot.render(
              createElement(
                TesterantoComponent,
                {
                  ...initialProps,
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
      // beforeEach: async (
      //   s,
      //   initializer,
      //   testResource,
      //   artificer,
      //   initialValues
      // ): Promise<IStore> => {
      //   return new Promise((resolve, rej) => {
      //     console.log("beforeEach" + TesterantoComponent);

      //     // const domRoot = ReactDom.createRoot(htmlElement);
      //     // // Ignore these type errors
      //     // domRoot.render(
      //     //   createElement(
      //     //     TesterantoComponent,
      //     //     {
      //     //       ...initializer,
      //     //       done: (reactElement) => {
      //     //         resolve({
      //     //           htmlElement,
      //     //           reactElement,
      //     //           domRoot,
      //     //         });
      //     //       },
      //     //     },
      //     //     []
      //     //   )
      //     // );
      //   });
      // },
      andWhen: function (s: IStore, whenCB): Promise<ISelection> {
        return whenCB(s);
      },
      butThen: async function (s: IStore, thenCB): Promise<ISelection> {
        return thenCB(s);
      },
      afterEach: async function (store: IStore, ndx, artificer, utils) {
        console.log("afterEach", store);
        utils.writeFileSync("aftereachlog", store.toString());

        const page = (await utils.browser.pages()).filter((x) => {
          const parsedUrl = new URL(x.url());
          parsedUrl.search = "";
          const strippedUrl = parsedUrl.toString();

          return (
            strippedUrl ===
            "file:///Users/adam/Code/kokomoBay/docs/web/src/ClassicalComponent/react-dom/client.web.test.html"
          );
          // return true;
        })[0];

        const x = await page.screenshot({
          path: "afterEachLog.jpg",
        });
        console.log("x", x);
        // debugger;
        // const div_root = document.getElementById("root");
        // store.domRoot && store.domRoot.unmount(); //React 18
        //  store.remove();
        // store.htmlElement.remove();
        // store.htmlElement = document.createElement("root");
        return store;
      },
      afterAll: async (store: IStore, artificer, utils) => {
        // setTimeout(() => {
        //   console.log("This will run after 1 second");
        // }, 1000); // 1000 milliseconds = 1 second
        // store.htmlElement.remove();
        // store.htmlElement = document.createElement("root");
        return store;
      },
    }
  );

  document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
      return t;
    }
  });

  return t;
};
