import React from "react";
import renderer from "react-test-renderer";
import { ITTestShape } from "../../../lib";
import { ITestImplementation, ITestSpecification } from "../../../Types";
declare type Input = React.MemoExoticComponent<() => JSX.Element>;
declare type WhenShape = unknown;
declare type ThenShape = unknown;
declare const _default: <ITestShape extends ITTestShape, PropShape>(testImplementations: ITestImplementation<PropShape, renderer.ReactTestRenderer, unknown, unknown, ITestShape>, testSpecifications: ITestSpecification<ITestShape, any, any, any, any>, testInput: Input) => Promise<void>;
export default _default;
