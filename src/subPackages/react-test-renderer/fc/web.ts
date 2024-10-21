import React from "react";
import renderer, { act } from "react-test-renderer";

import {
  ITestSpecification,
  ITestImplementation,
  IBaseTest,
} from "../../../Types";
import test from "../../../Web.js";

export type IInput = React.FC;
export type IWhenShape = unknown;
export type IThenShape = unknown;

export type ISpec<ITestShape extends IBaseTest> =
  ITestSpecification<ITestShape>;
export default <ITestShape extends IBaseTest, IPropShape>(
  testImplementations: ITestImplementation<ITestShape>,
  testSpecifications: ISpec<ITestShape>,
  testInput: IInput
) =>
  test<ITestShape>(testInput, testSpecifications, testImplementations, {
    beforeEach: function (
      CComponent,
      props
    ): Promise<renderer.ReactTestRenderer> {
      return new Promise((res, rej) => {
        let component: renderer.ReactTestRenderer;
        act(() => {
          component = renderer.create(
            React.createElement(CComponent, props, [])
          );
          res(component);
        });
      });
    },
    andWhen: async function (
      renderer: renderer.ReactTestRenderer,
      whenCB: () => (a: any) => any
    ): Promise<renderer.ReactTestRenderer> {
      await act(() => whenCB()(renderer));
      return renderer;
    },
    afterEach: async (store, key, artificer) => {
      console.log("afterall");
      store.unmount();
    },
  });
