import { IBaseTest, IPartialWebInterface } from "../../../Types";
import { ITestImpl, ITestSpec, IInput } from "./index.js";
declare const _default: <ITestShape extends IBaseTest<any, any>>(testImplementations: ITestImpl<ITestShape>, testSpecifications: ITestSpec<ITestShape>, testInput: IInput, testInterface: Partial<import("../../../lib/types").IWebTestInterface<ITestShape>>) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
