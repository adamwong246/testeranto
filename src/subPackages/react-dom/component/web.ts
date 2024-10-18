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
};

type ISubject = {
  htmlElement: HTMLElement;
};

export default <ITestShape extends IBaseTest, IWhen, IGiven>(
  testInput: IInput,
  testSpecifications: ITestSpecification<ITestShape>,
  testImplementations: ITestImplementation<ITestShape, any>
) => {
  document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
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

      return Testeranto<ITestShape>(
        testInput,
        testSpecifications,
        testImplementations,
        {
          beforeAll: async (initialProps, artificer): Promise<ISubject> => {
            console.log("mark5", initialProps);
            return await new Promise((resolve, rej) => {
              const elem = document.getElementById("root");
              if (elem) {
                resolve({ htmlElement: elem });
              }
            });
          },
          beforeEach: async (
            { htmlElement },
            initializer,
            testResource,
            artificer,
            initialValues
          ): Promise<IStore> => {
            return new Promise((resolve, rej) => {
              // console.log("beforeEach" + JSON.stringify(initializer) + JSON.stringify(initialValues));
              // Ignore these type errors
              ReactDom.createRoot(htmlElement).render(
                createElement(
                  TesterantoComponent,
                  {
                    ...initializer,
                    done: (reactElement) => {
                      resolve({
                        htmlElement,
                        reactElement,
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
          butThen: async function (s: IStore): Promise<ISelection> {
            return s;
          },
          afterEach: async function (store: IStore, ndx, artificer) {
            return {};
          },
          afterAll: (store: IStore, artificer) => {
            return;
          },
        }
      );
    }
  });
};
