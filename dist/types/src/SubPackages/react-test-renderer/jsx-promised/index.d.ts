import renderer from "react-test-renderer";
import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";
export type IWhenShape = any;
export type IThenShape = any;
export type InitialState = unknown;
export type IInput = Promise<JSX.Element>;
export type ISelection = renderer.ReactTestRenderer;
export type IStore = renderer.ReactTestRenderer;
export type ISubject = renderer.ReactTestRenderer;
export type ITestImpl<ITestShape extends IBaseTest> = ITestImplementation<ITestShape>;
export type ITestSpec<ITestShape extends IBaseTest> = ITestSpecification<ITestShape>;
export declare const testInterface: {
    beforeEach: (CComponent: any) => Promise<renderer.ReactTestRenderer>;
    andWhen: (renderer: renderer.ReactTestRenderer, whenCB: () => (any: any) => any) => Promise<renderer.ReactTestRenderer>;
};
