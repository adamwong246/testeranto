import { createElement, useEffect, useRef } from "react";
import React from "react";
import ReactDom from "react-dom/client";

import { Ibdd_in, IPartialInterface } from "../../../Types";

import { IInput, ISelection, IStore } from ".";
import { IPM } from "../../../lib/types";

export type I = Ibdd_in<
  IInput,
  HTMLElement,
  ISelection,
  IStore,
  unknown,
  (s: HTMLElement, p: IPM) => any,
  (s: HTMLElement, p: IPM) => any
>;

const TesterantoComponent = ({
  done,
  innerComp,
}: {
  done: (ref: React.MutableRefObject<any>) => any;
  innerComp: IInput;
}) => {
  const myContainer = useRef<any>(null);
  useEffect(() => {
    done(myContainer.current);
  }, []);

  return React.createElement("div", { ref: myContainer }, innerComp());
};

export const testInterface: IPartialInterface<I> = {
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

  beforeEach: async (subject) => {
    return subject;
  },
  andWhen: async function (s, whenCB, tr, utils) {
    return whenCB(s, utils);
  },
  butThen: async function (s, thenCB, tr, utils) {
    return new Promise((resolve, rej) => {
      resolve(thenCB(s, utils));
    });
  },
  afterEach: async function (store, ndx, artificer) {
    return new Promise((resolve, rej) => {
      resolve({});
    });
  },
  afterAll: (store, artificer) => {
    return new Promise((resolve, rej) => {
      resolve({});
    });
  },
};
