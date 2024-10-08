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
  testInput: IInput,
  testSpecifications: ITestSpecification<
    ITestShape,
    ISubject,
    IStore,
    ISelection,
    IThenShape,
    any
  >,
  testImplementations: ITestImplementation<
    InitialState,
    ISelection,
    IWhenShape,
    IThenShape,
    ITestShape,
    any
  >,

) => {

  console.log("mark80" + testImplementations);

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
            initialProps,
            artificer
          ): Promise<ISubject> => {
            // console.log("mark41", initialProps)
            return await new Promise((resolve, rej) => {
              const elem = document.getElementById("root");
              if (elem) {
                resolve({ htmlElement: elem });
              }

            })
          },
          beforeEach: async (
            { htmlElement },
            initialValues,
            testResource,
            artificer,
          ): Promise<IStore> => {
            console.log("mark444", initialValues)
            // debugger
            return new Promise((resolve, rej) => {
              // Ignore these type errors
              ReactDom.createRoot(htmlElement).render(createElement(
                TesterantoComponent, {
                ...initialValues.props,
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
          andWhen: function (s: IStore, whenCB): Promise<ISelection> {
            console.log("mark31", whenCB)
            return whenCB(s);
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
