import test from "../../../Node";

import React from "react";
import renderer, { act } from "react-test-renderer";

import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";


type Input = React.MemoExoticComponent<() => JSX.Element>;
type WhenShape = unknown;
type ThenShape = unknown;

export default <ITestShape extends IBaseTest, PropShape>(
  testImplementations: ITestImplementation<
    ITestShape, object
  >,
  testSpecifications: ITestSpecification<
    ITestShape
  >,
  testInput: Input
) =>
  test<
    ITestShape
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
        whenCB: () => (a: any) => any
      ): Promise<renderer.ReactTestRenderer> {
        await act(() => whenCB()(renderer));
        return renderer;
      },
    }
  );
