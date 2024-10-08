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
declare const _default: <ITestShape extends ITTestShape>(testInput: IInput, testSpecifications: ITestSpecification<ITestShape, ISubject, IStore, ISelection, any, any>, testImplementations: ITestImplementation<unknown, ISelection, any, any, ITestShape, any>) => void;
export default _default;
