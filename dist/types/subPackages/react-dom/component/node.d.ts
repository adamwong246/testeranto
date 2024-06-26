import React, { ReactNode } from "react";
import { renderToStaticMarkup, renderToStaticNodeStream } from "react-dom/server";
import Stream from 'stream';
import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../Types";
declare type IInput = typeof React.Component;
declare type InitialState = unknown;
declare type IWhenShape = any;
export declare type IThenShape = any;
export declare type ISelection = ReactNode;
export declare type IStore = ReactNode;
export declare type ISubject = ReactNode;
export { renderToStaticMarkup, renderToStaticNodeStream, Stream };
declare const _default: <ITestShape extends ITTestShape>(testImplementations: ITestImplementation<typeof React.Component, unknown, React.ReactNode, any, any, ITestShape>, testSpecifications: ITestSpecification<ITestShape, React.ReactNode, React.ReactNode, React.ReactNode, any>, testInput: IInput) => Promise<void>;
export default _default;
