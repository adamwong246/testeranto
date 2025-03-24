import React from "react";
import renderer, { act } from "react-test-renderer";

import { ISelection, IStore } from ".";

export const testInterface = {
  beforeEach: function (
    CComponent,
    propsAndChildren: () => any
  ): Promise<renderer.ReactTestRenderer> {
    function Link(proper) {
      return React.createElement(CComponent, proper(), []);
    }
    return new Promise((res, rej) => {
      act(async () => {
        const testRenderer = await renderer.create(Link(propsAndChildren));
        res(testRenderer);
      });
    });
  },
  andWhen: async function (
    renderer: renderer.ReactTestRenderer,
    whenCB: any
  ): Promise<renderer.ReactTestRenderer> {
    await act(() => whenCB(renderer));
    return renderer;
  },

  // andWhen: function (s: Store, whenCB): Promise<Selection> {
  //   return whenCB()(s);
  // },
  butThen: async function (s: IStore, thenCB, tr): Promise<ISelection> {
    return thenCB(s);
  },
  afterEach: async function (store: IStore, ndx, artificer) {
    return {};
  },
  afterAll: (store: IStore, artificer) => {
    return;
  },
};
