import React, { ReactNode } from "react";
import { renderToStaticMarkup, renderToStaticNodeStream } from "react-dom/server";
import Stream from "stream";
import { ITestImplementation, ITestSpecification } from "../../../Types";
declare type IInput = typeof React.Component;
export declare type IThenShape = any;
export declare type ISelection = ReactNode;
export declare type IStore = ReactNode;
export declare type ISubject = ReactNode;
export { renderToStaticMarkup, renderToStaticNodeStream, Stream };
declare const _default: <ITestShape extends any>(testImplementations: ITestImplementation<ITestShape, object>, testSpecifications: ITestSpecification<ITestShape>, testInput: IInput) => Promise<import("../../../lib/core.js").default<ITestShape>>;
export default _default;
