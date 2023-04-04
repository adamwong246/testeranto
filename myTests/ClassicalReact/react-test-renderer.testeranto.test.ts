// This file defines the test of a classical react component

import React from "react";
import renderer, { act } from "react-test-renderer";

import Testeranto from "testeranto/src/core-node";
import { ITestImplementation, ITestSpecification, ITTestShape } from "testeranto/src/core";

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
  testInput: Input,
  nameKey: string
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
    },
    nameKey
  )