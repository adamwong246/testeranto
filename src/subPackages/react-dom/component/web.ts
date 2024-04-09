import React, { CElement, createElement } from "react";
import ReactDom from "react-dom/client";

import Testeranto from "../../../Web";
import { ITTestShape } from "../../../lib";
import { ITestImplementation, ITestSpecification } from "../../../Types";

type IInput = typeof React.Component;
type InitialState = unknown;
type IWhenShape = any;
type IThenShape = any;
type ISelection = {
  htmlElement: HTMLElement,
  reactElement: CElement<any, any>,
};

type IStore = {
  htmlElement: HTMLElement,
  reactElement: CElement<any, any>,
};

type ISubject = {
  htmlElement: HTMLElement
};

export default <ITestShape extends ITTestShape>(
  testImplementations: ITestImplementation<
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

  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded")
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
          beforeAll: async (
            prototype,
            artificer
          ): Promise<ISubject> => {
            return await new Promise((resolve, rej) => {
              const elem = document.getElementById("root");
              if (elem) {
                resolve({ htmlElement: elem });
              }

            })
          },
          beforeEach: async (
            { htmlElement },
            ndx,
            testRsource,
            artificer
          ): Promise<IStore> => {
            return new Promise((resolve, rej) => {
              // Ignore these type errors
              ReactDom.createRoot(htmlElement).render(createElement(
                TesterantoComponent, {
                done: (reactElement) => {
                  resolve(
                    {
                      htmlElement,
                      reactElement,
                    }
                  );
                }
              }, []
              ));
            });
          },
          andWhen: function (s: IStore, actioner): Promise<ISelection> {
            return actioner()(s);
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
    }
  });


};
