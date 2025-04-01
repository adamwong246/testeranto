import { ITestSpecification } from "../../../Types";
import type { IInput } from "./index";
export declare type ISubject = HTMLElement;
declare const _default: <ITestShape extends any>(testImplementations: any, testSpecifications: ITestSpecification<ITestShape>, testInput: IInput) => Promise<import("../../../lib/core.js").default<ITestShape>>;
export default _default;
