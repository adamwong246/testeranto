import React from "react";
import renderer, { act, ReactTestRenderer } from "react-test-renderer";

import { Ibdd_in, IPartialInterface } from "../../../Types";

export type IWhenShape = any;
export type IThenShape = void;
export type InitialState = unknown;
export type IInput = (props?) => JSX.Element;
export type ISelection = renderer.ReactTestRenderer;
export type IStore = renderer.ReactTestRenderer;
export type ISubject = renderer.ReactTestRenderer;

export type I = Ibdd_in<
  (props?) => JSX.Element,
  ReactTestRenderer,
  ReactTestRenderer,
  ReactTestRenderer,
  unknown,
  IWhenShape,
  IThenShape
>;

export const testInterface: IPartialInterface<I> = {
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
