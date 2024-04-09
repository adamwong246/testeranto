import { ITTestShape } from "../../../Types";
import { ITestImpl, ITestSpec, IInput } from "./index";
declare const _default: <ITestShape extends ITTestShape>(testImplementations: ITestImpl<ITestShape>, testSpecifications: ITestSpec<ITestShape>, testInput: IInput) => Promise<void>;
export default _default;
