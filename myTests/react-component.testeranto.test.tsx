import React, {
  CElement,
} from "react";
import ReactDom from "react-dom/client";

import { ITTestShape, ITestImplementation, ITestSpecification } from "testeranto/src/core";
import Testeranto from "testeranto/src/Web";

type Input = [string, (string) => string, any];
type InitialState = unknown;
type WhenShape = any;
type ThenShape = any;
type Selection = any;

type Prototype = typeof React.Component;
type Store = {
  htmlElement: HTMLElement,
  reactElement: CElement<any, any>,
};
type Subject = {
  htmlElement: HTMLElement
};

export default <ITestShape extends ITTestShape>(
  testImplementations: ITestImplementation<
    InitialState,
    Selection,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Prototype
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

  return Testeranto<
    ITestShape,
    Prototype,
    Subject,
    Store,
    Selection,
    ThenShape,
    WhenShape,
    InitialState
  >(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeAll: async (
        prototype,
        artificer
      ): Promise<Subject> => {
        artificer("./before.txt", "hello artificer");
        return await new Promise((resolve, rej) => {
          document.addEventListener("DOMContentLoaded", function () {
            const elem = document.getElementById("root");
            if (elem) {
              resolve({ htmlElement: elem });
            }
          });
        })
      },
      beforeEach: async (
        { htmlElement },
        ndx,
        testRsource,
        artificer
      ): Promise<Store> => {
        return new Promise((resolve, rej) => {
          const reactElement = React.createElement(TesterantoComponent, {
            done: (reactElement) => {
              resolve(
                {
                  htmlElement,
                  reactElement,
                }
              );
            }
          }, []);
          ReactDom.createRoot(htmlElement).render(reactElement);
        });
      },
      andWhen: function (s: Store, actioner): Promise<Selection> {
        return actioner()(s);
      },
      butThen: async function (s: Store): Promise<Selection> {
        return s;
      },
      afterEach: async function (
        store: Store,
        ndx,
        artificer
      ) {
        return {};
      },
      afterAll: (store: Store, artificer) => {
        return;
      },
    },
  )
};
