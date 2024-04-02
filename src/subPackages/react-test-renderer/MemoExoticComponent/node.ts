import test from "../../../Node";

import React from "react";
import renderer, { act } from "react-test-renderer";

import {
  ITestImplementation,
  ITestSpecification,
  ITTestShape,
} from "../../../core";

type Input = React.MemoExoticComponent<() => JSX.Element>;
type WhenShape = unknown;
type ThenShape = unknown;

export default <ITestShape extends ITTestShape, PropShape>(
  testImplementations: ITestImplementation<
    PropShape,
    renderer.ReactTestRenderer,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<
    ITestShape,
    any,
    any,
    any,
    any
  >,
  testInput: Input
) =>
  test<
    ITestShape,
    Input,
    any,
    any,
    unknown,
    unknown,
    unknown,
    unknown
  >(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeEach: function (
        CComponent,
        props
      ): Promise<renderer.ReactTestRenderer> {
        let component;
        act(() => {
          component = renderer.create(
            React.createElement(CComponent, props, [])
          );
        });
        return component;
      },
      andWhen: async function (
        renderer: renderer.ReactTestRenderer,
        actioner: () => (a: any) => any
      ): Promise<renderer.ReactTestRenderer> {
        await act(() => actioner()(renderer));
        return renderer;
      },
    }
  );
