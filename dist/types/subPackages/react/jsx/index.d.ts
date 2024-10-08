import { CElement } from "react";
import { ITTestShape } from "../../../lib";
import { ITestImplementation, ITestSpecification } from "../../../Types";
export declare type IWhenShape = any;
export declare type IThenShape = any;
export declare type InitialState = unknown;
export declare type IInput = () => JSX.Element;
export declare type ISelection = CElement<any, any>;
export declare type IStore = CElement<any, any>;
export declare type ISubject = CElement<any, any>;
export declare type ITestImpl<ITestShape extends ITTestShape> = ITestImplementation<InitialState, ISelection, IWhenShape, IThenShape, ITestShape, any>;
export declare type ITestSpec<ITestShape extends ITTestShape> = ITestSpecification<ITestShape, ISubject, IStore, ISelection, IThenShape, any>;
export declare const testInterface: (testInput: any) => {
    beforeEach: (x: any, ndx: any, testRsource: any, artificer: any) => Promise<IStore>;
    andWhen: (s: IStore, whenCB: any) => Promise<ISelection>;
};
