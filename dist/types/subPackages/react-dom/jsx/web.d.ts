import React from "react";
import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../core";
import { IInput, ISelection, IStore, IThenShape, IWhenShape, IState } from ".";
export declare type ISubject = HTMLElement;
declare const _default: <ITestShape extends ITTestShape>(testImplementations: ITestImplementation<unknown, React.ReactNode, any, any, ITestShape>, testSpecifications: ITestSpecification<ITestShape, HTMLElement, React.ReactNode, React.ReactNode, any>, testInput: IInput) => void;
export default _default;
