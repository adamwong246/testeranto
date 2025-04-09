import { IPartialInterface, ITestImplementation, ITestSpecification, OT } from "../../../Types";
import { I } from "./index.js";
declare const _default: <O extends OT, M = {}>(testImplementations: ITestImplementation<I, O, M>, testSpecifications: ITestSpecification<I, O>, testInput: I["iinput"], testInterface?: IPartialInterface<I>) => Promise<import("../../../lib/core.js").default<I, O, M>>;
export default _default;
