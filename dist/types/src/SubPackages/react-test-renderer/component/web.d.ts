import { IBaseTest } from "../../../Types";
import { IImpl, ISpec, IInput } from "./index.js";
declare const _default: <ITestShape extends IBaseTest, IProps, IState>(testImplementations: IImpl<ITestShape>, testSpecifications: ISpec<ITestShape>, testInput: IInput<any, any>) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
