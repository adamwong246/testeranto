import { ITTestShape } from "../../../core";
import { ITestImpl, ITestSpec, IInput } from ".";
declare const _default: <ITestShape extends ITTestShape>(testImplementations: ITestImpl<ITestShape>, testSpecifications: ITestSpec<ITestShape>, testInput: IInput) => Promise<void>;
export default _default;
