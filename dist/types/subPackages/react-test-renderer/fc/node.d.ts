import React from "react";
import renderer from "react-test-renderer";
import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../core";
export declare type IInput = React.FC;
export declare type IWhenShape = unknown;
export declare type IThenShape = unknown;
export declare type ISpec<ITestShape extends ITTestShape> = ITestSpecification<ITestShape, any, any, any, IThenShape>;
declare const _default: <ITestShape extends ITTestShape, IPropShape>(testImplementations: ITestImplementation<IPropShape, renderer.ReactTestRenderer, unknown, unknown, ITestShape>, testSpecifications: ISpec<ITestShape>, testInput: IInput) => Promise<void>;
export default _default;
