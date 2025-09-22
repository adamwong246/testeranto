import { IInput, ISelection, ISubject } from "./types";

import * as React from "react";
import * as ReactDom from "react-dom/client";
import { SunriseAnimation } from "./SunriseAnimation";
import { ITestAdapter } from "../../../../CoreTypes";

export const interface: ITestAdapter<{
  iinput: IInput;
  isubject: ISubject;
  istore: ISelection;
  iselection: ISelection;
  given: (props: IInput) => ISelection;
  when: (sel: ISelection) => ISelection;
  then: (sel: ISelection) => Promise<ISelection>;
}> = {
  beforeEach: async (subject, initializer) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = ReactDom.createRoot(container);
    const props = initializer();
    const reactElement = React.createElement(subject, props);
    root.render(reactElement);

    return {
      container,
      reactElement,
      domRoot: root,
      animationElement: container.querySelector(".sunrise-animation"),
    };
  },

  afterEach: async (store) => {
    store.domRoot.unmount();
    document.body.removeChild(store.container);
    return store;
  },

  andWhen: async (store, whenCB) => {
    return whenCB(store);
  },

  butThen: async (store, thenCB) => {
    return thenCB(store);
  },

  afterAll: () => {},
  beforeAll: () => ({}),
  assertThis: (x) => x,
};
