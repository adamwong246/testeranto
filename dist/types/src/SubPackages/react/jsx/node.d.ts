import { IBaseTest, IPartialInterface } from "../../../Types";
import { ITestSpec, IInput } from "./index.js";
declare const _default: <ITestShape extends IBaseTest<IInput, number, number, number, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(testImplementations: any, testSpecifications: ITestSpec<ITestShape>, testInput: IInput, testInterface?: Partial<import("../../../Types").ITestInterface<ITestShape>>) => Promise<import("../../../lib/core.js").default<ITestShape>>;
export default _default;
