import React from "react";
import renderer, { act } from "react-test-renderer";

import type {
  IBaseTest,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types";

export type ISuper<T> = T extends infer U ? U : object;

export type IInput<P, S> = typeof React.Component<P, S>;
export type InitialState = unknown;
export type IWhenShape = any;
export type IThenShape = any;
export type ISelection = renderer.ReactTestRenderer;
export type IStore = renderer.ReactTestRenderer;
export type ISubject = renderer.ReactTestRenderer;

export type IImpl<ITestShape extends IBaseTest> =
  ITestImplementation<ITestShape>;
export type ISpec<ITestShape extends IBaseTest> =
  ITestSpecification<ITestShape>;
