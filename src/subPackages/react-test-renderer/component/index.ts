import React from "react";
import renderer, { act, ReactTestRenderer } from "react-test-renderer";

import type {
  Ibdd_in,
  Ibdd_out,
  IT,
  ITestImplementation,
  ITestSpecification,
  OT,
} from "../../../Types";

export type I = Ibdd_in<
  IInput<any, any>,
  ReactTestRenderer,
  ReactTestRenderer,
  ReactTestRenderer,
  unknown,
  unknown,
  unknown
>;

export type ISuper<T> = T extends infer U ? U : object;

export type IInput<P, S> = typeof React.Component<P, S>;
export type InitialState = unknown;
export type IWhenShape = any;
export type IThenShape = any;
export type ISelection = renderer.ReactTestRenderer;
export type IStore = renderer.ReactTestRenderer;
export type ISubject = renderer.ReactTestRenderer;

export type IImpl<I extends IT, O extends OT, M> = ITestImplementation<I, O>;
export type ITestSpecification<
  I extends IT,
  O extends OT,
  M
> = ITestSpecification<I, O>;
