import { ITestImplementation, ITestSpecification, OT } from "../../../Types";
import { I } from "./static.js";
declare const _default: <O extends OT, M>(testImplementations: ITestImplementation<I, O, M>, testSpecifications: ITestSpecification<I, O>, testInput: I["iinput"]) => Promise<import("../../../lib/core.js").default<I, O, M>>;
export default _default;
