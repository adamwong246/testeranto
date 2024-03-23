import React, {
  useEffect, useRef,
} from "react";
import ReactDom from "react-dom/client";

import { ITTestShape, ITestImplementation, ITestSpecification } from "testeranto/src/core";
import Testeranto from "testeranto/src/Web";

type Input = [string, (string) => string, any];
type InitialState = unknown;
type WhenShape = any;
type ThenShape = any;
type Selection = Store;

type Prototype = () => React.JSX.Element;
type Store = {
  root: HTMLElement,
  react: HTMLElement,
};
type Subject = {
  root: HTMLElement
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
  const TesterantoComponent = function (props) {
    const myContainer = useRef(null);

    useEffect(() => {
      console.log(
        "This only happens ONCE. It happens AFTER the initial render."
      );
      // eslint-disable-next-line react/prop-types
      props.done(myContainer.current);
    }, []);

    return React.createElement('div', { ref: myContainer }, testInput());  //testInput();
  };

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
              resolve({ root: elem });
            }
          });
        })
      },
      beforeEach: async (
        { root },
        ndx,
        testRsource,
        artificer
      ): Promise<Store> => {
        return new Promise((resolve, rej) => {
          ReactDom.createRoot(root).
            render(
              React.createElement(
                TesterantoComponent, {
                done: (react) => resolve({ root, react })
              }, []));
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
        // store.page.browser().close();
        return;
      },
    },
  )
};
