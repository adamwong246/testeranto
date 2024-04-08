import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../core";
import { IInput, ISelection, IStore, IThenShape, IWhenShape, IState } from ".";
export declare type ISubject = HTMLElement;
declare const _default: <ITestShape extends ITTestShape>(testImplementations: ITestImplementation<unknown, HTMLElement, any, any, ITestShape>, testSpecifications: ITestSpecification<ITestShape, HTMLElement, HTMLElement, HTMLElement, any>, testInput: IInput) => void;
export default _default;
