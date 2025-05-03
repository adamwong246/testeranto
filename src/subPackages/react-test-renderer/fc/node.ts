import React from "react";
import renderer, { act } from "react-test-renderer";

import test from "../../../Node.js";

import {
  ITestSpecification,
  ITestImplementation,
  Ibdd_in,
  Ibdd_out,
} from "../../../Types";

export type IInput = React.FC;
export type IWhenShape = unknown;
export type IThenShape = unknown;

export type ISpec<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = ITestSpecification<I, O>;
export default <
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
>(
  testImplementations: ITestImplementation<I, O>,
  testSpecifications: ISpec<I, O>,
  testInput: IInput
) =>
  test<I, O>(testInput, testSpecifications, testImplementations, {
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
      store.unmount();
    },
  });
