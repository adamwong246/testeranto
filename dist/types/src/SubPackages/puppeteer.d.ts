import { IBaseTest, IPartialNodeInterface, ITestImplementation, ITestSpecification } from "../Types";
declare type IInput = string;
export declare type IImpl<ISpec extends IBaseTest> = ITestImplementation<ISpec>;
export declare type ISpec<T extends IBaseTest> = ITestSpecification<T>;
declare const _default: <ITestShape extends any>(testInput: IInput, testSpecifications: ISpec<ITestShape>, testImplementations: any, testInterface?: Partial<import("../Types").INodeTestInterface<ITestShape>> | undefined) => Promise<import("../lib/core.js").default<ITestShape>>;
export default _default;
