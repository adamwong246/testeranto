import renderer from "react-test-renderer";
import { Ibdd_in, Ibdd_out, ITestImplementation, ITestSpecification } from "../../../Types";
export type IWhenShape = any;
export type IThenShape = any;
export type InitialState = unknown;
export type IInput = Promise<JSX.Element>;
export type ISelection = renderer.ReactTestRenderer;
export type IStore = renderer.ReactTestRenderer;
export type ISubject = renderer.ReactTestRenderer;
export type ITestImpl<I extends Ibdd_in<renderer.ReactTestRenderer, renderer.ReactTestRenderer, renderer.ReactTestRenderer, renderer.ReactTestRenderer, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = ITestImplementation<I, O>;
export type ITestSpec<I extends Ibdd_in<renderer.ReactTestRenderer, renderer.ReactTestRenderer, renderer.ReactTestRenderer, renderer.ReactTestRenderer, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = ITestSpecification<I, O>;
export declare const testInterface: {
    beforeEach: (CComponent: any) => Promise<unknown>;
    andWhen: (renderer: renderer.ReactTestRenderer, whenCB: () => (any: any) => any) => Promise<renderer.ReactTestRenderer>;
};
