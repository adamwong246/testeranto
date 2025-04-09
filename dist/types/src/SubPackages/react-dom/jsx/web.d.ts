import { ITestImplementation, ITestSpecification, OT } from "../../../Types";
import type { IInput } from "./index";
import { I } from "./dynamic.js";
declare const _default: <O extends OT, M>(testImplementations: ITestImplementation<I, O, M>, testSpecifications: ITestSpecification<I, O>, testInput: IInput) => Promise<import("../../../lib/core.js").default<I, O, M>>;
export default _default;
