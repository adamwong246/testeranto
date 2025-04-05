import React, { CElement, createElement } from "react";
import ReactDom from "react-dom/client";

import Testeranto from "../../../Web.js";
import {
  IBaseTest,
  IPartialInterface,
  IPartialWebInterface,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types";

type IInput = typeof React.Component;
type InitialState = unknown;
type ISelection = {
  htmlElement: HTMLElement;
  reactElement: any; //CElement<any, any>;
};

export type IStore = {
  htmlElement: HTMLElement;
  reactElement: any; //CElement<any, any>,
  domRoot: ReactDom.Root;
};

type ISubject = {
  htmlElement: HTMLElement;
  // reactElement: any; //CElement<any, any>,
  domRoot: ReactDom.Root;
};

export default <ITestShape extends IBaseTest, IWhen, IGiven>(
  testInput: IInput,
  testSpecifications: ITestSpecification<ITestShape>,
  testImplementations: ITestImplementation<ITestShape, any>,
  testInterface?: IPartialWebInterface<any>
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
      beforeAll: async (subject, artificer): Promise<ISubject> => {
        return await new Promise((resolve, rej) => {
          const htmlElement = document.getElementById("root");
          if (htmlElement) {
            const domRoot = ReactDom.createRoot(htmlElement);
            resolve({ domRoot, htmlElement });
          }
        });
      },
      beforeEach: async (
        { domRoot, htmlElement },
        initialValues,
        testResource,
        artificer
      ): Promise<IStore> => {
        return new Promise(async (resolve, rej) => {
          domRoot.render(
            createElement(
              TesterantoComponent,
              {
                ...initialValues,
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
        });
      },
      andWhen: function (s: IStore, whenCB): Promise<ISelection> {
        return whenCB(s);
      },
      butThen: async function (s: IStore, thenCB): Promise<ISelection> {
        return thenCB(s);
      },
      afterEach:
        testInterface?.afterEach ||
        async function (store: IStore, ndx, utils) {
          return store;
        },

      afterAll: async (store: IStore, utils) => {
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
