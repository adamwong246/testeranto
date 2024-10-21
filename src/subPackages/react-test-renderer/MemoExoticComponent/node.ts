import React from "react";
import renderer, { act } from "react-test-renderer";

import {
  IBaseTest,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types";
import test from "../../../Node";

type IInput = React.MemoExoticComponent<() => JSX.Element>;
type WhenShape = unknown;
type ThenShape = unknown;

export default <ITestShape extends IBaseTest, PropShape>(
  testImplementations: ITestImplementation<ITestShape>,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: IInput
) =>
  test<ITestShape>(testInput, testSpecifications, testImplementations, {
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
