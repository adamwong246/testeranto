import { IInput } from ".";
import { IBaseTest } from "../../../Types";
import { ITestImpl, ITestSpec } from "../../react/jsx";
declare const _default: <ITestShape extends IBaseTest<any, any>>(testImplementations: ITestImpl<ITestShape>, testSpecifications: ITestSpec<ITestShape>, testInput: IInput) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
