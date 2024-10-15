import { IBaseTest } from "../../../Types";
import { ITestImpl, ITestSpec } from "../../react/jsx";
import { IInput } from "./index";
declare const _default: <ITestShape extends IBaseTest>(testImplementations: ITestImpl<ITestShape>, testSpecifications: ITestSpec<ITestShape>, testInput: IInput) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
