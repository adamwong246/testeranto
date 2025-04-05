import React from "react";
import renderer, { act } from "react-test-renderer";

import {
  Ibdd_in,
  Ibdd_out,
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

export type ITestImpl<
  I extends Ibdd_in<
    unknown,
    unknown,
    renderer.ReactTestRenderer,
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
> = ITestImplementation<I, O>;

export type ITestSpec<
  I extends Ibdd_in<
    unknown,
    unknown,
    renderer.ReactTestRenderer,
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

export const testInterface = {
  butThen: async function (s: IStore, thenCB): Promise<ISelection> {
    // console.log("butThen", thenCB.toString());
    return thenCB(s);
  },
  beforeEach: function (
    CComponent,
    props
  ): Promise<renderer.ReactTestRenderer> {
    let component;
    act(() => {
      // component = renderer.create(
      //   React.createElement(
      //     AppContext.Provider,
      //     { value: contextValue },
      //     React.createElement(AppContext.Consumer, null, (context) =>
      //       React.createElement(CComponent, Object.assign({}, context, {}))
      //     )
      //   )
      // );
      component = renderer.create(
        React.createElement(
          CComponent,
          props,
          React.createElement(CComponent, props, [])
        )
      );
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
