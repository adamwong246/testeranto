import React, { CElement } from "react";
import { ITTestShape } from "../../../lib";
import { ITestImplementation, ITestSpecification } from "../../../Types";
declare type IInput = typeof React.Component;
declare type InitialState = unknown;
declare type IWhenShape = any;
declare type IThenShape = any;
declare type ISelection = {
    htmlElement: HTMLElement;
    reactElement: CElement<any, any>;
};
declare type IStore = {
    htmlElement: HTMLElement;
    reactElement: CElement<any, any>;
};
declare type ISubject = {
    htmlElement: HTMLElement;
};
declare const _default: <ITestShape extends ITTestShape>(testImplementations: ITestImplementation<unknown, ISelection, any, any, ITestShape>, testSpecifications: ITestSpecification<ITestShape, ISubject, IStore, ISelection, any>, testInput: IInput) => void;
export default _default;
