import { IBaseTest, IPartialNodeInterface, ITestImplementation, ITestSpecification } from "../Types";
type IInput = string;
export type IImpl<ISpec extends IBaseTest> = ITestImplementation<ISpec>;
export type ISpec<T extends IBaseTest> = ITestSpecification<T>;
declare const _default: <ITestShape extends IBaseTest>(testInput: IInput, testSpecifications: ISpec<ITestShape>, testImplementations: ITestImplementation<ITestShape>, testInterface?: IPartialNodeInterface<ITestShape>) => Promise<import("../lib/core.js").default<ITestShape>>;
export default _default;
