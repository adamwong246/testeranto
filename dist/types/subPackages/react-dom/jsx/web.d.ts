import { IBaseTest, ITestImplementation, ITestSpecification } from "../../../Types";
import type { IInput } from "./index";
export declare type ISubject = HTMLElement;
declare const _default: <ITestShape extends IBaseTest<any, any>>(testImplementations: ITestImplementation<ITestShape, object>, testSpecifications: ITestSpecification<ITestShape>, testInput: IInput) => void;
export default _default;
