import React from "react";
import renderer, { act } from "react-test-renderer";

import { IPartialInterface } from "../../../Types";

import { I } from ".";

export const testInterface: IPartialInterface<I> = {
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
  butThen: async function (s, thenCB, tr) {
    return thenCB(s);
  },
  afterEach: async function (store, ndx, artificer) {
    return {};
  },
  afterAll: (store, artificer) => {
    return;
  },
};
