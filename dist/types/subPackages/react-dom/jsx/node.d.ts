import React from "react";
import { renderToStaticMarkup, renderToStaticNodeStream } from "react-dom/server";
import Stream from 'stream';
import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../core";
import { IInput, ISelection, IStore, IThenShape, IWhenShape, IState } from ".";
export declare type ISubject = void;
export { renderToStaticMarkup, renderToStaticNodeStream, Stream };
declare const _default: <ITestShape extends ITTestShape>(testImplementations: ITestImplementation<unknown, React.ReactNode, any, any, ITestShape>, testSpecifications: ITestSpecification<ITestShape, void, React.ReactNode, React.ReactNode, any>, testInput: IInput) => Promise<void>;
export default _default;
