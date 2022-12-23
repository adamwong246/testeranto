// This file defines the test of a classical react component

import React from "react";
import renderer, { act } from "react-test-renderer";

import { TesterantoFactory } from "../../index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";
import { ClassicalComponent } from "./ClassicalComponent";

type Input = any;
type InitialState = unknown;
type WhenShape = any;
type ThenShape = any;

export const ReactTestRendererTesteranto = <
  ITestShape extends ITTestShape
>(
  testImplementations: ITestImplementation<
    InitialState,
    renderer.ReactTestRenderer,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Input
) =>
  TesterantoFactory<
    ITestShape,
    renderer.ReactTestRenderer,
    renderer.ReactTestRenderer,
    renderer.ReactTestRenderer,
    renderer.ReactTestRenderer,
    any,
    any,
    any,
    any
  >(
    testInput,
    testSpecifications,
    testImplementations,
    "na",
    {
      beforeAll: async function (input: renderer.ReactTestRenderer): Promise<renderer.ReactTestRenderer> {
        return input;
      },
      beforeEach: function (subject: renderer.ReactTestRenderer, initialValues: any, testResource: any): Promise<renderer.ReactTestRenderer> {
        let component;
        act(() => {
          component = renderer.create(
            React.createElement(ClassicalComponent, {}, [])
          );
        });
        return component;
      },
      andWhen: async function (renderer: renderer.ReactTestRenderer, actioner: any, testResource: any): Promise<renderer.ReactTestRenderer> {
        await act(() => actioner(renderer));
        return renderer
      },
      butThen: async function (store: renderer.ReactTestRenderer, callback: any, testResource: any): Promise<renderer.ReactTestRenderer> {
        return store;
      },
      assertioner: function (t: any) {
        return t;
      },
      teardown: function (renderer: renderer.ReactTestRenderer, ndx: number): unknown {
        return renderer;
      },
      actionHandler: async function (b: (...any: any[]) => any) {
        return b;
      }
    }
  )