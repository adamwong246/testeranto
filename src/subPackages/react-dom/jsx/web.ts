import React, {
  useEffect, useRef,
} from "react";
import ReactDom from "react-dom/client";

import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../core";
import Testeranto from "../../../../src/Web";

type Input = [string, (string) => string, any];
type InitialState = unknown;
type IWhenShape = any;
type IThenShape = any;
type ISelection = IStore;

type Prototype = () => JSX.Element;
type IStore = {
  root: HTMLElement,
  react: HTMLElement,
};
type ISubject = {
  root: HTMLElement
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
      ): Promise<IStore> => {
        return new Promise((resolve, rej) => {
          ReactDom.createRoot(root).
            render(
              React.createElement(
                TesterantoComponent, {
                done: (react) => resolve({ root, react })
              }, []));
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
        // store.page.browser().close();
        return;
      },
    },
  )
};
