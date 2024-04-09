import { renderToStaticMarkup, renderToStaticNodeStream } from "react-dom/server";
import Stream from 'stream';
import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../Types";
import { IInput, ISelection, IStore, IThenShape, IWhenShape, IState } from "./index";
declare type ISubject = void;
export { renderToStaticMarkup, renderToStaticNodeStream, Stream };
declare const _default: <ITestShape extends ITTestShape>(testImplementations: ITestImplementation<IInput, unknown, HTMLElement, any, any, ITestShape>, testSpecifications: ITestSpecification<ITestShape, void, HTMLElement, HTMLElement, any>, testInput: IInput) => Promise<void>;
export default _default;
