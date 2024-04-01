import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../core";
declare type InitialState = unknown;
declare type IWhenShape = any;
declare type IThenShape = any;
declare type ISelection = IStore;
declare type Prototype = () => JSX.Element;
declare type IStore = {
    root: HTMLElement;
    react: HTMLElement;
};
declare type ISubject = {
    root: HTMLElement;
};
declare const _default: <ITestShape extends ITTestShape>(testImplementations: ITestImplementation<unknown, IStore, any, any, ITestShape>, testSpecifications: ITestSpecification<ITestShape, ISubject, IStore, IStore, any>, testInput: Prototype) => Promise<void>;
export default _default;
