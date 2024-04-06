import renderer from "react-test-renderer";
import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../core";
export declare type IWhenShape = any;
export declare type IThenShape = any;
export declare type InitialState = unknown;
export declare type IInput = Promise<JSX.Element>;
export declare type ISelection = renderer.ReactTestRenderer;
export declare type IStore = renderer.ReactTestRenderer;
export declare type ISubject = renderer.ReactTestRenderer;
export declare type ITestImpl<ITestShape extends ITTestShape> = ITestImplementation<InitialState, ISelection, IWhenShape, IThenShape, ITestShape>;
export declare type ITestSpec<ITestShape extends ITTestShape> = ITestSpecification<ITestShape, ISubject, IStore, ISelection, IThenShape>;
export declare const testInterface: {
    beforeEach: (CComponent: any) => Promise<renderer.ReactTestRenderer>;
    andWhen: (renderer: renderer.ReactTestRenderer, actioner: () => (any: any) => any) => Promise<renderer.ReactTestRenderer>;
};
