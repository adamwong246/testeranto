import { IPartialWebInterface, ITestImplementation, ITestSpecification, OT } from "../../../Types";
import { I, IInput } from "./dynamic.js";
declare const _default: <O extends OT, M>(testInput: IInput, testSpecifications: ITestSpecification<I, O>, testImplementations: ITestImplementation<I, O, M>, testInterface: IPartialWebInterface<I>) => Promise<import("../../../lib/core.js").default<I, O, M>>;
export default _default;
