import renderer from "react-test-renderer";
import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";
export declare type IWhenShape = any;
export declare type IThenShape = any;
export declare type InitialState = unknown;
export declare type IInput = (props?: any) => JSX.Element;
export declare type ISelection = renderer.ReactTestRenderer;
export declare type IStore = renderer.ReactTestRenderer;
export declare type ISubject = renderer.ReactTestRenderer;
export declare type ITestImpl<ITestShape extends IBaseTest> = ITestImplementation<ITestShape, object>;
export declare type ITestSpec<ITestShape extends IBaseTest> = ITestSpecification<ITestShape>;
export declare const testInterface: {
    butThen: (s: IStore, thenCB: any, tr: any) => Promise<ISelection>;
    beforeEach: (CComponent: any, props: any) => Promise<renderer.ReactTestRenderer>;
    andWhen: (renderer: renderer.ReactTestRenderer, whenCB: (any: any) => any) => Promise<renderer.ReactTestRenderer>;
};
