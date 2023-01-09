// This file defines the test of a classical react component

import React from "react";
import renderer, { act } from "react-test-renderer";

import { Testeranto } from "../../src/index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/types";

type Input = typeof React.Component;
type WhenShape = any;
type ThenShape = any;

export const ReactTestRendererTesteranto = <
  ITestShape extends ITTestShape,
  PropShape,
  StateShape
>(
  testImplementations: ITestImplementation<
    PropShape,
    renderer.ReactTestRenderer,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Input
) =>
  Testeranto<
    ITestShape,
    Input,
    any,
    any,
    any,
    any,
    any,
    any
  >(
    testInput,
    testSpecifications,
    testImplementations,
    { ports: 0 },
    {
      beforeEach: function (CComponent, props): Promise<renderer.ReactTestRenderer> {
        let component;
        act(() => {
          component = renderer.create(
            React.createElement(CComponent, props, [])
          );
        });
        return component;
      },
      andWhen: async function (renderer: renderer.ReactTestRenderer, actioner: any): Promise<renderer.ReactTestRenderer> {
        await act(() => actioner()(renderer));
        return renderer
      }
    }
  )