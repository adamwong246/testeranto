import { renderToStaticMarkup, renderToStaticNodeStream } from "react-dom/server";
import Stream from 'stream';
import { ITestImplementation, ITestSpecification } from "../../../Types";
export { renderToStaticMarkup, renderToStaticNodeStream, Stream };
declare const _default: <ITestShape extends any>(testImplementations: any, testSpecifications: ITestSpecification<ITestShape>, testInput: ITestShape["iinput"]) => Promise<import("../../../lib/core.js").default<ITestShape>>;
export default _default;
