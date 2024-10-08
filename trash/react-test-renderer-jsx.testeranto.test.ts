import React from "react";
import renderer, { act } from "react-test-renderer";

import Testeranto from "testeranto/src/Node";
import { ITestImplementation, ITestSpecification, ITTestShape } from "testeranto/src/core";

type Input = () => React.JSX.Element;
type WhenShape = unknown;
type ThenShape = unknown;

export const ReactTestRendererTesteranto = <
  ITestShape extends ITTestShape,
  PropShape,
>(
  testImplementations: ITestImplementation<
    PropShape,
    renderer.ReactTestRenderer,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Input,
) =>
  Testeranto<
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
      beforeEach: function (CComponent, props): Promise<renderer.ReactTestRenderer> {
        let component;
        act(() => {
          component = renderer.create(
            React.createElement(CComponent, props, [])
          );
          console.log("component", component)
        });
        return component;
      },
      andWhen: async function (renderer: renderer.ReactTestRenderer, actioner: () => (any) => any): Promise<renderer.ReactTestRenderer> {
        await act(() => actioner()(renderer));
        return renderer
      }
    }
  )