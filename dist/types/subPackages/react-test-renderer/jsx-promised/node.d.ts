import { ITestImpl, ITestSpec, IInput } from "./index";
import { ITTestShape } from "../../../lib";
declare const _default: <ITestShape extends ITTestShape>(testImplementations: ITestImpl<ITestShape>, testSpecifications: ITestSpec<ITestShape>, testInput: IInput) => Promise<void>;
export default _default;
