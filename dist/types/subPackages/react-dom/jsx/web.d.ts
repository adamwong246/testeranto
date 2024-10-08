import { ITTestShape } from "../../../lib";
import { ITestImplementation, ITestSpecification } from "../../../Types";
import { IInput, ISelection, IStore, IThenShape, IWhenShape, IState } from "./index";
export declare type ISubject = HTMLElement;
declare const _default: <ITestShape extends ITTestShape>(testImplementations: ITestImplementation<unknown, HTMLElement, any, any, ITestShape, any>, testSpecifications: ITestSpecification<ITestShape, HTMLElement, HTMLElement, HTMLElement, any, any>, testInput: IInput) => void;
export default _default;
