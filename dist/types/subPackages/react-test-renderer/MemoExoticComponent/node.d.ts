import React from "react";
import renderer from "react-test-renderer";
import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../Types";
declare type IInput = React.MemoExoticComponent<() => JSX.Element>;
declare type WhenShape = unknown;
declare type ThenShape = unknown;
declare const _default: <ITestShape extends ITTestShape, PropShape>(testImplementations: ITestImplementation<IInput, PropShape, renderer.ReactTestRenderer, unknown, unknown, ITestShape>, testSpecifications: ITestSpecification<ITestShape, any, any, any, any>, testInput: IInput) => Promise<void>;
export default _default;
