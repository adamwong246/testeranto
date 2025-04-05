import React from "react";
import renderer, { act } from "react-test-renderer";

import {
  Ibdd_in,
  Ibdd_out,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types";
import test from "../../../Node";

type IInput = React.MemoExoticComponent<() => JSX.Element>;

export default <
  I extends Ibdd_in<
    IInput,
    renderer.ReactTestRenderer,
    renderer.ReactTestRenderer,
    renderer.ReactTestRenderer,
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
  testSpecifications: ITestSpecification<I, O>,
  testInput: IInput
) =>
  test<I, O>(testInput, testSpecifications, testImplementations, {
    beforeEach: function (
      CComponent,
      props
    ): Promise<renderer.ReactTestRenderer> {
      let component;
      act(() => {
        component = renderer.create(React.createElement(CComponent, props, []));
      });
      return component;
    },
    andWhen: async function (
      renderer: renderer.ReactTestRenderer,
      whenCB: () => (a: any) => any
    ): Promise<renderer.ReactTestRenderer> {
      await act(() => whenCB()(renderer));
      return renderer;
    },
  });
