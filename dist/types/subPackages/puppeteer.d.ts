import { IBaseTest, IPartialInterface, ITestImplementation, ITestSpecification } from "../Types";
declare type IInput = string;
export declare type IImpl<ISpec extends IBaseTest> = ITestImplementation<ISpec, object>;
export declare type ISpec<T extends IBaseTest> = ITestSpecification<T>;
declare const _default: <ITestShape extends IBaseTest>(testInput: IInput, testSpecifications: ISpec<ITestShape>, testImplementations: ITestImplementation<ITestShape, object>, testInterface?: Partial<import("../Types").ITestInterface<ITestShape>> | undefined) => Promise<import("../lib/core").default<ITestShape>>;
export default _default;
