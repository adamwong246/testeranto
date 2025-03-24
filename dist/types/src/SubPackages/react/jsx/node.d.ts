import { IPartialInterface } from "../../../Types";
import { ITestImpl, ITestSpec, IInput } from "./index.js";
declare const _default: <ITestShape extends any>(testImplementations: ITestImpl<ITestShape>, testSpecifications: ITestSpec<ITestShape>, testInput: IInput, testInterface?: Partial<import("../../../lib/types.js").ITestInterface<ITestShape>>) => Promise<import("../../../lib/core.js").default<ITestShape>>;
export default _default;
