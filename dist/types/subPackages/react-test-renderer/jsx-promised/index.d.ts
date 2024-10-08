import renderer from "react-test-renderer";
import { ITTestShape } from "../../../lib";
import { ITestImplementation, ITestSpecification } from "../../../Types";
export declare type IWhenShape = any;
export declare type IThenShape = any;
export declare type InitialState = unknown;
export declare type IInput = Promise<JSX.Element>;
export declare type ISelection = renderer.ReactTestRenderer;
export declare type IStore = renderer.ReactTestRenderer;
export declare type ISubject = renderer.ReactTestRenderer;
export declare type ITestImpl<ITestShape extends ITTestShape> = ITestImplementation<InitialState, ISelection, IWhenShape, IThenShape, ITestShape, any>;
export declare type ITestSpec<ITestShape extends ITTestShape> = ITestSpecification<ITestShape, ISubject, IStore, ISelection, IThenShape, any>;
export declare const testInterface: {
    beforeEach: (CComponent: any) => Promise<renderer.ReactTestRenderer>;
    andWhen: (renderer: renderer.ReactTestRenderer, whenCB: () => (any: any) => any) => Promise<renderer.ReactTestRenderer>;
};
