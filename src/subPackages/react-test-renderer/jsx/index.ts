import React from "react";
import renderer, { act } from "react-test-renderer";

import {
  IBaseTest,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types";

export type IWhenShape = any;
export type IThenShape = any;
export type InitialState = unknown;
export type IInput = (props?) => JSX.Element;
export type ISelection = renderer.ReactTestRenderer;
export type IStore = renderer.ReactTestRenderer;
export type ISubject = renderer.ReactTestRenderer;

export type ITestImpl<ITestShape extends IBaseTest> = ITestImplementation<
  ITestShape,
  object
>;

export type ITestSpec<ITestShape extends IBaseTest> =
  ITestSpecification<ITestShape>;

export const testInterface = {
  butThen: async function (s: IStore, thenCB, tr): Promise<ISelection> {
    console.log("butThen", thenCB.toString());
    return thenCB(s);
  },
  beforeEach: function (
    CComponent,
    props
  ): Promise<renderer.ReactTestRenderer> {
    console.log("ASDASDx");
    let component;
    act(() => {
      component = renderer.create(React.createElement(CComponent, props, []));
    });
    return component;
  },
  andWhen: async function (
    renderer: renderer.ReactTestRenderer,
    whenCB: (any) => any
  ): Promise<renderer.ReactTestRenderer> {
    await act(() => whenCB(renderer));
    return renderer;
  },
};
