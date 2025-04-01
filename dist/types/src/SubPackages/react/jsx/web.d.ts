import { IPartialWebInterface } from "../../../Types";
import { ITestSpec, IInput } from "./index.js";
declare const _default: <ITestShape extends any>(testImplementations: any, testSpecifications: ITestSpec<ITestShape>, testInput: IInput, testInterface: Partial<import("../../../Types").IWebTestInterface<ITestShape>>) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
