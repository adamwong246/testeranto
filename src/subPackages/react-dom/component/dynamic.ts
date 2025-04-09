import React from "react";
import ReactDom from "react-dom/client";

import { Ibdd_in, IPartialInterface, ITestInterface } from "../../../Types";

export type IInput = typeof React.Component;

export type ISelection = {
  htmlElement: HTMLElement;
  reactElement: any; //CElement<any, any>;
  domRoot: ReactDom.Root;
};

export type IStore = {
  htmlElement: HTMLElement;
  reactElement: any; //CElement<any, any>,
  domRoot: ReactDom.Root;
};

export type ISubject = {
  htmlElement: HTMLElement;
  // reactElement: any; //CElement<any, any>,
  domRoot: ReactDom.Root;
};

export type I = Ibdd_in<
  IInput,
  ISubject,
  ISelection,
  IStore,
  (s: IStore) => IStore,
  (s: IStore) => IStore,
  (s: IStore) => IStore
>;

export const testInterfacer: (
  testInput: IInput
) => IPartialInterface<I> = () => {
  class TesterantoComponent extends React.Component {
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

  return {
    beforeAll: async (subject, artificer) => {
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
    ) => {
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
    andWhen: async function (s, whenCB) {
      return whenCB(s);
    },
    butThen: async function (s, thenCB) {
      return thenCB(s);
    },
    afterEach:
      testInterface?.afterEach ||
      async function (store, ndx, utils) {
        return store;
      },

    afterAll: async (store, utils) => {
      // setTimeout(() => {
      //   console.log("This will run after 1 second");
      // }, 1000); // 1000 milliseconds = 1 second
      // store.htmlElement.remove();
      // store.htmlElement = document.createElement("root");
      return store;
    },
  };
};
