import React from "react";
import renderer, { act } from "react-test-renderer";
import { ISelection, IStore } from ".";

export const testInterface = {
  beforeEach: function (
    CComponent,
    propsAndChildren
  ): Promise<renderer.ReactTestRenderer> {
    function Link(props) {
      const p = props.props;
      const c = props.children;
      return React.createElement(CComponent, p, c);
    }
    return new Promise((res, rej) => {
      act(async () => {
        const p = propsAndChildren;
        const y = new CComponent(p.props);
        const testRenderer = await renderer.create(Link(propsAndChildren));
        res(testRenderer);
      });
    });
  },
  andWhen: async function (
    renderer: renderer.ReactTestRenderer,
    whenCB: any
  ): Promise<renderer.ReactTestRenderer> {
    // console.log("andWhen", whenCB)
    await act(() => whenCB(renderer));
    return renderer;
  },

  // andWhen: function (s: Store, whenCB): Promise<Selection> {
  //   return whenCB()(s);
  // },
  butThen: async function (s: IStore, thenCB, tr): Promise<ISelection> {
    console.log("butThen", thenCB.toString());
    return thenCB(s);
  },
  afterEach: async function (store: IStore, ndx, artificer) {
    // console.log("afterEach", store);
    return {};
  },
  afterAll: (store: IStore, artificer) => {
    // console.log("afterAll", store);
    return;
  },
};
