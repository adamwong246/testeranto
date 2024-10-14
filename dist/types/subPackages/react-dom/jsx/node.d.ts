import { renderToStaticMarkup, renderToStaticNodeStream } from "react-dom/server";
import Stream from 'stream';
import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";
export { renderToStaticMarkup, renderToStaticNodeStream, Stream };
declare const _default: <ITestShape extends IBaseTest>(testImplementations: any, testSpecifications: ITestSpecification<ITestShape>, testInput: ITestShape["iinput"]) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
