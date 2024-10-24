import { CElement } from "react";
import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";
export declare type IWhenShape = any;
export declare type IThenShape = any;
export declare type InitialState = unknown;
export declare type IInput = () => JSX.Element;
export declare type ISelection = CElement<any, any>;
export declare type IStore = CElement<any, any>;
export declare type ISubject = CElement<any, any>;
export declare type ITestImpl<ITestShape extends IBaseTest> = ITestImplementation<ITestShape>;
export declare type ITestSpec<ITestShape extends IBaseTest> = ITestSpecification<ITestShape>;
export declare const testInterface: {
    beforeEach: (x: any, ndx: any, testRsource: any, artificer: any) => Promise<IStore>;
    andWhen: (s: IStore, whenCB: any) => Promise<ISelection>;
};
