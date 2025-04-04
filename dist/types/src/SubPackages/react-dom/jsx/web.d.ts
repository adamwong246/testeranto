import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";
import type { IInput } from "./index";
export type ISubject = HTMLElement;
declare const _default: <ITestShape extends IBaseTest>(testImplementations: ITestImplementation<ITestShape>, testSpecifications: ITestSpecification<ITestShape>, testInput: IInput) => Promise<import("../../../lib/core.js").default<ITestShape>>;
export default _default;
