import { IBaseTest } from "../../../Types";
import { ITestImpl, ITestSpec } from "../../react/jsx";
import { IInput } from "./index";
declare const _default: <ITestShape extends IBaseTest>(testImplementations: ITestImpl<ITestShape>, testSpecifications: ITestSpec<ITestShape>, testInput: IInput) => Promise<void>;
export default _default;
