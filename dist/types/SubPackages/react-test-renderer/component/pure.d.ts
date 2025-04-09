import { ITestImplementation, ITestSpecification, OT } from "../../../Types.js";
import { IInput, I } from "./index.js";
declare const _default: <O extends OT, M = {}>(testImplementations: ITestImplementation<I, O, M>, testSpecifications: ITestSpecification<I, O>, testInput: IInput<any, any>) => Promise<import("../../../lib/core.js").default<I, O, M>>;
export default _default;
