import { renderToStaticMarkup, renderToStaticNodeStream } from "react-dom/server";
import Stream from "stream";
import { Ibdd_in, Ibdd_out, ITestImplementation, ITestSpecification } from "../../../Types";
export { renderToStaticMarkup, renderToStaticNodeStream, Stream };
declare const _default: <I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(testImplementations: ITestImplementation<I, O>, testSpecifications: ITestSpecification<I, O>, testInput: I["iinput"]) => Promise<import("../../../lib/core.js").default<I, O>>;
export default _default;
